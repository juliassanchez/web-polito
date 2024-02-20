'use strict';

/* Same of week 09, but 1) with require() instead of import and 2) without any internal methods */

const dayjs = require('dayjs');

function ContentBlock(id, type, text, position) {
  this.id = id;
  this.type = type;
  this.text = text;
  this.position = position;
}

function Page(id, title, author, creation_date, publication_date, userId) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.creation_date = dayjs(creation_date);
  this.userId = userId;
  if (publication_date == null || publication_date == ''){
    this.publication_date = null;
  }
  else{
    this.publication_date = dayjs(publication_date);
  }
}

module.exports = { Page, ContentBlock };