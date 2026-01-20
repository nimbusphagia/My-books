import {
  createBook,
  deleteBook,
  validateAccess,
  getAuthors,
  getPublishers,
  getBooks
} from "../database/index.js";


async function indexGet(req, res) {
  const { deleted, sortby } = req.query;

  try {
    const [books, authors, publishers] = await Promise.all([
      getBooks(sortby ?? "title"),
      getAuthors(),
      getPublishers()
    ]);

    return res.render("index", {
      books,
      authors,
      publishers,
      sortby
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
}


async function indexPost(req, res) {
  const { action } = req.body;

  try {
    if (action === "create") {
      const {
        title,
        author_id,
        publisher_id,
        year,
        description,
        isbn,
        img_url
      } = req.body;

      const newBook = {
        title,
        author_id,
        publisher_id,
        year: year ?? null,
        description: description ?? null,
        isbn: isbn ?? null,
        img_url: img_url ??
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj1l59hU1fd-knVZjraUO8XAe4DN08yJGj-w&s"
      };

      await createBook(newBook);
      return res.redirect("/");
    }

    if (action === "delete") {
      const { password, bookId } = req.body;

      const admin = await validateAccess(password);
      if (!admin) {
        return res.redirect("/?deleted=false");
      }

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

