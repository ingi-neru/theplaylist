import { createClient } from "../db/connectClient.db.js";
import { queryFromString } from "../db/handleAlbums.db.js";

export default async function fetchSearchResults(req, res, next) {
  const { q } = req.query;
  const client = createClient();
  const result = await queryFromString(client, q);
  req.result = result;
  console.log(result);
  next();
}
