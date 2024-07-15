export async function insertAlbums(client, artists) {
  try {
    const database = client.db("theplaylist");
    const collection = database.collection("artists");

    for (const artist of artists) {
      const existingArtist = await collection.findOne({
        name: artist.name,
      });

      if (existingArtist) {
        // If artist exists, update their albums
        for (const album of artist.albums) {
          const existingAlbum = existingArtist.albums.find(
            (existingAlbum) => existingAlbum.title === album.title
          );

          if (existingAlbum) {
            console.log(
              `Album "${album.title}" by ${artist.name} already exists. Skipping.`
            );
          } else {
            // If album does not exist, add it to the artist
            await collection.updateOne(
              { name: artist.name },
              { $push: { albums: album } }
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
    const projection = { name: 1, _id: 0 };
    const artists = await collection.find({}, { projection }).toArray();
    artists.map((artist) => artist.name);
    console.log(artists);
    return artists;
  } catch (e) {
    console.log(e.message);
  }
}

export async function queryAlbumsByArtist(client, artistName) {
  try {
    const database = client.db("theplaylist");
    const collection = database.collection("artists");
    const artist = await collection.findOne({ name: artistName });
    console.log(artist.albums);
  } catch (e) {
    console.log(e.message);
  }
}

export async function queryArtistNames(client, searchString) {
  const database = client.db("theplaylist");
  const collection = database.collection("artists");
  const regex = new RegExp(searchString, "i"); // Case-insensitive regex for artist names

  const results = await collection
    .find({ name: { $regex: regex } })
    .limit(10)
    .toArray();

  console.log("Artists matching the search string:", results);
}

export async function queryAlbumTitles(client, searchString) {
  const database = client.db("theplaylist");
  const collection = database.collection("artists");
  const regex = new RegExp(searchString, "i"); // Case-insensitive regex for album titles

  const results = await collection
    .aggregate([
      { $unwind: "$albums" }, // Unwind the albums array
      { $match: { "albums.title": { $regex: regex } } }, // Match album titles
      {
        $project: { _id: 0, albumTitle: "$albums.title", artistName: "$name" },
      }, // Project desired fields
    ])
    .limit(10)
    .toArray();

  console.log("Albums matching the search string:", results);
}

export async function querySongTitles(client, searchString) {
  const database = client.db("theplaylist");
  const collection = database.collection("artists");
  const regex = new RegExp(searchString, "i"); // Case-insensitive regex for song titles

  const results = await collection
    .aggregate([
      { $unwind: "$albums" }, // Unwind the albums array
      { $unwind: "$albums.songs" }, // Unwind the songs array within each album
      { $match: { "albums.songs.title": { $regex: regex } } }, // Match song titles
      {
        $project: {
          _id: 0,
          songTitle: "$albums.songs.title",
          albumTitle: "$albums.title",
          artistName: "$name",
        },
      }, // Project desired fields
    ])
    .limit(10)
    .toArray();

  console.log("Songs matching the search string:", results);
}

export async function queryFromString(client, searchString) {
  const database = client.db("theplaylist");
  const collection = database.collection("artists");
  const regex = new RegExp(searchString, "i"); // Case-insensitive regex for all queries

  // Define the queries
  const artistNamesQuery = { name: { $regex: regex } };
  const albumTitlesQuery = { "albums.title": { $regex: regex } };
  const songTitlesQuery = { "albums.songs.title": { $regex: regex } };

  // Query for artist names
  const artistNamesResults = await collection
    .find(artistNamesQuery)
    .limit(10)
    .toArray();

  // Query for album titles
  const albumTitlesResults = await collection
    .aggregate([
      { $unwind: "$albums" }, // Unwind the albums array
      { $match: albumTitlesQuery }, // Match album titles
      {
        $project: { _id: 0, albumTitle: "$albums.title", artistName: "$name" },
      }, // Project desired fields
    ])
    .limit(10)
    .toArray();

  // Query for song titles
  const songTitlesResults = await collection
    .aggregate([
      { $unwind: "$albums" }, // Unwind the albums array
      { $unwind: "$albums.songs" }, // Unwind the songs array within each album
      { $match: songTitlesQuery }, // Match song titles
      {
        $project: {
          _id: 0,
          songTitle: "$albums.songs.title",
          albumTitle: "$albums.title",
          artistName: "$name",
        },
      }, // Project desired fields
    ])
    .limit(10)
    .toArray();

  // Combine results and format
  const results = [
    ...artistNamesResults.map((artist) => ({
      title: artist.name,
      class: "artist",
      description: "artist",
    })),
    ...albumTitlesResults.map((album) => ({
      title: album.albumTitle,
      class: "album",
      description: `album from artist ${album.artistName}`,
    })),
    ...songTitlesResults.map((song) => ({
      title: song.songTitle,
      class: "song",
      description: `song from album ${song.albumTitle}`,
    })),
  ];

  return results.slice(0, 10);
}
