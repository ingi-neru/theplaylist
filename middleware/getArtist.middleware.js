import { createClient } from "../db/connectClient.db.js";
import { queryArtist } from "../db/handleAlbums.db.js";

export async function getArtist(req, res, next) {
    const client = createClient();

    // Decode the URL-encoded artist name
    const artistName = decodeURIComponent(req.params.artist);
    const artist = await queryArtist(client, artistName);

    req.artists = artist;
    console.log(artist);
    next();
}
