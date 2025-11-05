// controller/contract.controller.js
import Article from '../schemas/article.schema.js';
import Contract from '../schemas/contract.schema.js';
import User from '../schemas/user.schema.js';
import { notify } from '../services/notification.service.js';

export const sellerSignContract = async (req, res) => {
  try {
    const { articleId } = req.params;
    const seller = req.user;
    const sellerId = seller?._id || seller?.id;

    // Fetch article with author + winner populated
    const article = await Article.findById(articleId).populate('author winner');
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: 'Article not found' });
    }

    // Validate seller identity
    if (String(article.author._id || article.author) !== String(sellerId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to sign this contract',
      });
    }

    // Find or create a contract for this article
    let contract = await Contract.findOne({ article: articleId });

    // Track whether buyer had already signed before this call
    let buyerHadSignedBefore = false;

    const buyer = await User.findById(article.winner);
    if (!buyer) {
      return res
        .status(404)
        .json({ success: false, message: 'Buyer not found' });
    }

    const buyerName = buyer.name;
    const sellerName = seller.name;
    const title = article.title;
    const price = article.highest_bid;

    const terms = `
1. **Parties Involved**
   This Contract is entered into between **${buyerName}** (“Buyer”) and **${sellerName}** (“Seller”) through the InkBid platform, operated by InkBid Technologies.

2. **Scope of Agreement**
   The Seller agrees to transfer to the Buyer the right to publicly use, display, and distribute the article titled **"${title}"** following successful payment via the InkBid platform.

3. **Ownership and Rights**
   - The Seller retains full ownership of the article at all times.
   - The Buyer is licensed to publicly use and display the article under the terms of this agreement.
   - The Buyer may **not** resell, sublicense, or modify the article for profit without the Seller’s explicit written consent.

4. **Payment Terms**
   The Buyer agrees to pay **${price} THB** to the Seller through the InkBid platform.
   Payment must be completed within five (5) business days after both parties have signed this agreement.
   The platform may temporarily withhold payment for verification and fraud prevention.

5. **Delivery and Access**
   The Seller must ensure the article is accessible in its original form and shall not alter or delete its contents after the Buyer has obtained access through the platform.

6. **Exclusivity and Parallel Use**
   - This license is **exclusive**; the Seller may not license the article to others unless a separate written exclusivity agreement is made.
   - The Seller must not misrepresent the article’s availability or licensing status.

7. **Confidentiality**
   Both parties agree not to disclose personal, payment, or platform-related information shared in the course of this transaction.

8. **Breach of Contract**
   - If the Buyer fails to complete payment, the contract is void.
   - If the Seller reuses or resells the article during the active period, InkBid reserves the right to penalize or suspend the Seller’s account.
   - InkBid is not liable for any dispute arising outside its platform.

9. **Termination**
   Either party may request early termination via the InkBid platform, subject to mutual written consent. Refunds may be issued only if both parties agree.

10. **Governing Law**
   This Agreement shall be governed by and construed in accordance with the applicable laws under which InkBid operates.

11. **Acknowledgement**
   By signing, both parties confirm that they have read and understood all terms and conditions stated herein and agree to be legally bound by them.
`;

    if (!contract) {
      // Seller signs first → create contract (incomplete)
      const buyer = await User.findById(article.winner);
      if (!buyer) {
        return res
          .status(404)
          .json({ success: false, message: 'Buyer not found' });
      }

      contract = new Contract({
        buyer: buyer._id,
        author: sellerId,
        article: articleId,
        articleTitle: article.title,
        buyerName: buyer.name,
        authorName: seller.name,
        finalPrice: article.highest_bid,
        terms: terms,
        sellerSigned: true,
        status: 'incomplete',
      });
    } else {
      // Contract exists → update seller signature
      buyerHadSignedBefore = !!contract.buyerSigned;

      if (contract.sellerSigned) {
        return res.status(409).json({
          success: false,
          message: 'You have already signed this contract',
        });
      }

      contract.sellerSigned = true;
      contract.terms = terms;
    }

    // Transition status if both signatures are present now
    let justCompleted = false;
    if (contract.buyerSigned && contract.sellerSigned) {
      if (contract.status !== 'complete') {
        justCompleted = true; // ⇦ becomes complete in THIS call
      }
      contract.status = 'complete';
      article.status = 'awaiting_payment';
      article.final_price = article.highest_bid; // ✅ set final price
      article.fees = Number((article.final_price * 0.15).toFixed(2)); // ✅ set fees (15%)
      await article.save();
    } else {
      contract.status = 'incomplete';
    }
    contract.sellerSigned = true;
    article.sellerSigned = true; // ✅ sync to Article
    await contract.save();
    await article.save();

    // 🔔 NOTIFICATION: if buyer signed first and seller just completed it now → tell buyer to pay
    if (justCompleted && buyerHadSignedBefore) {
      const buyerId =
        article.winner?._id || article.winner?.id || article.winner;
      await notify(buyerId, {
        type: 'contract',
        title: '💳 Seller signed the contract',
        message: `Seller has signed for “${article.title}”. Please complete your payment.`,
        target: {
          kind: 'article',
          id: article._id,
          url: `/dashboard/buyer/articles/${article._id}`,
        },
      });
    }

    res.status(200).json({
      success: true,
      message:
        contract.status === 'complete'
          ? 'Both parties have signed. Contract complete.'
          : 'Seller signed successfully. Waiting for buyer to sign.',
      contract,
    });
  } catch (err) {
    console.error('Error in sellerSignContract:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const buyerSignContract = async (req, res) => {
  try {
    const { articleId } = req.params;
    const buyer = req.user;
    const buyerId = buyer?._id || buyer?.id;

    const article = await Article.findById(articleId).populate('author winner');
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: 'Article not found' });
    }

    if (String(article.winner?._id || article.winner) !== String(buyerId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to sign this contract',
      });
    }

    const seller = await User.findById(article.author);
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: 'Seller not found' });
    }

    const buyerName = buyer.name;
    const sellerName = seller.name;
    const title = article.title;
    const price = article.highest_bid;

    const terms = `
1. **Parties Involved**
   This Contract is entered into between **${buyerName}** (“Buyer”) and **${sellerName}** (“Seller”) through the InkBid platform, operated by InkBid Technologies.

2. **Scope of Agreement**
   The Seller agrees to transfer to the Buyer the right to publicly use, display, and distribute the article titled **"${title}"** following successful payment via the InkBid platform.

3. **Ownership and Rights**
   - The Seller retains full ownership of the article at all times.
   - The Buyer is licensed to publicly use and display the article under the terms of this agreement.
   - The Buyer may **not** resell, sublicense, or modify the article for profit without the Seller’s explicit written consent.

4. **Payment Terms**
   The Buyer agrees to pay **${price} THB** to the Seller through the InkBid platform.
   Payment must be completed within five (5) business days after both parties have signed this agreement.
   The platform may temporarily withhold payment for verification and fraud prevention.

5. **Delivery and Access**
   The Seller must ensure the article is accessible in its original form and shall not alter or delete its contents after the Buyer has obtained access through the platform.

6. **Exclusivity and Parallel Use**
   - This license is **exclusive**; the Seller may not license the article to others unless a separate written exclusivity agreement is made.
   - The Seller must not misrepresent the article’s availability or licensing status.

7. **Confidentiality**
   Both parties agree not to disclose personal, payment, or platform-related information shared in the course of this transaction.

8. **Breach of Contract**
   - If the Buyer fails to complete payment, the contract is void.
   - If the Seller reuses or resells the article during the active period, InkBid reserves the right to penalize or suspend the Seller’s account.
   - InkBid is not liable for any dispute arising outside its platform.

9. **Termination**
   Either party may request early termination via the InkBid platform, subject to mutual written consent. Refunds may be issued only if both parties agree.

10. **Governing Law**
   This Agreement shall be governed by and construed in accordance with the applicable laws under which InkBid operates.

11. **Acknowledgement**
   By signing, both parties confirm that they have read and understood all terms and conditions stated herein and agree to be legally bound by them.
`;

    let contract = await Contract.findOne({ article: articleId });
    let sellerHadSignedBefore = false;

    if (!contract) {
      contract = new Contract({
        buyer: buyerId,
        author: seller._id,
        article: articleId,
        articleTitle: article.title,
        buyerName: buyer.name,
        authorName: seller.name,
        finalPrice: article.highest_bid,
        terms: terms,
        buyerSigned: true,
        status: 'incomplete',
      });
    } else {
      sellerHadSignedBefore = !!contract.sellerSigned;

      if (contract.buyerSigned) {
        return res.status(409).json({
          success: false,
          message: 'You have already signed this contract',
        });
      }

      contract.buyerSigned = true;
      contract.terms = terms;
    }

    let justCompleted = false;
    if (contract.buyerSigned && contract.sellerSigned) {
      if (contract.status !== 'complete') {
        justCompleted = true;
      }
      contract.status = 'complete';
      article.status = 'awaiting_payment';
      article.final_price = article.highest_bid; // ✅ set final price
      article.fees = Number((article.final_price * 0.15).toFixed(2)); // ✅ set fees (15%)
      await article.save();
    } else {
      contract.status = 'incomplete';
    }

    contract.buyerSigned = true;
    article.buyerSigned = true; // ✅ sync to Article
    await contract.save();
    await article.save();

    if (justCompleted && sellerHadSignedBefore) {
      const sellerId =
        article.author?._id || article.author?.id || article.author;
      await notify(sellerId, {
        type: 'contract',
        title: 'Buyer signed the contract',
        message: `Buyer has signed for "${article.title}". Contract is now complete`,
        target: {
          kind: 'article',
          id: article._id,
          url: `/dashboard/seller/articles/${article._id}`,
        },
      });
    }

    res.status(200).json({
      success: true,
      message:
        contract.status === 'complete'
          ? 'Both parties have signed. Contract complete.'
          : 'Buyer signed successfully. Waiting for seller to sign',
      contract,
    });
  } catch (err) {
    console.error('Error in buyerSignContract: ', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
