// controller/payment.controller.js
import Stripe from "stripe";
import Article from "../schemas/article.schema.js";
import Payment from "../schemas/payment.schema.js";
import { notify } from "../services/notification.service.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

/**
 * POST /api/v1/payment/create-session
 * body: { articleId }
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { articleId } = req.body;
    const buyerId = req.user?.id;

    const article = await Article.findById(articleId)
      .populate("author", "_id name email")
      .populate("winner", "_id name email");

    if (!article) return res.status(404).json({ error: "Article not found" });

    // must be awaiting_payment to allow paying
    if (article.status !== "awaiting_payment") {
      return res
        .status(400)
        .json({ error: "Article is not ready for payment." });
    }

    const amountThb =
      article.final_price ||
      Number(article.buy_now ?? article.highest_bid ?? 0);
    if (!amountThb || amountThb <= 0) {
      return res.status(400).json({ error: "Invalid final price." });
    }

    const feeRate = article.fee_rate ?? 0.15;
    const feeThb = Math.round(amountThb * feeRate);
    const sellerThb = amountThb - feeThb;

    // Create a pending Payment record
    const payment = await Payment.create({
      article: article._id,
      buyer: buyerId || article.winner?._id,
      seller: article.author._id,
      currency: "thb",
      amount_total_thb: amountThb,
      platform_fee_thb: feeThb,
      seller_receivable_thb: sellerThb,
      status: "pending",
    });
    const destination = "acct_1SHe1cGcE0uTLpEN";
    const application_fee_amount = Math.round(feeThb * 100); // in satang
    // 2) Build your session params WITHOUT transfer_data
    const params = {
      mode: "payment",
      payment_method_types: ["card"],
      currency: "thb",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "thb",
            product_data: { name: `InkBid: ${article.title}` },
            unit_amount: amountThb * 100, // THB → satang
          },
        },
      ],
      success_url: `${CLIENT_URL}/dashboard/buyer-dashboard`,
      cancel_url: `${CLIENT_URL}/dashboard/buyer-dashboard`,
      payment_intent_data: {
        // ✅ platform fee on a direct charge
        application_fee_amount,
        // (optional) on_behalf_of: destination,
      },
      metadata: {
        articleId: String(article._id),
        buyerId: String(buyerId || article.winner?._id),
        sellerId: String(article.author._id),
        platformFeeThb: String(feeThb),
        sellerReceivableThb: String(amountThb - feeThb),
        paymentId: String(payment._id),
      },
    };

    // 3) Create the Checkout Session **on the connected account**
    //    (this makes it a direct charge; the seller is liable)
    const session = await stripe.checkout.sessions.create(params, {
      stripeAccount: destination, // 👈 critical
    });

    // store session id to the Payment record
    payment.stripe_session_id = session.id;
    await payment.save();

    res.json({ url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};

/**
 * POST /api/v1/payment/webhook
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const {
        articleId,
        buyerId,
        sellerId,
        platformFeeThb,
        sellerReceivableThb,
        paymentId,
      } = session.metadata || {};

      // Update the Payment record
      const payment = await Payment.findById(paymentId);
      if (payment) {
        payment.status = "succeeded";
        payment.stripe_payment_intent_id = session.payment_intent;
        await payment.save();
      }

      // Update article status → completed
      const article = await Article.findById(articleId);
      if (article) {
        article.status = "completed";
        await article.save();
      }

      // 🔔 Notifications
      try {
        await notify(buyerId, {
          type: "payment",
          title: "✅ Payment successful",
          message: `You paid ฿${payment?.amount_total_thb} for “${article?.title}”.`,
          target: {
            kind: "article",
            id: articleId,
            url: `/dashboard/buyer/articles/${articleId}`,
          },
        });

        await notify(sellerId, {
          type: "payment",
          title: "💰 Buyer completed payment",
          message: `Payment received for “${article?.title}”. Seller receivable: ฿${sellerReceivableThb}.`,
          target: {
            kind: "article",
            id: articleId,
            url: `/dashboard/seller/articles/${articleId}`,
          },
        });
      } catch (e) {
        console.error("notify error:", e);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).end();
  }
};
