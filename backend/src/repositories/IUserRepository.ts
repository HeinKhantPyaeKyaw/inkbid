import { UserDoc } from "../models/User";

export interface IUserRepository {
  create(data: Partial<UserDoc>): Promise<UserDoc>;
  findByFirebaseUid(uid: string): Promise<UserDoc | null>;
  upsertByFirebaseUid(uid: string, update: Partial<UserDoc>): Promise<UserDoc>;
  updateByFirebaseUid(uid: string, update: Partial<UserDoc>): Promise<UserDoc | null>;
}
