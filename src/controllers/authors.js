import { deleteAuthor, getAuthors, poolQuery, updateAuthor, validateAccess } from "../database/index.js"

async function authorsGet(req, res) {
  const { sortby } = req.query;
  const authors = await getAuthors(sortby ?? 'first');
  res.render('authors', { authors: authors, sortby: sortby });
}
async function authorsPost(req, res) {
  const { action } = req.body;
  try {
    if (action === 'create') {
      const { first_name, last_name } = req.body;
      await poolQuery(`INSERT INTO author (first_name, last_name) 
        VALUES ($1, $2)`, [first_name, last_name]);
      return res.redirect('/authors');
    } else if (action === 'delete') {
      const admin = await validateAccess(req.body.password);
      if (!admin) return res.redirect('/authors?deleted=false');
      await deleteAuthor(Number(req.body.protectedId));
      return res.redirect('/authors');
    } else if (action === 'edit') {
      const admin = await validateAccess(req.body.password);
      if (!admin) return res.redirect('/authors?edited=false');
      const { protectedId, first_name, last_name } = req.body;
      await updateAuthor(Number(protectedId), first_name, last_name);
      return res.redirect('/authors');
    } else {
      return res.status(400).send("Invalid action");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");

  }
}
export { authorsGet, authorsPost };
