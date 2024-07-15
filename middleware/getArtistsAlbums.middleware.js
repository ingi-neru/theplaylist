import { queryAlbumsByArtist } from "../db/handleAlbums.db.js";
import { createClient } from "../db/connectClient.db.js";

export default async function getArtistsAlbums(req, res, next) {
    const client = createClient();
    const artists = await queryAlbumsByArtist(client, "Portishead");
    next();
}
