import $ from 'jquery';

export default class View {
    constructor() {
        // Get DOM references
        this.contactModal = document.querySelector('#contactModal');
        this.contactForm = contactModal.querySelector('form');
        this.searchForm = document.querySelector('#searchForm');
        this.contactContainer = document.querySelector('#contactContainer');
        this.countContainer = document.querySelector('#countContainer');

        // Set up event handlers, need to bind to this so handlers have correct scope
        this.contactContainer.addEventListener('click', this.onContactClick.bind(this));
        this.contactForm.addEventListener('submit', this.oncontactFormSubmit.bind(this));
        this.searchForm.addEventListener('submit', this.onSearchFormSubmit.bind(this));

        // A little jquery to clear the contact form when the modal is hidden
        $(this.contactModal).on('hide.bs.modal', () => this.contactForm.reset());
    }

    registerOnEditContactHandler(handler) {
        this.onEditContactHandler = handler;
    }

    registerOnContactSaveHandler(handler) {
        this.onContactSaveHandler = handler;
    }

    registerOnContactRemoveHandler(handler) {
        this.onContactRemoveHandler = handler;
    }

    registerOnSearchHandler(handler) {
        this.onSearchHandler = handler;
    }

    // Remove contact from the DOM
    removeContact(contactID) {
        const contactNode = this.contactContainer.querySelector(`div[data-contact-id="${contactID}"`);

        if (contactNode) {
            contactNode.parentElement.remove();
        }
    }


    // Show modal dialog with contact populated (or empty if no contact)
    showContactDialog(contact) {
        if (contact) {
            this.contactForm.contactID.value = contact._id;
            this.contactForm.contactFname.value = contact.contactFname;
            this.contactForm.contactLname.value = contact.contactLname;
            this.contactForm.contactPhonenum.value = contact.contactPhonenum;
            this.contactForm.contactType.value = contact.contactType
            this.contactForm.contactEmail.value = contact.contactEmail;
            this.contactForm.contactDOB.value = contact.contactDOB;
            this.contactForm.contactContent.value = contact.content;

        }

        // jquery to show dialog
        $(this.contactModal).modal('show');
    }

    // Hides contact dialog
    hideContactDialog() {
        $(this.contactModal).modal('hide');
    }

    // Clear the screen and display the contacts
    renderContactList(contacts) {
        this.contactContainer.innerHTML = '';
        this.countContainer.innerHTML = '';
        
        for (let contact of contacts) {
            this.contactContainer.append(this.createContactNode(contact));
        }
        
        this.countContainer.innerHTML = `<container><h2 class="text-center ml-4 pb-4" id="count">${contacts.length} Contacts Found</h2></container>`;
    }

    // Append a new contact to the DOM or replace an existing contact
    renderContact(contact) {
        const contactNode = this.createContactNode(contact);
        const existingNode = this.contactContainer.querySelector(`div[data-contact-id="${contact._id}"]`);

        existingNode ? existingNode.parentElement.replaceWith(contactNode) : this.contactContainer.prepend(contactNode);
    }

    

    createContactNode(contact) {
        const contactNode = document.createElement('div');

        let diff = Math.abs(new Date().getUTCFullYear() - new Date(contact.contactDOB).getUTCFullYear());
        contactNode.className = 'col col-sm-2 col-md-4 pb-4';
        contactNode.innerHTML = `
            <div data-contact-id="${contact._id}" class="contact bg-postit-purple shadow m-3">
                <div class="contact-header d-flex justify-content-between">
                    <h2 class="contact-contactname">${contact.contactFname + ' ' + contact.contactLname}</h2>
                   <button type="button" class="btn btn-delete">&times;</button>
                </div>
                
                
                <div class="contact-phone">Phone Number: ${contact.contactPhonenum}</div>
                <div class="contact-type">Contact Type: ${contact.contactType}</div>
                <div class="contact-email">Email: ${contact.contactEmail}</div>
                <div class="contact-DOB">DOB: ${contact.contactDOB}</div>
                <div class="contact-age">Age: ${diff}</div>
                <div class="contact-content">Notes: ${contact.content}</div>
                <div class="controls">
                   <button type="button" class="btn-postit-yellow btn-edit btn-sm">Edit Contact</button>
                </div>
            </div>`;

        return contactNode;
    }


    onContactClick(event) {
        const contactNode = event.target.closest('.contact');

        // We are contact sure where the contact was clicked at this point, have to investigate
        if (event.target.matches('.btn-delete')) {
            this.onContactRemoveHandler(contactNode.dataset.contactId);
        } else if (event.target.matches('.btn-edit')) {
            this.onEditContactHandler(contactNode.dataset.contactId);
        }
    }

    oncontactFormSubmit(event) {
        event.preventDefault();

        // Prepare the data for the registered handler
        const data = {
            contactFname: this.contactForm.contactFname.value,
            contactLname: this.contactForm.contactLname.value,
            contactPhonenum: this.contactForm.contactPhonenum.value,
            contactType: this.contactForm.contactType.value,
            contactEmail: this.contactForm.contactEmail.value,
            contactDOB: this.contactForm.contactDOB.value,
            content: this.contactForm.contactContent.value
        };

        this.onContactSaveHandler(data, this.contactForm.contactID.value);
        alert('Your Contact Was Succesfully Saved')
    }

    onSearchFormSubmit(event) {
        event.preventDefault();

        this.onSearchHandler(this.searchForm.search.value);
    }
}