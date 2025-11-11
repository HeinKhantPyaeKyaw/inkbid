import { admin } from '../config/firebase.js';
import User from '../schemas/user.schema.js';

export const verifyAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token, please log gin' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(401).json({ message: 'User not found in DB' });
    }

    req.user = {
      ...(user.toObject ? user.toObject() : user),
      _id: user._id,
      id: String(user._id),
      uid: decodedToken.uid,
    };
    next();
  } catch (error) {
    console.error('Auth Middleware Error: ', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
