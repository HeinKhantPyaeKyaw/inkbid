import axios from "axios";
import { admin } from "../firebase.js";
import { env } from "../env.js";
import { IUserRepository } from "../repositories/IUserRepository.js";
import { AppError } from "../utils/appError.js";
import { hash } from "src/utils/hash.js";

export class AuthService {
  constructor(private users: IUserRepository) {}

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: "buyer" | "writer"
  ) {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`.trim(),
        emailVerified: false,
        disabled: false,
      });

      const profile = await this.users.create({
        firebaseUid: userRecord.uid,
        email: userRecord.email!,
        password: hash(password),
        firstName,
        lastName,
      });

      const customToken = await admin.auth().createCustomToken(userRecord.uid);
      return { userRecord, profile, customToken };
    } catch (e: any) {
      throw new AppError(e.message, 400);
    }
  }

  async login(email: string, password: string) {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.FIREBASE_API_KEY}`;
      const { data } = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });

      const profile = await this.users.upsertByFirebaseUid(data.localId, {
        email: data.email.toLowerCase(),
        provider: "password",
      });

      return {
        uid: data.localId,
        email: data.email,
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        expiresIn: Number(data.expiresIn),
        profile,
      };
    } catch (e: any) {
      const msg = e?.response?.data?.error?.message || e.message;
      throw new AppError(msg, 401);
    }
  }
}
