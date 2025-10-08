import { admin } from '../config/firebase.js';
import User from '../schemas/user.schema.js';

export const verifyAuth = async (req, res, next) => {
  try {
    // Get the token from the cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token, please log gin' });
    }

    // Verify token with Firebase auth admin
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Find the corresponding user in MongoDB
    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(401).json({ message: 'User not found in DB' });
    }

    // Attach user info to the request
    req.user = user;

    // ALlow the request to continue
    next();
  } catch (error) {
    console.error('Auth Middleware Error: ', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
