import { MongoClient } from "mongodb";

export async function insertAlbums(client, artists) {
  try {
    const database = client.db("theplaylist");
    const collection = database.collection("artists");

    for (const artist of artists) {
      const existingArtist = await collection.findOne({ name: artist.name });

      if (existingArtist) {
        // If artist exists, update their albums
        for (const album of artist.albums) {
          const existingAlbum = existingArtist.albums.find(
            (existingAlbum) => existingAlbum.title === album.title,
          );

          if (existingAlbum) {
            console.log(
              `Album "${album.title}" by ${artist.name} already exists. Skipping.`,
            );
          } else {
            // If album does not exist, add it to the artist
            await collection.updateOne(
              { name: artist.name },
              { $push: { albums: album } },
            );
            console.log(`Album "${album.title}" by ${artist.name} added.`);
          }
        }
      } else {
        // If artist does not exist, insert the artist with their albums
        await collection.insertOne(artist);
        console.log(`Artist "${artist.name}" and their albums added.`);
      }
    }
  } catch (e) {
    console.log(e.message);
  }
}

export async function queryAllArtists(client) {
  try {
    const database = client.db("theplaylist");
    const collection = database.collection("artists");
    const artists = await collection.find({}).toArray();
    return artists;
  } catch (e) {
    console.log(e.message);
  }
}
