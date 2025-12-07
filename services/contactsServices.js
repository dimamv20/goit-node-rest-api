import { Contact } from "../db/contactModel.js";

const listContacts = async (owner) => {
  const contacts = await Contact.findAll({where: { owner } });
  return contacts;
};

const getContactById = async (owner, contactId) => {
  const contact = await Contact.findOne({ where : { id: contactId, owner} } );
  return contact;
};

const removeContact = async (owner, contactId) => {
  const contact = await Contact.findOne({ where : { id: contactId, owner} });

  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
};

const addContact = async (owner, contactData) => {

  const newContact = await Contact.create({ ...contactData, owner}) ;
  
  return newContact;
};

const updateContact = async (owner, contactId, contactData) => {
  
  const contact = await Contact.findOne( { where : { id: contactId, owner } } );

  if (!contact) {
    return null;
  }
  const updatedContact = await contact.update(contactData);
  return updatedContact;
};

const updateStatusContact = async (owner, contactId, favorite) => { 

  const contact = await Contact.findOne({ where : { id: contactId, owner } } );
  
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
