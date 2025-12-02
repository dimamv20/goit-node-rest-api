import fs from 'fs/promises';
import path from "path";
import { readFile } from 'fs/promises';
import { writeFile } from 'fs/promises';
import { read } from 'fs';

/*
 * Розкоментуй і запиши значення
 * const contactsPath = ;
 */
const contactPath = path.join(process.cwd(),"db", "contact.json");



const readContacts = async () => {
  const data = await fs.readFile(contactPath, 'utf-8');
  return JSON.parse(data);
}

const writeContacts = async (contacts) => { 
    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
}

// contacts.js
export async function listContacts() {
  // ...твій код. Повертає масив контактів.
  return await readContacts();
}

export async function getContactById(contactId) {
  // ...твій код. Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
  const contacts = await listContacts();
  const contact = contacts.find(c => c.id === contactId);
  return contact || null;
}

export async function removeContact(contactId) {
  // ...твій код. Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
  const contacts = await listContacts();
  const index = contacts.findIndex(c => c.id === contactId);
  
  if (index === -1) return null;

  const [removed] = contacts.splice(index, 1);

  await writeContacts(contacts);

  return removed;

}


export async function addContact(name, email, phone) {
  // ...твій код. Повертає об'єкт доданого контакту (з id).
  const contacts = await readContacts();

  const newContact = {
    id: Date.now().toString(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await writeContacts(contacts);

  return newContact;
}


export async function updateContact(contactId, updatedFields) {
  // ...твій код. Повертає об'єкт оновленого контакту. Повертає null, якщо контакт з таким id не знайдений.
  const contacts = await readContacts();
  const index = contacts.findIndex(c => c.id === id);
    if (index === -1) return null;

    contacts[index] = { ...contacts[index], ...updatedFields };
    
    await writeContacts(contacts);

    return contacts[index];
}
