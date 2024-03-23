import {blogsCollection} from "../../db-mongo";
import {BlogCreateModel, BlogUpdateModel, BlogViewModel, QueryBlogModel, ResponseBlogsModel} from "./types/types";
import {ObjectId} from "mongodb";
import {blogsService} from "../blogs/blogs-service";

class BlogCreateClass {
  name: string;
  websiteUrl: string;
  description: string;
  isMembership: boolean;
  createdAt: string;

  constructor({ name, websiteUrl, description }: BlogCreateModel) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.isMembership = false;
    this.createdAt = new Date().toISOString();
  }
}

export const blogsRepository = {
  async findBlogs(reqQuery: QueryBlogModel):Promise<ResponseBlogsModel> {
    let filter = {};

    if (reqQuery.searchNameTerm) {
      filter = { name: { $regex: reqQuery.searchNameTerm, $options: "i" } };
    }

    const sortBy = reqQuery.sortBy || "createdAt";
    const sortDirection = reqQuery.sortDirection || "desc";
    const pageNumber = reqQuery.pageNumber || 1;
    const pageSize = reqQuery.pageSize || 10;

    const totalCount = await blogsCollection.countDocuments(filter);
    const res = await blogsCollection
      .find(filter)
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .sort({ [sortBy]: sortDirection == "asc" ? 1 : -1 })
      .toArray();
    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: res.map(blogsService.getBlogWithPrefixIdToViewModel),
    };
  },

  async getBlogById(id: string): Promise<BlogViewModel | null> {
    try {
      let res = await blogsCollection.findOne({ _id: new ObjectId(id) });
      return blogsService.getBlogWithPrefixIdToViewModel(res!);
    } catch (e) {
      return null;
    }
  },
  async createBlog(data: BlogCreateModel): Promise<BlogViewModel> {
    const newBlogTemplate = new BlogCreateClass(data);
    const { insertedId } = await blogsCollection.insertOne(newBlogTemplate);
    return (await this.getBlogById(insertedId.toString()))!;
  },
  async updateBlog(id: string, data: BlogUpdateModel) {
    try {
      let result = await blogsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data },
      );
      return result.matchedCount == 1;
    } catch (e) {
      return false;
    }
  },
  async deleteBlog(id: string) {
    try {
      let result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (e) {
      return false;
    }
  },
  async deleteAllBlogs() {
    await blogsCollection.deleteMany({});
    return true;
  },
};
