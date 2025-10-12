// controller/contract.controller.js
import Article from "../schemas/article.schema.js";
import Contract from "../schemas/contract.schema.js";
import User from "../schemas/user.schema.js";
import { notify } from "../services/notification.service.js";

export const sellerSignContract = async (req, res) => {
  try {
    const { articleId } = req.params;
    const seller = req.user;
    const sellerId = seller?._id || seller?.id;

    // Fetch article with author + winner populated
    const article = await Article.findById(articleId).populate("author winner");
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }

    // Validate seller identity
    if (String(article.author._id || article.author) !== String(sellerId)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to sign this contract",
        });
    }

    // Find or create a contract for this article
    let contract = await Contract.findOne({ article: articleId });

    // Track whether buyer had already signed before this call
    let buyerHadSignedBefore = false;

    if (!contract) {
      // Seller signs first → create contract (incomplete)
      const buyer = await User.findById(article.winner);
      if (!buyer) {
        return res
          .status(404)
          .json({ success: false, message: "Buyer not found" });
      }

      contract = new Contract({
        buyer: buyer._id,
        author: sellerId,
        article: articleId,
        articleTitle: article.title,
        buyerName: buyer.name,
        authorName: seller.name,
        finalPrice: article.highest_bid,
        contractPeriod: "30 Days",
        terms: `
          Buyer agrees to purchase "${article.title}" for ${Number(
          article.highest_bid
        )} THB.
          Seller agrees to deliver ownership rights upon full payment.
          Contract period: ${article.duration || 30} days.
          Both parties are bound by InkBid's terms of service.
        `,
        sellerSigned: true,
        status: "incomplete",
      });
    } else {
      // Contract exists → update seller signature
      buyerHadSignedBefore = !!contract.buyerSigned;

      if (contract.sellerSigned) {
        return res.status(409).json({
          success: false,
          message: "You have already signed this contract",
        });
      }

      contract.sellerSigned = true;
    }

    // Transition status if both signatures are present now
    let justCompleted = false;
    if (contract.buyerSigned && contract.sellerSigned) {
      if (contract.status !== "complete") {
        justCompleted = true; // ⇦ becomes complete in THIS call
      }
      contract.status = "complete";
      article.status = "awaiting_payment";
      await article.save();
    } else {
      contract.status = "incomplete";
    }

    await contract.save();

    // 🔔 NOTIFICATION: if buyer signed first and seller just completed it now → tell buyer to pay
    if (justCompleted && buyerHadSignedBefore) {
      const buyerId =
        article.winner?._id || article.winner?.id || article.winner;
      await notify(buyerId, {
        type: "payment_due",
        title: "💳 Seller signed the contract",
        message: `Seller has signed for “${article.title}”. Please complete your payment.`,
        target: {
          kind: "article",
          id: article._id,
          url: `/dashboard/buyer/articles/${article._id}`,
        },
      });
    }

    res.status(200).json({
      success: true,
      message:
        contract.status === "complete"
          ? "Both parties have signed. Contract complete."
          : "Seller signed successfully. Waiting for buyer to sign.",
      contract,
    });
  } catch (err) {
    console.error("Error in sellerSignContract:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
