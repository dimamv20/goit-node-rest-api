import contactsService from "../services/contactsServices.js";
import {
        addContactSchema,
        updateContactSchema
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getOneContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await contactsService.getContactById(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact = await contactsService.removeContact(id);
        if (!deletedContact) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.status(200).json(deletedContact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createContact = async (req, res) => {
    try {
        const { error } = addContactSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const newContact = await contactsService.addContact(req.body);
        res.status(201).json(newContact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateContactById = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { id } = req.params;
    const updatedContact = await updateContact(id, req.body);

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
