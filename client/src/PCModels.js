'use strict';

import dayjs from 'dayjs';

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
  if (publication_date == null || publication_date == '' || publication_date == 'NULL'){
    this.publication_date = null;
  }
  else{
    this.publication_date = dayjs(publication_date);
  };
  this.serialize = () => {
    return {id: this.id, title: this.title, author: this.author, creation_date: this.creation_date.format('YYYY-MM-DD'), publication_date: (this.publication_date == null) ? this.publication_date: this.publication_date.format('YYYY-MM-DD'), userId: this.userId};
  }
}

export { Page, ContentBlock };