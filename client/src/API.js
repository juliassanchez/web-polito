import { Page, ContentBlock } from './PCModels';
import dayjs from 'dayjs';
const SERVER_URL = 'http://localhost:3001';

const getPublishedPages = async () => {
  const response = await fetch(SERVER_URL + '/api/pages');
  if(response.ok) {
    const pagesJson = await response.json();
    return pagesJson.map(p => new Page(p.id, p.title, p.author, p.creation_date, p.publication_date, p.userId));
  }
  else
    throw new Error('Internal server error');
}

/**
 * Getting and returing a page, specifying its pageId.
 */
const getPage = async (pageId) => {
  const response = await fetch(SERVER_URL + '/api/pages/created-pages/' + pageId);
  if (response.ok){
    const Json = await response.json();
    const p = Json[0];
    const pc = Json[1];
    const page = {
      id :p.id, 
      title: p.title, 
      author: p.author, 
      creation_date: dayjs(p.creation_date), 
      publication_date: p.publication_date, 
      header: p.header, 
      paragraph: p.paragraph, 
      image: p.image, 
      userId: p.userId
    }
    if (page.publication_date != null)
        page.publication_date = dayjs(page.publication_date);
    return [page, pc.map(c => new ContentBlock(c.pageId, c.type, c.text, c.position))] ;
  }
  else
    throw new Error('Internal server error');
}

/**
 * Getting all the created pages
 */
const getCreatedPages = async (userId) => {
  const response = await fetch(SERVER_URL + `/api/pages/${userId}/created-pages`);
  const Json = await response.json();
  const createdpagesJson = Json[0];
  const contentJson = Json[1];
  if(response.ok) {
    return [createdpagesJson.map(p => new Page(p.id, p.title, p.author, p.creation_date, p.publication_date, p.userId)), contentJson.map(c => new ContentBlock(c.id, c.type, c.text, c.position))];
  }
  else
    throw createdpagesJson;
}

/**
 * Getting the block of content
 */
const getContent = async (userId) => {
  const response = await fetch(SERVER_URL + `/api/pages/${userId}/created-pages`);
  const contentJson = await response.json();
  if(response.ok) {
    return contentJson.map(c => new ContentBlock(c.pageId, c.type, c.text, c.position));
  }
  else
    throw contentJson;
}

/**
 * Adding a new created page given the page, its content block and the userId
 */
const addCreatedPage = async (createdpage, contentblock, userId) => {
  const response = await fetch(`${SERVER_URL}/api/pages/${userId}/created-pages`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title:createdpage.title, author: createdpage.author, creation_date: createdpage.creation_date.format('YYYY-MM-DD'), publication_date: (createdpage.publication_date==null) ? createdpage.publication_date : createdpage.publication_date.format('YYYY-MM-DD'), content: contentblock})
  });

  if(!response.ok) {
    const errMessage = await response.json();
    throw errMessage;
  }
  else return null;
}
/**
 * Updating a created page given the page and its new content block 
 */
const updateCreatedPage = async (createdpage, contentblock) => {
  if (createdpage.publication_date != "" && createdpage.publication_date !=null){
    createdpage.publication_date = createdpage.publication_date.format("YYYY-MM-DD");
  }
  const response = await fetch(`${SERVER_URL}/api/created-pages/${createdpage.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title:createdpage.title, author: createdpage.author, creation_date: createdpage.creation_date.format('YYYY-MM-DD'), publication_date: createdpage.publication_date, userId: createdpage.userId, content: contentblock})
  });

  if(!response.ok) {
    const errMessage = await response.json();
    throw errMessage;
  }
  else return null;
}

/**
 * Deleting a crated page given its id
 */
const deleteCreatedPage = async (pageId) => {
  const response = await fetch(`${SERVER_URL}/api/created-pages/${pageId}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if(!response.ok) {
    const errMessage = await response.json();
    throw errMessage;
  }
  else return null;
}
/**
 * Login in
 */
const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};
/**
 * Getting user info
 */
const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

/**
 * Loggin out
 */
const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

const API = {getPage, getPublishedPages, getCreatedPages, getContent, addCreatedPage, updateCreatedPage, deleteCreatedPage, logIn, logOut, getUserInfo};
export default API;