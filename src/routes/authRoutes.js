import express from "express";
import {loginController, registerController} from "../controllers/authControllers.js";
import { validateRegister, validateLogin, validate } from "../middleware/validators.js";

const router = express.Router();

router.post('/register', validateRegister, validate, registerController);
router.post('/login', validateLogin, validate, loginController);

export default router;