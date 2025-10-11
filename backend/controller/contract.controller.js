import Article from "../schemas/article.schema.js";
import Contract from "../schemas/contract.schema.js";
import User from "../schemas/user.schema.js";

export const signContract = async (req, res) => {
  try {
    const { articleId } = req.params;
    const user = req.user;
    const userId = user?._id || user?.id;

    const article = await Article.findById(articleId).populate("author winner");
    if (!article) return res.status(404).json({ error: "Article not found" });

    // Determine signer role
    const isBuyer = String(article.winner) === String(userId);
    const isSeller =
      String(article.author._id || article.author) === String(userId);

    if (!isBuyer && !isSeller) {
      return res
        .status(403)
        .json({ error: "Not authorized to sign this contract" });
    }

    // Try to find an existing contract
    let contract = await Contract.findOne({ article: articleId });

    if (!contract) {
      // First signer creates contract
      const buyer = await User.findById(article.winner);
      const seller = article.author;

      contract = new Contract({
        buyer: article.winner,
        author: article.author._id,
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
          Both parties are bound by InkBid regulations.
        `,
      });
    }

    // Update signature flags
    if (isBuyer) contract.buyerSigned = true;
    if (isSeller) contract.sellerSigned = true;

    // Update status
    if (contract.buyerSigned && contract.sellerSigned) {
      contract.status = "complete";
      article.status = "awaiting_payment";
      await article.save();
    } else {
      contract.status = "incomplete";
    }

    await contract.save();

    return res.status(200).json({
      success: true,
      message:
        contract.status === "complete"
          ? "Both parties signed. Contract complete."
          : `${
              isBuyer ? "Buyer" : "Seller"
            } signed. Waiting for the other party.`,
      contract,
    });
  } catch (err) {
    console.error("Error signing contract:", err);
    res.status(500).json({ error: "Server error" });
  }
};
