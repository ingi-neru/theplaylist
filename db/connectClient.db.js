import { MongoClient, ServerApiVersion } from "mongodb";
const uri =
  "mongodb+srv://iamtheadmin:zQu0PIeX1EU7RlLS@songlibrary.yrjwpbo.mongodb.net/?retryWrites=true&w=majority&appName=SongLibrary";

export function createClient() {
  return new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

export async function connectClient(client) {
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  }
}
