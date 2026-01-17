import { poolQuery } from "../database/index.js";

async function indexGet(req, res) {
  // Get all books
  const bookSql = `
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
  const authorSql = `SELECT * from author`;
  const publisherSql = `SELECT * from publisher`;
  try {
    const [booksRes, authorsRes, publishersRes] = await Promise.all([
      poolQuery(bookSql),
      poolQuery(authorSql),
      poolQuery(publisherSql)
    ]);

    res.render('index', {
      books: booksRes.rows,
      authors: authorsRes.rows,
      publishers: publishersRes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

export { indexGet };
