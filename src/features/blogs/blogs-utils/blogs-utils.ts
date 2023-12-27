import { blogsCollection } from "../../../db-mongo";
import { ObjectId, WithId } from "mongodb";
import { BlogType } from "../types/types";
import { BlogViewModel } from "../model/BlogViewModel";

type ResultType = "object" | "boolean";

export const findBlogById = async (
  id: string,
  result: ResultType = "boolean",
) => {
  try {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    return result == "boolean" ? !!blog : blog;
  } catch (e) {
    return false;
  }
};

export const getBlogWithPrefixIdToViewModel = (
  blog: WithId<BlogType>,
): BlogViewModel => {
  return {
    id: blog._id.toString(),
    createdAt: blog.createdAt,
    description: blog.description,
    name: blog.name,
    websiteUrl: blog.websiteUrl,
    isMembership: blog.isMembership,
  };
};
