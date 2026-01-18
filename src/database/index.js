import 'dotenv/config';
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const bookJoinSql = `
    SELECT 
      b.id,
      b.title,
      b.author_id,
      b.publisher_id,
      a.first_name || ' ' || a.last_name as author,
      p.publisher_name as publisher,
      b.year,
      b.description,
      b.isbn,
      b.img_url
    FROM book b
JOIN author a 
    ON b.author_id = a.id 
    JOIN publisher p 
    ON p.id = b.publisher_id
  `;
async function poolQuery(sql, params = []) {
  return pool.query(sql, params);
}

async function createBook({
  title,
  author_id = null,
  publisher_id = null,
  year = null,
  description = null,
  img_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj1l59hU1fd-knVZjraUO8XAe4DN08yJGj-w&s',
  isbn = null,
}) {
  const query = {
    text: `
      INSERT INTO book (title, author_id, publisher_id, year, description, img_url, isbn )
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    values: [title, author_id, publisher_id, year, description, img_url, isbn],
  };
  await poolQuery(query.text, query.values);
}
async function deleteBook(bookId) {
  await poolQuery('DELETE FROM book WHERE id = $1', [bookId]);
}
async function validateAccess(password) {
  const result = await poolQuery('SELECT * FROM admin WHERE id = 1 AND password = $1', [password]);
  if (result.rows.length === 1) {
    return true
  }
  return false;
}
async function getBookById(id) {
  const sql = bookJoinSql + ' where b.id = $1'
  const result = await poolQuery(sql, [id]);
  return result.rows[0];
}
async function getBooks() {
  const result = await poolQuery(bookJoinSql);
  return result.rows;
}
async function getAuthors() {
  const result = await poolQuery('SELECT * from author');
  return result.rows;
}
async function getPublishers() {
  const result = await poolQuery('SELECT * from publisher');
  return result.rows;
}
async function updateBook(bookInfo) {
  const { id, title, author_id, publisher_id, year, description, isbn } = bookInfo;

  const update = `
    UPDATE book
    SET
      title = $1,
      author_id = $2,
      publisher_id = $3,
      year = $4,
      description = $5,
      isbn = $6
    WHERE id = $7
  `;

  await poolQuery(update, [
    title,
    author_id,
    publisher_id,
    year,
    description,
    isbn,
    id
  ]);
}

export { bookJoinSql, poolQuery, createBook, deleteBook, validateAccess, getBookById, getBooks, getAuthors, getPublishers, updateBook };
