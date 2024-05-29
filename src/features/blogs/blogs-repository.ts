import {
    BlogCreateModel,
    BlogType,
    BlogUpdateModel,
    BlogViewModel,
    QueryBlogModel,
    ResponseBlogsModel
} from "./types/types";
import {ObjectId} from "mongodb";
import {BlogModelClass} from "../../mongoose/models";
import {blogsService} from "../../features/blogs/composition-blogs";

 export class BlogsRepository  {
    async findBlogs(reqQuery: QueryBlogModel): Promise<ResponseBlogsModel> {
        let filter = {};

        if (reqQuery.searchNameTerm) {
            filter = {name: {$regex: reqQuery.searchNameTerm, $options: "i"}};
        }

        const sortBy = reqQuery.sortBy || "createdAt";
        const sortDirection = reqQuery.sortDirection || "desc";
        const pageNumber = reqQuery.pageNumber || 1;
        const pageSize = reqQuery.pageSize || 10;

        const totalCount = await BlogModelClass.countDocuments(filter);
        //@ts-ignore
        return await BlogModelClass.pagination(filter, pageNumber, pageSize, sortBy, sortDirection, totalCount, blogsService.getBlogWithPrefixIdToViewModel)
    }
    async createBlog(data: BlogType): Promise<BlogViewModel> {
        const createdBlog = await BlogModelClass.create(data)
        return {
            id: data._id.toString(),
            createdAt: data.createdAt,
            description: data.description,
            name: data.name,
            websiteUrl: data.websiteUrl,
            isMembership: data.isMembership,
        }
    }
    async updateBlog(id: string, data: BlogUpdateModel) {
        try {
            let result = await BlogModelClass.updateOne(
                {_id: new ObjectId(id)},
                {$set: data},
            );
            return result.matchedCount == 1;
        } catch (e) {
            return false;
        }
    }

    async deleteBlog(id: string) {
        try {
            let result = await BlogModelClass.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (e) {
            return false;
        }
    }
    async deleteAllBlogs() {
        await BlogModelClass.deleteMany({});
        return true;
    }
};

