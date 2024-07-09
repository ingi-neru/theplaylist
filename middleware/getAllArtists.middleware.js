import { queryAllArtists } from "../db/handleAlbums.db.js";
import { createClient } from "../db/connectClient.db.js";

export default async function getAllArtists(req, res, next) {
  const client = createClient();
  const artists = await queryAllArtists(client);
  req.artists = artists;
  next();
}
