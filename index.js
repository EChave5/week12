//lit-html snippet - Begin
let html = (strings, ...values) =>
  strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
//lit-html snippet - End

const API_ENDPOINT = "https://65a30c2aa54d8e805ed35f6d.mockapi.io/api/mailingList";


//primary list - matches name used in api
class MailingList {
  constructor(mailingList) {
    this.mailingList = mailingList;
    this.contacts = [];
  }

  addName(contactName, company) {
    this.contacts.push(new Contact(contactName, company));
  }
}

//secondary lists added to primary - matches names used in api 
class Contact {
  constructor(contactName, company) {
    this.name = contactName; 
    this.company = company;
  }
}

//helps link api to the code and should 
class MailingListService {
  static url = 'https://65a30c2aa54d8e805ed35f6d.mockapi.io/api/mailingList';

  static getAllLists() {
    return $.get(this.url);
  }

  static getList(id) {
    return $.get(this.url + `/${id}`);
  }

  static createList(mailingList) {
    return $.post(this.url, mailingList);
  }

  static updateList(mailingList) {
    return $.ajax({
      url: this.url + `/${mailingList.id}`, 
      dataType: "json", 
      data: JSON.stringify(mailingList),
      contentType: 'application/json',
      type: 'PUT',
    });
  }

  static deleteList(id) {
    return $.ajax({
      url: this.url + `/${id}`, 
      type: "DELETE",
    });
  }
}

//helps manage elements in relationship to DOM
class DOMManager {
  static mailingLists;

  static getAllLists() {
    MailingListService.getAllLists().then(mailingLists => this.render(mailingLists));
  }

  static createList(mailingList) {
    MailingListService.createList(new MailingList(mailingList))
    .then(() => {
      return MailingListService.getAllLists();
    })
    .then((mailingLists) => this.render(mailingLists))
  }

  static deleteMailingList(id) {
    console.log(id)
    MailingListService.deleteList(id)
      .then(() => {
        return MailingListService.getAllLists();
      })
      .then((mailingLists) => this.render(mailingLists));
  } //this does not work - gives an error saying not found

  static addContact(id) {
    console.log('Adding contact...', id);
    for (let mailingList of this.mailingLists) {
      if (mailingList.id == id) {
        console.log('Contact id:', id, mailingList.id);
        mailingList.contacts.push(new Contact($(`#${mailingList.id}-contact-name`).val(), $(`#${mailingList.id}-contact-company`).val()));
        MailingListService.updateList(mailingList) 
          .then(() => {
            return MailingListService.getAllLists();
          })
          .then((mailingLists) => this.render(mailingLists));
      }
    }
  } //does not work, does not give any error code, is there a click function to turn this on??

  static deleteContact(mailingListId, contactId) {
    console.log('Deleting contact...', mailingListId, contactId, 'this.mailingLists', this.mailingLists);
    for (let mailingList of this.mailingLists) {
      if (mailingList.id == mailingListId) {
        for (let contact of mailingList.contacts) {
          if (contact.id == contactId) {
            mailingLists.contacts.splice(mailingList.contacts.indexOf(contact), 1);
            MailingListService.updateList(mailingList)
              .then(() => {
                return MailingListService.getAllLists();
              })
              .then((mailingLists) => this.render(mailingLists));
          }
        }
      }
    }
  }

  static render(mailingLists) {

    this.mailingLists = mailingLists;
    console.log(this.mailingLists, 'this.mailingLists');
    $('#app').empty();
    for (let i = 0; i < mailingLists.length; i++) {
    //for (let mailingList of mailingLists) {
      console.log(mailingLists[i])
      $('#app').prepend(
       html`<div id="${mailingLists[i].id}" class="card">
          <div class="card-header">
            <h2>${mailingLists[i].mailingList}></h2>
            <button class="btn btn-danger" onclick="DOMManager.deleteMailingList('${mailingLists[i].id}')">Delete List</button>
          </div>
          <div class="card-body">
            <div class="card">
              <div class="row">
                <div class="col-sm">
                  <input type="text" id="${mailingLists[i].id}-contact-name" class="form-control" placeholder="Contact Name">
                </div>
                <div class="col-sm">
                <input type="text" id="${mailingLists[i].id}-contact-company" class="form-control" placeholder="Contact Company">
                </div>
              </div>
              <button id="${mailingLists[i].id}-new-contact" onclick="DOMManager.addContact('${mailingLists[i].id}')" class="btn btn-primary form-control">Add Contact</button>
            </div>
          </div>
        </div>
        <br>`
      );
      for (let contact of mailingLists[i].contacts) {
      console.log('contact:', contact);
      //mailingLists[i].contact === 
        $(`#${contact.id}`).find('.card-body').append(
          html`<p> test
            <span id="contact-name-${contact.id}"><strong>Contact Name: </strong> ${contact.name}</span>
            <span id="contact-company-${contact.id}"><strong>Contact Company: </strong> ${contact.company}</span>
            <button class="btn btn-danger" onclick="DOMManager.deleteContact('${mailingLists[i].id}', '${contact.id}')">Delete Contact</button>`
       ) 
      } 
    
      }
    }
  }

  $('#create-new-list').click(() => {
    DOMManager.createList($('#new-list-name').val());
    $('#new-list-name').val('');
  });

DOMManager.getAllLists();
