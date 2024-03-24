import {PostCreateModel, PostType} from "./types/types";
import { PostUpdateModel } from "./types/types";
import {postsService} from '../posts/posts-service'
import { postsCollection } from "../../db-mongo";
import { ObjectId } from "mongodb";
import { PostViewModel } from "./types/types";
import { QueryPostModel } from "./types/types";
import {ResponsePostsModel} from "./types/types";
import {blogsService} from "../blogs/blogs-service";



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
  async createPost(data: PostType) {
    const { insertedId } = await postsCollection.insertOne(data);
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
