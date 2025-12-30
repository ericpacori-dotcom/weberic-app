// functions/routes/payment.routes.js
import { Router } from "express";
import { createSubscription } from "../controllers/payment.controller.js";

const router = Router();

// Esta es la ruta que tu Frontend llama
router.post("/create-subscription", createSubscription);

export default router;