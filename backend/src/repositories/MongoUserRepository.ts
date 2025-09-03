import User, { UserDoc } from "../models/User.js";
import { IUserRepository } from "./IUserRepository.js";

export class MongoUserRepository implements IUserRepository {
  async create(data: Partial<UserDoc>): Promise<UserDoc> {
    return User.create(data);
  }

  async findByFirebaseUid(uid: string): Promise<UserDoc | null> {
    return User.findOne({ firebaseUid: uid });
  }

  async upsertByFirebaseUid(uid: string, update: Partial<UserDoc>): Promise<UserDoc> {
    const doc = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        $set: update,
        $setOnInsert: {
          displayName: "",
          role: "user",
          preferences: { theme: "light", language: "en" },
        },
        $currentDate: { "meta.lastLoginAt": true },
      },
      { new: true, upsert: true }
    );
    return doc!;
  }

  async updateByFirebaseUid(uid: string, update: Partial<UserDoc>): Promise<UserDoc | null> {
    return User.findOneAndUpdate({ firebaseUid: uid }, { $set: update }, { new: true });
  }
}
