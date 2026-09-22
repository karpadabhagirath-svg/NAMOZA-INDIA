import { Router } from "express";
import { createOrder, trackOrder } from "../controllers/orderController";
import { uploadPhotos } from "../middleware/upload";

const router = Router();

router.post("/", uploadPhotos.array("photos", 6), createOrder);
router.post("/track", trackOrder);

export default router;
