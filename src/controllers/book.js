import { getBookById, getAuthors, getPublishers, validateAccess, updateBook } from "../database/index.js";

async function bookGet(req, res) {
  const { bookId } = req.params;
  try {
    const [book, authors, publishers] = await Promise.all([
      getBookById(Number(bookId)),
      getAuthors(),
      getPublishers()
    ]);

    res.render('book', {
      book: book,
      authors: authors,
      publishers: publishers
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
}
async function bookPost(req, res) {
  try {
    const action = req.body.action;
    const bookId = Number(req.body.id);
    //Edit book with password
    if (action === "edit") {
      const admin = await validateAccess(req.body.password);
      if (!admin) {
        return res.redirect('/book/' + bookId + '?edited=false');
      }
      const bookInfo = {
        title: req.body.title,
        author_id: Number(req.body.author_id),
        publisher_id: Number(req.body.publisher_id),
        year: Number(req.body.year),
        description: req.body.description.trim(),
        isbn: req.body.isbn,
        id: bookId,
        img_url: req.body.img_url
      }

      await updateBook(bookInfo);
      return res.redirect('/book/' + bookId);
    }

    return res.status(400).send("Invalid action");

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }

}
export { bookGet, bookPost };
