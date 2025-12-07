import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";
import { Http2ServerRequest } from "http2";

export const getAllContacts = async (req, res, next) => {
  try {
    const owner = req.user.id;
    const contacts = await contactsService.listContacts(owner);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    
    const owner = req.user.id;

    const { id } = req.params;

    const contact = await contactsService.getContactById(owner, id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {

    const owner = req.user.id;

    const { id } = req.params;
    const contact = await contactsService.removeContact(owner, id);
    if (!contact) {
      throw  res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const owner = req.user.id;
    const newContact = await contactsService.addContact(owner, req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const owner = req.user.id;
    const { id } = req.params;
    const updated = await contactsService.updateContact(owner, id, req.body);
    if (!updated) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const updateFavoriteStatus = async (req, res, next) => {
  try {
    const { error } = updateStatusSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const owner = req.user.id;
    const { contactId } = req.params;
    const { favorite } = req.body;
    const updated = await contactsService.updateStatusContact(
      owner,
      contactId,
      favorite
    );
    if (!updated) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};
