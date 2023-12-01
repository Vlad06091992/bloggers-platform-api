import {BlogType} from "../types/types";


export type BlogViewModel = BlogType & {id:string}// (id:string)
export type BlogInMongoDB = BlogType & {_id:string}// (_id:string)