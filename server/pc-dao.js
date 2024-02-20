/* Data Access Object (DAO) module for accessing Q&A */
/* Initial version taken from exercise 4 (week 03) */
const sqlite = require('sqlite3');
const {Page, ContentBlock} = require('./PCModels');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('pages.sqlite', (err) => {
  if (err) throw err;
});

/** QUESTIONS **/
// get all the pages
exports.listPages = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM page where publication_date <= ?';
    db.all(sql, [dayjs().format('YYYY-MM-DD')], (err, rows) => {
      if (err) {
        reject(err);
      }
      
      const pages = rows.map((p) => new Page(p.id, p.title, p.author, p.creation_date, p.publication_date, p.userId));
      resolve(pages);
    });
  });
}

// get a page given its id
exports.getPage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM page where id = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      if (row == undefined)
        resolve({error: 'Page not found.'}); 
      else {
        const page = new Page(row.id, row.title, row.author, row.creation_date, row.publication_date, row.header, row.paragraph, row.image, row.userId);
        resolve(page);
      }
    });
  });
};

// get all content blocks for a given page
exports.getContentPage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM content_block where id = ?';
    db.all(sql, [id], (err, rows) => {
    if (err) {
      reject(err);
    }
    const content_block = rows.map((c) => new ContentBlock(c.id, c.type, c.text, c.position));
    resolve(content_block);
  });    
  });
};

// get all content blocks for a given page
exports.getContent = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM content_block';
    db.all(sql, [], (err, rows) => {
    if (err) {
      reject(err);
    }
    const content_block = rows.map((c) => new ContentBlock(c.id, c.type, c.text, c.position));
    resolve(content_block);
  });    
  });
};

/** CREATED PAGES **/

// get all the created pages of a given user
exports.listCreatedPagesOf = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM page';
    db.all(sql, [], (err, rows) => {
    if (err) {
      reject(err);
    }
    const created_pages = rows.map((p) => new Page(p.id, p.title, p.author, p.creation_date, p.publication_date, p.userId));
    resolve(created_pages);
  });
    
    
  });
};

// add a new created page
exports.addCreatedPage = (created_page, userId, author) => {
  return new Promise ((resolve, reject) => {
    const sql = 'INSERT INTO page(title, author, creation_date, publication_date, userId) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [created_page.title, author, created_page.creation_date, created_page.publication_date, userId], function(err) {
      if(err) reject(err);
      else {
        const id = this.lastID;
        resolve(id);
        const content_block = created_page.content;
        content_block.forEach((element) => {
          const sql2 = 'INSERT INTO content_block(type, text, position, id) VALUES (?, ?, ?, ?)';
          db.run(sql2, [element.type, element.text, element.position, id], function(err) {
          if(err) reject(err);
                     
          });
        });
      }
    });
  });
};
    


// update an existing created page
exports.updateCreatedPage = (created_page, created_pageId, author) => {
  if (created_page.publication_date == ''){
    created_page.publication_date = null;
  }
  return new Promise ((resolve, reject) => {
    const sql = 'UPDATE page SET title=?, author=?, creation_date=?, publication_date=?, userId=? WHERE id=?';
    db.run(sql, [created_page.title, author, created_page.creation_date, created_page.publication_date, created_page.userId, created_pageId], function(err) {
      if(err) {
        console.log(err);
        reject(err);
      }
      else {
        const content_block = created_page.content;
        content_block.forEach((element) => {
          const sql2 = 'INSERT OR REPLACE INTO content_block (type, text, position, id) VALUES (?, ?, ?, ?)';
          db.run(sql2, [element.type, element.text, element.position, created_pageId], function(err) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(this.lastID);
              const sql = 'DELETE FROM content_block where id=? and position>?';
              db.run(sql, [created_pageId, content_block.length], function(err) {
              if(err) {
                console.log(err);
                reject(err);
                }
              });
            }
          });
        });

      }
    
    });
    
  });
};

// This function deletes an existing page given its id and userId.
exports.deleteCreatedPage = (pageId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM page WHERE id=?';
    db.run(sql, [pageId], function (err) {
      if (err) {
        reject(err);
      }
      else{
        const sql2 = 'DELETE FROM content_block WHERE id=?';
        db.run(sql2, [pageId], function (err) {
          if (err) {
            reject(err);
          }
          else
            resolve(null);
        });
      } 
    });
  });
}
