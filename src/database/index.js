import 'dotenv/config';
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const bookJoinSql = `
  SELECT 
    b.id,
    b.title,
    b.author_id,
    b.publisher_id,
    COALESCE(a.first_name || ' ' || a.last_name, 'Unknown Author') AS author,
    COALESCE(p.publisher_name, 'Unknown Publisher') AS publisher,
    b.year,
    COALESCE(b.description, '') AS description,
    COALESCE(b.isbn, '') AS isbn,
    COALESCE(
      b.img_url,
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj1l59hU1fd-knVZjraUO8XAe4DN08yJGj-w&s'
    ) AS img_url
  FROM book b
  LEFT JOIN author a 
    ON b.author_id = a.id
  LEFT JOIN publisher p 
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
async function getBooks(orderBy = 'title') {
  const orderMap = {
    title: 'b.title',
    author: "a.first_name || ' ' || a.last_name",
    year: 'b.year',
    publisher: 'p.publisher_name',
  };

  const orderColumn = orderMap[orderBy] || orderMap.title;

  const sql = `
    ${bookJoinSql}
    ORDER BY ${orderColumn} ASC NULLS LAST, b.id ASC
  `;

  const result = await poolQuery(sql);
  return result.rows;
}


async function getAuthors(orderBy = 'first') {
  const orderMap = {
    first: 'first_name',
    last: 'last_name',
  };
  const orderColumn = orderMap[orderBy] || orderMap.first;
  const result = await poolQuery(`SELECT * from author ORDER BY ${orderColumn}`);
  return result.rows;
}
async function getPublishers(orderBy = 'name') {
  const orderMap = {
    name: 'publisher_name',
  };
  const orderColumn = orderMap[orderBy] || orderMap.name;
  const result = await poolQuery(`SELECT * from publisher ORDER BY ${orderColumn}`);
  return result.rows;
}
async function updateBook(bookInfo) {
  const { id, title, author_id, publisher_id, year, description, isbn, img_url } = bookInfo;

  const update = `
    UPDATE book
    SET
      title = $1,
      author_id = $2,
      publisher_id = $3,
      year = $4,
      description = $5,
      isbn = $6,
      img_url = $7
    WHERE id = $8
  `;

  await poolQuery(update, [
    title,
    author_id,
    publisher_id,
    year,
    description,
    isbn,
    img_url,
    id
  ]);
}
async function updateAuthor(id, first, last) {
  await poolQuery('UPDATE author SET first_name = $2, last_name = $3 WHERE id = $1', [id, first, last]);
}
async function deleteAuthor(id) {
  await poolQuery('DELETE FROM author WHERE id = $1', [id]);
}
async function updatePublisher(id, name) {
  await poolQuery('UPDATE publisher SET publisher_name = $2 WHERE id = $1', [id, name]);
}
async function deletePublisher(id) {
  await poolQuery('DELETE FROM publisher WHERE id = $1', [id]);
}
export { bookJoinSql, poolQuery, createBook, deleteBook, validateAccess, getBookById, getBooks, getAuthors, getPublishers, updateBook, deleteAuthor, updateAuthor, updatePublisher, deletePublisher };
