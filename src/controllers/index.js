import { createBook, deleteBook, validateAccess, getAuthors, getPublishers, getBooks } from "../database/index.js";

async function indexGet(req, res) {
  const { deleted, sortby } = req.query;
  // Get all books
  try {
    const [books, authors, publishers] = await Promise.all([
      getBooks(sortby ?? 'title'),
      getAuthors(),
      getPublishers()
    ]);
    res.render('index', {
      books: books,
      authors: authors,
      publishers: publishers,
      deleted: deleted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}
async function indexPost(req, res) {
  const action = req.body.action;

  try {
    //Create a new book
    if (action === "create") {
      const newBook = {
        title: req.body.title,
        author_id: Number(req.body.author_id),
        publisher_id: Number(req.body.publisher_id),
        year: req.body.year ? Number(req.body.year) : null,
        description: req.body.description || null,
        isbn: req.body.isbn || null,
        imgUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj1l59hU1fd-knVZjraUO8XAe4DN08yJGj-w&s"
      };

      await createBook(newBook);
      return res.redirect("/");
    }

    //Delete book with password
    if (action === "delete") {
      const admin = await validateAccess(req.body.password);

      if (!admin) {
        return res.redirect("/?deleted=false");
      }

      const bookId = Number(req.body.bookId);
      await deleteBook(bookId);
      return res.redirect("/");
    }

    return res.status(400).send("Invalid action");

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
}


export { indexGet, indexPost };
