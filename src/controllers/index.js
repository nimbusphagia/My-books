import { poolQuery } from "../database/index.js";

async function indexGet(req, res) {
  // Get all books
  const sql = `
    SELECT 
      b.title,
      a.first_name || ' ' || a.last_name as author,
      p.publisher_name as publisher,
      b.year,
      b.description,
      b.isbn
    FROM book b
    JOIN author a 
    ON b.author_id = a.id 
    JOIN publisher p 
    ON p.id = b.publisher_id
  `;
  try {
    const result = await poolQuery(sql);
    const books = result.rows;
    res.render('index', {
      books: books,
    })

  } catch (err) {
    console.log(err);
  }
}

export { indexGet };
