import { uploadFileToFirebase } from "../services/firebaseupload.js";
import Portfolio from "../schemas/portfolio.schema.js";

export const getAllPortfolio = async (req, res) => {
  console.log("portfolio controller called");
  try {
    const results = await Portfolio.find({});

    if (!results) {
      return res.status(404).json({ error: "No portfolios found" });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching portfolio:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createPortfolio = async (req, res) => {
  try {
    // Extract dtat from request body.
    const { title, synopsis, article, publishMedium, pdf } = req.body;

    // Validate the required fields
    if (!title || !synopsis || !article || !publishMedium || !pdf) {
      return res.status(400).json({ error: "Missing required field." });
    }

    // G real author ID from auth middleware
    const authorID = req.user.id;

    const pdfUrl = await uploadFileToFirebase(pdf, "portfolio/pdfs");

    // Create a new article object
    const newPortfolio = new Portfolio({
      title,
      synopsis,
      article,
      writer: authorID,
      publishMedium,
      pdfUrl,
    });

    console.log(newPortfolio);

    // Save article to MongoDB
    await newPortfolio.save();

    res.status(201).json({
      message: "Portfolio created successfully",
      article: newPortfolio,
    });
  } catch (err) {
    console.error("Error creating portfolio:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const deletedPortfolio = await Portfolio.findByIdAndDelete(portfolioId);
    if (!deletedPortfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (err) {
    console.error("Error deleting portfolio:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
