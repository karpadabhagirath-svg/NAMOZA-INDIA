import { Router } from "express";
import { createPayment, verifyPayment } from "../controllers/paymentController";

const router = Router();

router.post("/create", createPayment);
router.post("/verify", verifyPayment);

export default router;
