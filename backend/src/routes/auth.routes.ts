import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { RegisterDto, LoginDto } from "../dto/auth.dto.js";
import { AuthController } from "../controllers/AuthController.js";
import { AuthService } from "../services/AuthService.js";
import { MongoUserRepository } from "../repositories/MongoUserRepository.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// simple manual DI
const usersRepo = new MongoUserRepository();
const authService = new AuthService(usersRepo);
const controller = new AuthController(authService);

router.post("/register", validate(RegisterDto), asyncHandler(controller.register));
router.post("/login", validate(LoginDto), asyncHandler(controller.login));

export default router;
