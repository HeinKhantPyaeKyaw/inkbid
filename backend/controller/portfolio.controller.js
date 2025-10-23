import Portfolio from '../schemas/portfolio.schema.js';
import { uploadFileToFirebase } from '../services/firebaseupload.js';

export const getAllPortfolio = async (req, res) => {
  console.log('portfolio controller called');
  try {
    const { sellerId } = req.query;
    console.log(req.query);

    let filter = {};

    if (req.user && req.user.role === 'seller') {
      console.log(req.user.id);
      filter = { writer: req.user._id };
    } else if (sellerId) {
      filter = { writer: sellerId };
    } else {
      res.status(403).json({ error: 'Not authorized to see portfolios' });
    }

    const results = await Portfolio.find(filter)
      .populate('writer', 'name email')
      .sort({ createdAt: -1 });

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No portfolios found' });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createPortfolio = async (req, res) => {
  try {
    // Extract dtat from request body.
    const { title, synopsis, publishMedium } = req.body;

    // Validate the required fields
    if (!title || !synopsis || !publishMedium) {
      return res.status(400).json({ error: 'Missing required field.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    // G real author ID from auth middleware
    const authorID = req.user._id;

    const pdfUrl = await uploadFileToFirebase(req.file, 'portfolio/pdfs');

    // Create a new article object
    const newPortfolio = new Portfolio({
      title,
      synopsis,
      writer: authorID,
      publishMedium,
      pdfUrl,
    });

    console.log(newPortfolio);

    // Save article to MongoDB
    await newPortfolio.save();

    res.status(201).json({
      message: 'Portfolio created successfully',
      article: newPortfolio,
    });
  } catch (err) {
    console.error('Error creating portfolio:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const deletedPortfolio = await Portfolio.findByIdAndDelete(portfolioId);
    if (!deletedPortfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    res.status(200).json({ message: 'Portfolio deleted successfully' });
  } catch (err) {
    console.error('Error deleting portfolio:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};
