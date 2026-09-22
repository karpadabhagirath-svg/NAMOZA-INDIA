import { Router } from "express";
import { getOrder, listOrders, updateOrderStatus, updatePaymentStatus } from "../controllers/orderController";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAdmin);
router.get("/orders", listOrders);
router.get("/orders/:id", getOrder);
router.patch("/orders/:id/status", updateOrderStatus);
router.patch("/orders/:id/payment", updatePaymentStatus);

export default router;
