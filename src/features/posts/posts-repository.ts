import { PostCreateModel } from "./types/types";
import { PostUpdateModel } from "./types/types";
import {postsService} from '../posts/posts-service'
import { postsCollection } from "../../db-mongo";
import { ObjectId } from "mongodb";
import { PostViewModel } from "./types/types";
import { QueryPostModel } from "./types/types";
import {ResponsePostsModel} from "./types/types";
import {blogsService} from "../blogs/blogs-service";

type CreatePostForClass = PostCreateModel & {
  blogName: string;
};

class Post {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;

  constructor({
    blogId,
    title,
    blogName,
    shortDescription,
    content,
  }: CreatePostForClass) {
    this.blogId = blogId;
    this.blogName = blogName;
    this.title = title;
    this.content = content;
    this.shortDescription = shortDescription;
    this.createdAt = new Date().toISOString();
  }
}

export const postsRepository = {
  async findPosts(reqQuery: QueryPostModel):Promise<ResponsePostsModel> {
    const sortBy = reqQuery.sortBy || "createdAt";
    const sortDirection = reqQuery.sortDirection || "desc";
    const pageNumber = reqQuery.pageNumber || 1;
    const pageSize = reqQuery.pageSize || 10;

    const totalCount = await postsCollection.countDocuments();
    let res = await postsCollection
      .find()
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .sort({ [sortBy]: sortDirection == "asc" ? 1 : -1 })
      .toArray();
    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: res.map(postsService.getPostWithPrefixIdToViewModel),
    };
  },
  async getPostById(id: string) {
    try {
      let res = await postsCollection.findOne({ _id: new ObjectId(id) });
      return postsService.getPostWithPrefixIdToViewModel(res!);
    } catch (e) {
      return null;
    }
  },
  async createPost(data: PostCreateModel): Promise<PostViewModel> {
    const blogName = (await blogsService.findBlogNameByBlogId(data.blogId))!;
    const newPostTemplate = new Post({ ...data, blogName });
    const { insertedId } = await postsCollection.insertOne({
      ...newPostTemplate,
    });
    return (await this.getPostById(insertedId.toString()))!;
  },
  async updatePost(id: string, data: PostUpdateModel) {
    try {
      let result = await postsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data },
      );
      return result.matchedCount === 1;
    } catch (e) {
      return false;
    }
  },
  async deletePost(id: string) {
    try {
      let result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (e) {
      return false;
    }
  },
  async deleteAllPosts() {
    await postsCollection.deleteMany({});
    return true;
  },
};
