import dotenv from "dotenv";
import { Collection, MongoClient } from "mongodb";
import { VideoViewModel } from "./features/videos/model/VideoViewModel";
import { BlogType } from "./features/blogs/types/types";
import { PostType } from "./features/posts/types/types";
dotenv.config();

const URL = process.env.MONGO_URL || "mongodb://localhost:27017";

if (!URL) {
  throw new Error("URL not found");
}

export const client = new MongoClient(URL);

// const db = client.db('base-backend');
const db = client.db();
export const blogsCollection: Collection<BlogType> =
  db.collection<BlogType>("blogs");
export const postsCollection = db.collection<PostType>("posts");
export const videosCollection = db.collection<VideoViewModel>("videos");

export async function runDb() {
  try {
    //Connect client to the server
    await client.connect();
    //Establish ane verify connection
    await db.command({ ping: 1 });
    console.log("Connected successfully to mongo server");
  } catch {
    //Ensures that the client will close when your finish/error
    console.log(`can't connect to db`);

    await client.close();
  }
}
