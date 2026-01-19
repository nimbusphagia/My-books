import { poolQuery, validateAccess, deletePublisher, getPublishers, updatePublisher } from "../database/index.js";

async function publishersGet(req, res) {
  const publishers = await getPublishers();
  res.render('publishers', { publishers: publishers });
}
async function publishersPost(req, res) {
  const { action } = req.body;
  try {
    if (action === 'create') {
      const { publisher_name } = req.body;
      await poolQuery(`INSERT INTO publisher (publisher_name) 
        VALUES ($1)`, [publisher_name]);
      return res.redirect('/publishers');
    } else if (action === 'delete') {
      const admin = await validateAccess(req.body.password);
      if (!admin) return res.redirect('/publishers?deleted=false');
      await deletePublisher(Number(req.body.protectedId));
      return res.redirect('/publishers');

    } else if (action === 'edit') {
      const admin = await validateAccess(req.body.password);
      if (!admin) return res.redirect('/publishers?edited=false');
      const { protectedId, publisher_name } = req.body;
      await updatePublisher(Number(protectedId), publisher_name);
      return res.redirect('/publishers');
    } else {
      return res.status(400).send("Invalid action");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");

  }
}
export { publishersGet, publishersPost };

