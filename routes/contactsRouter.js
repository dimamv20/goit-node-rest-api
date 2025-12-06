import express from "express";
import {
  getAllContacts,
  getContactById,
  deleteContact,
  addContact,
  updateContact,
  updateFavoriteStatus,
} from "../controllers/contactsControllers.js";

const router = express.Router();

router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.post("/", addContact);
router.put("/:id", updateContact);
router.patch("/:contactId/favorite", updateFavoriteStatus);
router.delete("/:id", deleteContact);

export default router;
