// controller/paypalpayment.controller.js
import axios from 'axios';
import {
  PAYPAL_API_BASE,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
} from '../config/env.js';

// 🟢 NEW: import InkBid models & helpers so we can reuse your existing flow
import Article from '../schemas/article.schema.js';
import BuyerInventory from '../schemas/buyer-inventory.schema.js';
import Contract from '../schemas/contract.schema.js';
import User from '../schemas/user.schema.js';
import { uploadPDFToFirebase } from '../utils/firebase/uploadToFirebase.js';
import { generateContractPDF } from '../utils/pdf/contractGenerator.js';

/* -------------------------------------------------------------------------- */
/* STEP 6.1 – Generate short-lived PayPal access token                        */
/* -------------------------------------------------------------------------- */
async function generateAccessToken() {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString('base64');

  const res = await axios.post(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  return res.data.access_token;
}

/* -------------------------------------------------------------------------- */
/* STEP 6.2 – Create PayPal Order (unchanged)                                 */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* STEP 6.2 – Create PayPal Order (✅ Updated with redirect URLs)             */
/* -------------------------------------------------------------------------- */
export const createPayPalOrder = async (req, res) => {
  try {
    const { amount, currency = 'USD' } = req.body;
    const accessToken = await generateAccessToken();

    // ✅ Include redirect URLs and UI settings for proper checkout flow
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
      application_context: {
        brand_name: 'InkBid',
        landing_page: 'LOGIN', // Options: LOGIN or NO_PREFERENCE
        user_action: 'PAY_NOW', // Forces the "Pay Now" button
        return_url: 'http://localhost:3000/paypal/success', // ✅ redirect after approval
        cancel_url: 'http://localhost:3000/paypal/cancel', // ✅ redirect if canceled
      },
    };

    // 🔹 Create PayPal order
    const order = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      orderPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // ✅ Return the order info back to the frontend
    res.status(200).json({
      success: true,
      id: order.data.id,
      links: order.data.links,
    });
  } catch (err) {
    console.error(
      '❌ Create PayPal Order Error:',
      err.response?.data || err.message,
    );
    res.status(500).json({
      success: false,
      message: 'Failed to create PayPal order',
      details: err.response?.data || null,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* STEP 6.3 – Capture PayPal Order and process InkBid payment 🟢 NEW LOGIC     */
/* -------------------------------------------------------------------------- */
export const capturePayPalOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { articleId } = req.body;
    const buyer = req.user;
    const buyerId = buyer?._id || buyer?.id;

    console.log('🔍 Capturing PayPal order ID:', orderId);

    // 1️⃣ Generate PayPal token
    const token = await generateAccessToken();

    /* 🟢 Check if the order is APPROVED first */
    const orderCheck = await axios.get(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const orderStatus = orderCheck.data.status;
    console.log('🔎 Current PayPal order status:', orderStatus);

    if (orderStatus !== 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: `Order not yet approved. Current status: ${orderStatus}`,
      });
    }

    /* 🟢 Capture the order */
    const captureRes = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const capture = captureRes.data;
    console.log('✅ PayPal Capture Response:', capture.status);

    if (capture.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed on PayPal',
        details: capture,
      });
    }

    // 2️⃣ Find article and validate buyer
    const article = await Article.findById(articleId).populate('author');
    if (!article)
      return res
        .status(404)
        .json({ success: false, message: 'Article not found' });

    if (String(article.winner) !== String(buyerId))
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized' });

    // ⚡️ STEP 3️⃣ ADD PLATFORM FEE DEDUCTION (USING PAYPAL CAPTURE AMOUNT)
    const PLATFORM_FEE_PERCENT = 10; // or load from process.env.PLATFORM_FEE_PERCENT

    // 🟢 Extract actual paid amount from PayPal response
    const paidAmountStr =
      capture?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
    const paidCurrency =
      capture?.purchase_units?.[0]?.payments?.captures?.[0]?.amount
        ?.currency_code;

    if (!paidAmountStr) {
      console.warn(
        '⚠️ Could not find paid amount in PayPal capture — falling back to article.highest_bid',
      );
    }

    const paidAmount = parseFloat(paidAmountStr || article.highest_bid);

    // 🧮 Calculate fees based on actual PayPal amount
    const platformFee = (paidAmount * PLATFORM_FEE_PERCENT) / 100;
    const sellerEarning = paidAmount - platformFee;

    console.log(
      `💰 Actual Paid Amount (${paidCurrency || 'N/A'}):`,
      paidAmount,
    );
    console.log(`💰 Platform Fee (${PLATFORM_FEE_PERCENT}%):`, platformFee);
    console.log(`💸 Seller Earning after fee:`, sellerEarning);

    // ----------------------------------------------------------

    // 4️⃣ Update article status
    article.status = 'completed';
    article.proprietor = buyerId;
    await article.save();

    // 5️⃣ Find and finalize contract
    const contract = await Contract.findOne({
      buyer: buyerId,
      article: articleId,
      status: { $in: ['complete', 'awaiting_payment'] },
    }).populate('buyer author');

    if (!contract)
      return res
        .status(404)
        .json({ success: false, message: 'Contract not found' });

    contract.status = 'finalized';
    contract.purchasedDate = new Date();

    // ⚡️ SAVE DEDUCTION INFO INTO CONTRACT FOR REFERENCE
    contract.platformFeePercent = PLATFORM_FEE_PERCENT;
    contract.platformFeeAmount = platformFee;
    contract.sellerEarning = sellerEarning;

    // 6️⃣ Generate contract PDF & upload
    const pdfBuffer = await generateContractPDF({
      articleTitle: article.title,
      buyerName: contract.buyer.name,
      authorName: contract.author.name,
      finalPrice: article.highest_bid,
      contractPeriod: contract.contractPeriod,
      agreementDate: contract.agreementDate,
      purchasedDate: contract.purchasedDate,
      terms: contract.terms,
    });

    const pdfUrl = await uploadPDFToFirebase(
      pdfBuffer,
      `contract-${articleId}-${buyerId}`,
    );
    contract.contractUrl = pdfUrl;
    await contract.save();

    // 7️⃣ Add to BuyerInventory
    const newInventory = await BuyerInventory.create({
      buyer: buyerId,
      article: articleId,
      purchasedDate: new Date(),
      contractPeriod: contract.contractPeriod || '30 Days',
      contractStatus: 'active',
      paymentStatus: 'paid',
      contractUrl: pdfUrl,
      articleUrl: article.article_url || null,
      // ⚡️ Include fee data for transparency
      platformFeePercent: PLATFORM_FEE_PERCENT,
      platformFeeAmount: platformFee,
      sellerEarning,
    });

    const inventory = await BuyerInventory.findById(newInventory._id)
      .populate('article', 'title img_url')
      .lean();

    // ✅ Done
    res.status(200).json({
      success: true,
      message: '✅ PayPal payment captured and processed successfully',
      paypalStatus: capture.status,
      platformFee: {
        percent: PLATFORM_FEE_PERCENT,
        amount: platformFee,
      },
      sellerEarning,
      inventory,
      contract: {
        id: contract._id,
        url: contract.contractUrl,
        status: contract.status,
      },
    });
  } catch (err) {
    console.error(
      '❌ Capture PayPal Order Error:',
      err.response?.data || err.message,
    );
    res.status(500).json({
      success: false,
      message: 'Failed to capture PayPal order',
      details: err.response?.data || null,
    });
  }
};

// export const capturePayPalOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { articleId } = req.body;
//     const buyer = req.user;
//     const buyerId = buyer?._id || buyer?.id;

//     console.log('🔍 Capturing PayPal order ID:', orderId);

//     // 1️⃣ Generate PayPal token
//     const token = await generateAccessToken();

//     /* 🟢 NEW STEP: Check if the order is APPROVED first */
//     const orderCheck = await axios.get(
//       `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`,
//       { headers: { Authorization: `Bearer ${token}` } },
//     );

//     const orderStatus = orderCheck.data.status;
//     console.log('🔎 Current PayPal order status:', orderStatus);

//     if (orderStatus !== 'APPROVED') {
//       return res.status(400).json({
//         success: false,
//         message: `Order not yet approved. Current status: ${orderStatus}`,
//       });
//     }

//     /* 🟢 Only proceed to capture if approved */
//     const captureRes = await axios.post(
//       `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } },
//     );

//     const capture = captureRes.data;
//     console.log('✅ PayPal Capture Response:', capture.status);

//     if (capture.status !== 'COMPLETED') {
//       return res.status(400).json({
//         success: false,
//         message: 'Payment not completed on PayPal',
//         details: capture,
//       });
//     }

//     // 2️⃣ Find article and validate buyer
//     const article = await Article.findById(articleId).populate('author');
//     if (!article)
//       return res
//         .status(404)
//         .json({ success: false, message: 'Article not found' });

//     if (String(article.winner) !== String(buyerId))
//       return res
//         .status(403)
//         .json({ success: false, message: 'Not authorized' });

//     // 3️⃣ Update article status
//     article.status = 'completed';
//     article.proprietor = buyerId;
//     await article.save();

//     // 4️⃣ Find and finalize contract
//     const contract = await Contract.findOne({
//       buyer: buyerId,
//       article: articleId,
//       status: { $in: ['complete', 'awaiting_payment'] },
//     }).populate('buyer author');

//     if (!contract)
//       return res
//         .status(404)
//         .json({ success: false, message: 'Contract not found' });

//     contract.status = 'finalized';
//     contract.purchasedDate = new Date();

//     // 5️⃣ Generate contract PDF & upload
//     const pdfBuffer = await generateContractPDF({
//       articleTitle: article.title,
//       buyerName: contract.buyer.name,
//       authorName: contract.author.name,
//       finalPrice: article.highest_bid,
//       contractPeriod: contract.contractPeriod,
//       agreementDate: contract.agreementDate,
//       purchasedDate: contract.purchasedDate,
//       terms: contract.terms,
//     });

//     const pdfUrl = await uploadPDFToFirebase(
//       pdfBuffer,
//       `contract-${articleId}-${buyerId}`,
//     );
//     contract.contractUrl = pdfUrl;
//     await contract.save();

//     // 6️⃣ Add to BuyerInventory
//     const newInventory = await BuyerInventory.create({
//       buyer: buyerId,
//       article: articleId,
//       purchasedDate: new Date(),
//       contractPeriod: contract.contractPeriod || '30 Days',
//       contractStatus: 'active',
//       paymentStatus: 'paid',
//       contractUrl: pdfUrl,
//       articleUrl: article.article_url || null,
//     });

//     const inventory = await BuyerInventory.findById(newInventory._id)
//       .populate('article', 'title img_url')
//       .lean();

//     // ✅ Done
//     res.status(200).json({
//       success: true,
//       message: '✅ PayPal payment captured and processed successfully',
//       paypalStatus: capture.status,
//       inventory,
//       contract: {
//         id: contract._id,
//         url: contract.contractUrl,
//         status: contract.status,
//       },
//     });
//   } catch (err) {
//     console.error(
//       '❌ Capture PayPal Order Error:',
//       err.response?.data || err.message,
//     );
//     res.status(500).json({
//       success: false,
//       message: 'Failed to capture PayPal order',
//       details: err.response?.data || null,
//     });
//   }
// };
