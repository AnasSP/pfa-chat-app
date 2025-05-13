import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContacts, searchContacts } from "../controllers/ContactController.js";


const contactsRoutes = Router()

contactsRoutes.post("/search", verifyToken, searchContacts)
contactsRoutes.get("/get-contacts", verifyToken, getContacts)
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts)

export default contactsRoutes