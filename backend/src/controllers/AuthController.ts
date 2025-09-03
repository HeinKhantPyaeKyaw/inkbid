import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";

export class AuthController {
  constructor(private auth: AuthService) {}

  register = async (req: Request, res: Response) => {
    const { email, password,firstName, lastName, role } = (req as any).validated ?? req.body;
    const { userRecord, profile, customToken } = await this.auth.register(email, password, firstName, lastName, role);
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
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = (req as any).validated ?? req.body;
    const data = await this.auth.login(email, password);
    res.json({
      uid: data.uid,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      profile: {
        id: data.profile._id,
        email: data.profile.email,
        displayName: `${data.profile.firstName} ${data.profile.lastName}`,
        role: data.profile.role,
        createdAt: data.profile.createdAt,
      },
    });
  };
}
