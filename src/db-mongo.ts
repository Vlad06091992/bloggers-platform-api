import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
import {BlogViewModel} from "./features/blogs/model/BlogViewModel";
import {PostViewModel} from "./features/posts/model/PostViewModel";
import {VideoViewModel} from "./features/videos/model/VideoViewModel";
import {BlogType} from "../src/features/blogs/types/types";



dotenv.config()


const URL = process.env.MONGO_URL

console.log(URL)

if (!URL) {
    throw new Error("URL not found")
}

export const client = new MongoClient(URL)

// const db = client.db('base-backend');
const db = client.db();
export const blogsCollection = db.collection<BlogViewModel>('blogs');
export const postsCollection = db.collection<PostViewModel>('posts');
export const videosCollection = db.collection<VideoViewModel>('videos');

export async function runDb() {
    try {
//Connect client to the server
        await client.connect()
        //Establish ane verify connection
        await db.command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch {
//Ensures that the client will close when your finish/error
        console.log(`can't connect to db`)

        await client.close()
    }
}