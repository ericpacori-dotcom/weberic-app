// functions/index.js
import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";

// Inicializamos Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// --- HELPER: Obtener Token de PayPal (Usando .env) ---
async function getPayPalAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET;
    const baseUrl = process.env.PAYPAL_API_URL || "https://api-m.paypal.com";

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(`Error PayPal Token: ${data.error_description || data.error}`);
    return { accessToken: data.access_token, baseUrl };
}

// --- HELPER PARA DESBLOQUEO ---
async function unlockContentForUser(userId, courseId) {
    try {
        const userRef = db.collection("users").doc(userId);
        if (courseId === 'SUB-PREMIUM-MONTHLY' || courseId === 'SUB-PREMIUM-YEARLY') {
            await userRef.set({ 
                isSubscribed: true,
                subscriptionSource: 'paypal_verified', 
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } else {
            await userRef.set({ 
                purchasedCourses: admin.firestore.FieldValue.arrayUnion(courseId),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }
        logger.info(`✅ Contenido desbloqueado para ${userId} (Plan: ${courseId})`);
        return true;
    } catch (error) {
        logger.error("Error en desbloqueo:", error);
        return false;
    }
}

// ==========================================
//  VERIFICACIÓN PAYPAL (ÚNICA RUTA DE PAGO)
// ==========================================
export const verifyPayPalEndpoint = onRequest({ cors: true }, async (req, res) => {
    const { userId, orderID, subscriptionID, isSubscription, planType } = req.body;
    if (!userId) return res.status(400).json({ error: "Falta userId" });

    try {
        const { accessToken, baseUrl } = await getPayPalAccessToken();
        let isValid = false;
        let finalCourseId = "general"; 

        if (isSubscription && subscriptionID) {
            const subResponse = await fetch(`${baseUrl}/v1/billing/subscriptions/${subscriptionID}`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
            });
            const subData = await subResponse.json();
            if (subResponse.ok && subData.status === "ACTIVE") {
                isValid = true;
                finalCourseId = planType === 'yearly' ? 'SUB-PREMIUM-YEARLY' : 'SUB-PREMIUM-MONTHLY';
            }
        } else if (orderID) {
            const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
            });
            const orderData = await orderResponse.json();
            if (orderResponse.ok && (orderData.status === "COMPLETED" || orderData.status === "APPROVED")) {
                isValid = true;
            }
        }

        if (isValid) {
            await unlockContentForUser(userId, finalCourseId);
            return res.json({ success: true });
        } else {
            return res.status(400).json({ success: false, error: "Pago no verificado" });
        }
    } catch (error) {
        logger.error("Error PayPal:", error);
        return res.status(500).json({ error: "Error interno" });
    }
});