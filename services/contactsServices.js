import { Contact } from "../db/contactModel.js";

const listContacts = async () => {
  const contacts = await Contact.findAll();
  return contacts;
};

const getContactById = async (contactId) => {
  const contact = await Contact.findByPk(contactId);
  return contact;
};

const removeContact = async (contactId) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
};

const addContact = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

const updateContact = async (contactId, contactData) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  const updatedContact = await contact.update(contactData);
  return updatedContact;
};

const updateStatusContact = async (contactId, favorite) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  const updatedContact = await contact.update({ favorite });
  return updatedContact;
};

const contactServices = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

export default contactServices;
export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
