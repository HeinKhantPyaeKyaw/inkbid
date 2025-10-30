import mongoose from 'mongoose';
import Article from '../schemas/article.schema.js';
import Bid from '../schemas/bids.schema.js';
import BuyerInventory from '../schemas/buyer-inventory.schema.js';
import Contract from '../schemas/contract.schema.js';
import User from '../schemas/user.schema.js';
import { uploadPDFToFirebase } from '../utils/firebase/uploadToFirebase.js';
import { generateContractPDF } from '../utils/pdf/contractGenerator.js';

// Normalize Decimal128 values to plain JS numbers
function normalizeArticle(article) {
  return {
    ...article,
    highest_bid: Number(article.highest_bid ?? 0),
    min_bid: Number(article.min_bid ?? 0),
    buy_now: Number(article.buy_now ?? 0),
  };
}

// ------------------ Controllers ---------------------

export const getBuyerArticles = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const buyerBids = await Bid.find({ 'bids.ref_user': buyerId }).lean();

    const articleIds = buyerBids.map((b) => b.refId);

    const articles = await Article.find({
      _id: { $in: articleIds },
      status: {
        $in: [
          'in_progress',
          'awaiting_contract',
          'awaiting_payment',
          // 'completed',
        ],
      },
    })
      .populate('author', 'name img_url rating')
      .lean();

    // Combine each article with the buyer's latest bid
    const result = articles.map((article) => {
      const matchingBidDoc = buyerBids.find(
        (b) => String(b.refId) === String(article._id),
      );

      const buyerSpecificBids =
        matchingBidDoc?.bids?.filter(
          (b) => String(b.ref_user) === String(buyerId),
        ) || [];

      buyerSpecificBids.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );

      const latestBuyerBid = buyerSpecificBids.length
        ? Number(buyerSpecificBids[0].amount)
        : 0;

      let timeRemaining = '-';
      if (article.ends_in) {
        const now = new Date();
        const end = new Date(article.ends_in);
        const diffMs = end - now;

        if (diffMs > 0) {
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
          const mins = Math.floor((diffMs / (1000 * 60)) % 60);
          timeRemaining = `${days.toString().padStart(2, '0')} Days ${hours
            .toString()
            .padStart(2, '0')} Hours ${mins.toString().padStart(2, '0')} Mins`;
        } else {
          timeRemaining = 'Expired';
        }
      }

      return {
        _id: article._id,
        title: article.title || 'Untitled',
        yourBid: latestBuyerBid,
        currentBid: Number(article.highest_bid ?? 0),
        timeRemaining: timeRemaining,
        status: article.status,
        author: {
          name: article.author.name || 'Unknown',
        },
      };
    });

    // const normalizeArticles = articles.map(normalizeArticle);

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('Error fetching buyer articles: ', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getBuyerInventory = async (req, res) => {
  try {
    const { buyerId } = req.params;

    // 1️⃣ Fetch all inventory for this buyer
    const inventory = await BuyerInventory.find({ buyer: buyerId })
      .populate('article', 'title img_url')
      .lean();

    // 2️⃣ Prepare a bulk update array (for expired / reactivated items)
    const updates = [];

    // 3️⃣ Check each item’s expiry based on purchasedDate + contractPeriod
    for (const item of inventory) {
      const purchaseDate = new Date(item.purchasedDate);

      // Extract number of days from "30 Days"
      const contractDays = parseInt(item.contractPeriod) || 30;

      const expiryDate = new Date(purchaseDate);
      expiryDate.setDate(expiryDate.getDate() + contractDays);

      const now = new Date();
      const isExpired = now > expiryDate;

      // 🔹 If expired but not marked yet
      if (isExpired && item.contractStatus !== 'expired') {
        updates.push({
          updateOne: {
            filter: { _id: item._id },
            update: { $set: { contractStatus: 'expired' } },
          },
        });
        item.contractStatus = 'expired'; // reflect change in returned data
      }
      // 🔹 If active but wrongly marked as expired
      else if (!isExpired && item.contractStatus !== 'active') {
        updates.push({
          updateOne: {
            filter: { _id: item._id },
            update: { $set: { contractStatus: 'active' } },
          },
        });
        item.contractStatus = 'active';
      }
    }

    // 4️⃣ Perform all updates in one go (if any)
    if (updates.length > 0) {
      await BuyerInventory.bulkWrite(updates);
      console.log(
        `✅ Updated ${updates.length} contract statuses for buyer ${buyerId}`,
      );
    }

    // 5️⃣ Return the inventory with refreshed statuses
    return res.status(200).json({ success: true, data: inventory });
  } catch (err) {
    console.error('❌ Error fetching buyer inventory:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// -------------------- Sign Contract ---------------------------

export const signContract = async (req, res) => {
  try {
    const { buyerId, articleId } = req.params;

    const article = await Article.findById(articleId).populate('author');
    if (!article) {
      return res
        .status(404)
        .json({ success: false, error: 'Article not found' });
    }

    if (String(article.winner) !== String(buyerId)) {
      return res
        .status(403)
        .json({ success: false, error: 'Not authorized to sign' });
    }

    article.status = 'awaiting_payment';
    await article.save();

    const buyer = await User.findById(buyerId);
    const newContract = new Contract({
      buyer: buyerId,
      author: article.author._id,
      article: articleId,
      articleTitle: article.title,
      buyerName: buyer.name,
      authorName: article.author.name,
      finalPrice: article.highest_bid,
      contractPeriod: '30 days',
      terms: `
        Buyer agrees to the purchase of "${article.title}" for ${Number(
        article.highest_bid,
      )} THB.
        Seller guarantees ownership transfer of content after full payment.
        Contract period: ${article.duration || 30} days.
        Both parties agree to comply with InkBid platform rules.
      `,
    });

    await newContract.save();

    return res.status(200).json({
      success: true,
      message: 'Contract signed successfully.',
      article: normalizeArticle(article.toObject()),
      contract: newContract,
    });
  } catch (err) {
    console.error('Error signing contract: ', err);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// ----------------- Proceed Payment -------------------

export const proceedPayment = async (req, res) => {
  try {
    const { buyerId, articleId } = req.params;

    const article = await Article.findById(articleId).populate('author');
    if (!article) {
      return res
        .status(404)
        .json({ success: false, error: 'Article not found.' });
    }

    if (String(article.winner) !== String(buyerId)) {
      return res
        .status(403)
        .json({ success: false, error: 'Not authorized to pay' });
    }

    article.status = 'completed';
    article.proprietor = buyerId;
    await article.save();

    const existingContract = await Contract.findOne({
      buyer: buyerId,
      article: articleId,
      status: 'awaiting_payment',
    }).populate('buyer author');

    if (!existingContract) {
      return res
        .status(404)
        .json({ success: false, error: 'Contract not found' });
    }

    existingContract.status = 'finalized';
    existingContract.purchasedDate = new Date();

    const pdfBuffer = await generateContractPDF({
      articleTitle: article.title,
      buyerName: existingContract.buyer.name,
      authorName: existingContract.author.name,
      finalPrice: article.highest_bid,
      contractPeriod: existingContract.contractPeriod,
      agreementDate: existingContract.agreementDate,
      purchasedDate: existingContract.purchasedDate,
      terms: existingContract.terms,
    });

    const pdfUrl = await uploadPDFToFirebase(
      pdfBuffer,
      `contract-${article.id}-${buyerId}`,
    );

    existingContract.contractUrl = pdfUrl;
    await existingContract.save();

    // if (existingContract) {
    //   existingContract.status = 'finalized';
    //   existingContract.purchasedDate = new Date();
    //   await existingContract.save();
    // }

    const period = existingContract.contractPeriod || '30 Days';
    const newInventory = new BuyerInventory({
      buyer: buyerId,
      article: articleId,
      purchasedDate: new Date(),
      contractPeriod: period, // FIXME: Contract Duration might be added later. article.duration is not right.
      contractStatus: 'active',
      paymentStatus: 'paid',
      contractUrl: pdfUrl,
      articleUrl: article.article_url || null,
    });

    await newInventory.save();

    const populatedInventory = await BuyerInventory.findById(newInventory._id)
      .populate('article', 'title img_url')
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Payment processed, article moved to inventory',
      inventory: populatedInventory,
      contract: {
        id: existingContract._id,
        url: existingContract.contractUrl,
        status: existingContract.status,
      },
    });
  } catch (err) {
    console.error('Error processing payment: ', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// --------------------- Download Contract --------------------------

export const downloadContract = async (req, res) => {
  try {
    const { buyerId, inventoryId } = req.params;

    const inventory = await BuyerInventory.findOne({
      _id: inventoryId,
      buyer: buyerId,
    }).lean();

    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, error: 'Inventory not found' });
    }

    if (!inventory.contractUrl) {
      return res
        .status(404)
        .json({ success: false, error: 'No contract file found' });
    }

    // return res.redirect(inventory.contractUrl);
    return res.status(200).json({ success: true, url: inventory.contractUrl });
  } catch (err) {
    console.error('Error downloading contract: ', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// --------------------- Download Article ------------------------------

export const downloadArticle = async (req, res) => {
  try {
    const { buyerId, inventoryId } = req.params;

    const inventory = await BuyerInventory.findOne({
      _id: inventoryId,
      buyer: buyerId,
    }).lean();

    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, error: 'Inventory not found' });
    }

    if (!inventory.articleUrl) {
      return res
        .status(404)
        .json({ success: false, error: 'No article file found' });
    }

    // return res.redirect(inventory.articleUrl);
    return res.status(200).json({ success: true, url: inventory.articleUrl });
  } catch (err) {
    console.error('Error downloading article: ', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ============================================================
// 🆕 NEW CONTROLLER: getBuyerCompletedArticles
// Purpose: Return all completed articles (from Article + Contract)
// ============================================================
export const getBuyerCompletedArticles = async (req, res) => {
  try {
    const { buyerId } = req.params;

    // 1️⃣ Find all completed articles that belong to this buyer
    const completedArticles = await Article.find({
      winner: buyerId,
      status: 'completed',
    })
      .populate('author', 'name img_url')
      .sort({ updatedAt: -1 })
      .lean();

    if (completedArticles.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No completed articles found.',
      });
    }

    // 2️⃣ Find related finalized contracts for those articles
    const articleIds = completedArticles.map((a) => a._id);
    const contracts = await Contract.find({
      buyer: buyerId,
      article: { $in: articleIds },
      status: 'finalized',
    })
      .select('article contractUrl')
      .lean();

    // 3️⃣ Make a quick lookup map for contract URLs
    const contractMap = {};
    for (const c of contracts) {
      contractMap[String(c.article)] = c.contractUrl || null;
    }

    // 4️⃣ Merge article + contract info into one clean response
    const result = completedArticles.map((article) => ({
      _id: article._id,
      title: article.title || 'Untitled',
      purchasedDate: article.updatedAt || article.createdAt,
      contractPeriod: '30 Days', // default fallback
      contractStatus: 'Active', // can extend later with expiry logic
      contractUrl: contractMap[String(article._id)] || null,
      articleUrl: article.article_url || null,
      author: article.author?.name || 'Unknown Seller',
    }));

    // 5️⃣ Send back the merged dataset
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error('❌ Error fetching buyer completed articles:', err);
    return res.status(500).json({
      success: false,
      error: 'Server error while fetching completed articles.',
    });
  }
};
