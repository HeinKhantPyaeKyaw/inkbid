import { IUserRepository } from "../repositories/IUserRepository.js";
import { AppError } from "../utils/appError.js";

export class UserService {
  constructor(private users: IUserRepository) {}

  async me(firebaseUid: string) {
    const profile = await this.users.findByFirebaseUid(firebaseUid);
    if (!profile) throw new AppError("Profile not found", 404);
    return profile;
  }

  async updateMe(firebaseUid: string, update: any) {
    const profile = await this.users.updateByFirebaseUid(firebaseUid, update);
    if (!profile) throw new AppError("Profile not found", 404);
    return profile;
  }
}
