import Review from '../schemas/review.schema.js';
import User from '../schemas/user.schema.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { sellerId, rating, comment } = req.body;

    // Validate required fields
    if (!sellerId || !rating || !comment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate that buyer is logged in
    const buyerId = req.user._id;

    if (req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyer can write reviews.' });
    }

    // Validate the seller exists and is actually seller
    const seller = await User.findById(sellerId);

    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Craete and save the review
    const review = new Review({
      buyer: buyerId,
      seller: sellerId,
      rating,
      comment,
    });

    await review.save();

    const populatedReview = await review.populate('buyer', 'name email');

    return res.status(201).json({
      message: 'Review added successfully',
      review: populatedReview,
    });
  } catch (error) {
    console.error('Error creating review: ', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Get all the reviews
export const getSellerReviews = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Find reviews for the seller and populate the info
    const reviews = await Review.find({ seller: sellerId })
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 }); // To get the newest first

    // Calculate Average Rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return res
      .status(200)
      .json({ sellerId, avgRating, totalReviews: reviews.length, reviews });
  } catch (error) {
    console.error('Error fetching reviews', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
