import '../scss/main.scss';
import 'bootstrap';
import JsonBox from './jsonbox';
import View from './view';

/**
 * Get a new jsonbox URL before you demo.
 * Second parameter is name of collection. I decided to store all my contacts under the "contacts" collection.
 */
const store = new JsonBox('https://jsonbox.io/box_b4ab02604a05fbd88446', 'contacts');

// Register handlers with the view instance
const view = new View();
view.registerOnEditContactHandler(openContact);
view.registerOnContactRemoveHandler(removeContact);
view.registerOnContactSaveHandler(saveContact);
view.registerOnSearchHandler(searchContacts);

// Load & display all the contacts when first arriving
loadContacts();

// Main application functions which call upon jsonbox and the view to accomplish the task
async function saveContact(data, contactID) {
    let contact = null;

    if (!contactID) {
        contact = await store.add(data);
    } else {
        await store.update(contactID, data);
        contact = await store.ofId(contactID);
    }
    

    view.hideContactDialog();
    view.renderContact(contact);
}

async function openContact(contactID) {
    const contact = await store.ofId(contactID);
    view.showContactDialog(contact);
}

async function removeContact(contactID) {
    await store.delete(contactID);
    view.removeContact(contactID);
}

async function loadContacts() {
    const contacts = await store.all();
    view.renderContactList(contacts);
}

async function searchContacts(searchTerm) {
    if (!searchTerm) {
        loadContacts();
    }

    // Using '*' to represent wildcard characters (per jsonbox.io docs)
    const contacts = await store.search({ contactFname: `*${searchTerm}*` });
    view.renderContactList(contacts);
}