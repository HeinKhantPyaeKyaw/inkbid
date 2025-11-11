import axios from 'axios';
import { FIREBASE_API_KEY } from '../config/env.js';
import { admin } from '../config/firebase.js';
import User from '../schemas/user.schema.js';

export const register = async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`.trim(),
      emailVerified: false,
      disabled: false,
    });

    const profile = await User.create({
      firebaseUid: userRecord.uid,
      email: userRecord.email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      role,
    });

    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({
      message: 'User registered',
      firebase: { uid: userRecord.uid, email: userRecord.email },
      profile: {
        id: profile._id,
        email: profile.email,
        displayName: profile.name,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        createdAt: profile.createdAt,
      },
      customToken,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
    const { data } = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });

    console.log(data);

    const profile = await User.findOne({ firebaseUid: data.localId });
    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.cookie('token', data.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.json({
      uid: data.localId,
      email: data.email,
      profile: {
        id: profile._id,
        email: profile.email,
        name: profile.name,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        bio: profile.bio,
        specialization: profile.specialization,
        writingStyle: profile.writingStyle,
        img_url: profile.img_url,
        organization: profile.organization,
        paypalEmail: profile.paypalEmail,
        createdAt: profile.createdAt,
      },
    });
  } catch (e) {
    const msg = e?.response?.data?.error?.message || e.message;
    return res.status(500).json({ message: msg });
  }
};

export const getMe = async (req, res) => {
  try {
    const uid = req.user._id;

    const profile = await User.findOne({ _id: uid });

    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        uid,
        id: profile._id,
        email: profile.email,
        name: profile.name,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        bio: profile.bio,
        specialization: profile.specialization,
        writingStyle: profile.writingStyle,
        img_url: profile.img_url,
        organization: profile.organization,
        paypalEmail: profile.paypalEmail,
        createdAt: profile.createdAt,
        profileImage: profile.img_url,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.json({ message: 'Logged out successfully' });
};

export const updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  const uid = req.user.firebaseUid;
  try {
    const userRecord = await admin.auth().getUser(uid);
    const email = userRecord.email;
    if (!email) {
      return res.status(404).json({ message: 'User email not found' });
    }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`;
    await axios.post(url, {
      idToken: req.cookies.token,
      password: newPassword,
      returnSecureToken: false,
    });

    await admin.auth().updateUser(uid, { password: newPassword });
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: error.message });
  }
};
