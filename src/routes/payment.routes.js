import { Router } from "express";
import { createSubscription } from "../controllers/payment.controller.js";

const router = Router();

// Ruta POST para crear la suscripción
router.post("/create-subscription", createSubscription);

export default router;