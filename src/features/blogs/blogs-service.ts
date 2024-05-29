import {ObjectId} from "mongodb";
import {BlogCreateModel, BlogType, BlogUpdateModel, BlogViewModel, QueryBlogModel} from "./types/types";
import {BlogsRepository} from "./blogs-repository";
import {BlogModelClass} from "../../mongoose/models";


type ResultType = "object" | "boolean";

class BlogCreateClass {
    _id:ObjectId;
    isMembership: boolean;
    createdAt: string;

    constructor(public name:string, public description:string, public websiteUrl:string) {
        this.isMembership = false;
        this.createdAt = new Date().toISOString();
        this._id = new ObjectId();
    }
}

export class BlogsService  {
    constructor(protected  blogsRepository:BlogsRepository) {
        this.blogsRepository = blogsRepository
    }

    async findBlogs(query:QueryBlogModel){
        return  await this.blogsRepository.findBlogs(query);
    }

    async findBlogById(id: string, result: ResultType = "boolean"):Promise<BlogViewModel | boolean> {
        try {
            const blog = await BlogModelClass.findOne({ _id: new ObjectId(id) });
            return result === "boolean" ? !!blog : blog ? this.getBlogWithPrefixIdToViewModel(blog) : false;
        } catch (e) {
            return false;
        }
    }

    async findBlogNameByBlogId(blogId: string) {
        const blog = await BlogModelClass.findOne({ _id: new ObjectId(blogId) });
        return blog?.name;
    }

    async createBlog(body:BlogCreateModel):Promise<BlogViewModel | number>{

        const{name,websiteUrl,description} =body
        const newBlogTemplate = new BlogCreateClass(name,description,websiteUrl);
        return await this.blogsRepository.createBlog(newBlogTemplate);
    }

    async updateBlog(id:string,body:BlogUpdateModel):Promise<BlogViewModel | boolean>{
        return await this.blogsRepository.updateBlog(id,body);
    }

    async deleteBlog(id:string):Promise<boolean>{
        return await this.blogsRepository.deleteBlog(id);
    }

    getBlogWithPrefixIdToViewModel(blog: BlogType): BlogViewModel {
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


