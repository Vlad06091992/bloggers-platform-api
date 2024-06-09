import dotenv from "dotenv";
import {MongoClient} from "mongodb";
import mongoose from "mongoose"

dotenv.config();

const URL =  "mongodb+srv://smirnovru92:ZPELzjX1CckwoEDw@cluster0.d3ysfam.mongodb.net/base-backend?retryWrites=true&w=majority";
// const URL = process.env.MONGO_URL || "mongodb://localhost:27017";

if (!URL) {
  throw new Error("URL not found");
}

export const client = new MongoClient(URL);

// const db = client.db('base-backend');
const db = client.db();





export async function runDb() {
  try {
    await mongoose.connect(URL);
    console.log("Connected successfully mongoose");
    //Connect client to the server
    await client.connect();
    //Establish ane verify connection
    await db.command({ ping: 1 });
    console.log("Connected successfully to mongo server");
  } catch {
    //Ensures that the client will close when your finish/error
    console.log(`can't connect to db`);

    await client.close();
    await mongoose.disconnect()
  }
}
