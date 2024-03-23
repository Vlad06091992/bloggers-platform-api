import { blogsCollection } from "../../db-mongo";
import { ObjectId, WithId } from "mongodb";
import {BlogCreateModel, BlogType, BlogUpdateModel, QueryBlogModel} from "./types/types";
import { BlogViewModel } from "./types/types";
import {blogsRepository} from "./blogs-repository";

type ResultType = "object" | "boolean";

export const blogsService = {

    async findBlogs(query:QueryBlogModel){
        return  await blogsRepository.findBlogs(query);
    },

    async findBlogById(id: string, result: ResultType = "boolean"):Promise<BlogViewModel | boolean> {
        try {
            const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
            return result === "boolean" ? !!blog : blog ? this.getBlogWithPrefixIdToViewModel(blog) : false;
        } catch (e) {
            return false;
        }
    },

    async findBlogNameByBlogId(blogId: string) {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
        return blog?.name;
    },

    async createBlog(body:BlogCreateModel):Promise<BlogViewModel | number>{
        return await blogsRepository.createBlog(body);
    },

    async updateBlog(id:string,body:BlogUpdateModel):Promise<BlogViewModel | boolean>{
        return await blogsRepository.updateBlog(id,body);
    },



    getBlogWithPrefixIdToViewModel(blog: WithId<BlogType>): BlogViewModel {
        return {
            id: blog._id.toString(),
            createdAt: blog.createdAt,
            description: blog.description,
            name: blog.name,
            websiteUrl: blog.websiteUrl,
            isMembership: blog.isMembership,
        };
    }
};

