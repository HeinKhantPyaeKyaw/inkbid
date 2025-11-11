<<<<<<< HEAD
import axios from "axios";
import { admin } from "../firebase.js";
import User from "../schemas/user.schema.js";
import { FIREBASE_API_KEY } from "../config/env.js";

import bcrypt from "bcryptjs";

export const hash = (input) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(input, salt);
};

export const register = async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  console.log(email, password, firstName, lastName, role);
=======
import axios from 'axios';
import { FIREBASE_API_KEY } from '../config/env.js';
import { admin } from '../config/firebase.js';
import User from '../schemas/user.schema.js';

export const register = async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
>>>>>>> 🐽TestMerge

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
<<<<<<< HEAD
      password: hash(password),
=======
      firstName,
      lastName,
>>>>>>> 🐽TestMerge
      name: `${firstName} ${lastName}`.trim(),
      role,
    });

    const customToken = await admin.auth().createCustomToken(userRecord.uid);
<<<<<<< HEAD
    res.status(201).json({
      message: "User registered",
=======

    res.status(201).json({
      message: 'User registered',
>>>>>>> 🐽TestMerge
      firebase: { uid: userRecord.uid, email: userRecord.email },
      profile: {
        id: profile._id,
        email: profile.email,
<<<<<<< HEAD
        displayName: `${profile.firstName} ${profile.lastName}`,
=======
        displayName: profile.name,
        firstName: profile.firstName,
        lastName: profile.lastName,
>>>>>>> 🐽TestMerge
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
<<<<<<< HEAD
  console.log(email, password);
=======
>>>>>>> 🐽TestMerge
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
<<<<<<< HEAD
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.json({
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: Number(data.expiresIn),
=======
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
>>>>>>> 🐽TestMerge
      profile: {
        id: profile._id,
        email: profile.email,
        name: profile.name,
<<<<<<< HEAD
        role: profile.role,
=======
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        bio: profile.bio,
        specialization: profile.specialization,
        writingStyle: profile.writingStyle,
        img_url: profile.img_url,
        organization: profile.organization,
        paypalEmail: profile.paypalEmail,
>>>>>>> 🐽TestMerge
        createdAt: profile.createdAt,
      },
    });
  } catch (e) {
    const msg = e?.response?.data?.error?.message || e.message;
    return res.status(500).json({ message: msg });
  }
};
<<<<<<< HEAD
=======

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
>>>>>>> 🐽TestMerge
