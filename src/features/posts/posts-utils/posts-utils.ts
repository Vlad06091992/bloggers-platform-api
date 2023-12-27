import { db } from "../../../db";
// import {PostViewModel} from "./models/PostViewModel"
import { PostViewModel } from "../model/PostViewModel";
import { blogsCollection, postsCollection } from "../../../db-mongo";
import { ObjectId, WithId } from "mongodb";
import { PostType } from "../types/types";

type ResultType = "object" | "boolean";

export const findPostById = async (
  id: string,
  result: ResultType = "boolean",
) => {
  const post = await postsCollection.findOne({ id });
  return result == "boolean" ? !!post : post;
};

export const findBlogNameByBlogId = async (blogId: string) => {
  const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
  return blog?.name;
};

export const getPostWithPrefixIdToViewModel = (
  post: WithId<PostType>,
): PostViewModel => {
  return {
    id: post._id.toString(),
    blogId: post.blogId,
    title: post.title,
    blogName: post.blogName,
    shortDescription: post.shortDescription,
    content: post.content,
    createdAt: post.createdAt,
  };
};

export const findIndexPostById = (id: string) => {
  const postId = db.posts.findIndex((post: PostViewModel) => post.id === id!);
  return postId;
};
