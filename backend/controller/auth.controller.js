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
      password: hash(password),
      name: `${firstName} ${lastName}`.trim(),
      role,
    });

    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    res.status(201).json({
      message: "User registered",
      firebase: { uid: userRecord.uid, email: userRecord.email },
      profile: {
        id: profile._id,
        email: profile.email,
        displayName: `${profile.firstName} ${profile.lastName}`,
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
  console.log(email, password);
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
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.json({
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: Number(data.expiresIn),
      profile: {
        id: profile._id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        createdAt: profile.createdAt,
      },
    });
  } catch (e) {
    const msg = e?.response?.data?.error?.message || e.message;
    return res.status(500).json({ message: msg });
  }
};
