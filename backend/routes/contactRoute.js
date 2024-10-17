import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getContactsList, searchContacts } from "../controllers/contactController.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);
contactRoutes.get("/get-contacts-dm", verifyToken, getContactsList)

export default contactRoutes;