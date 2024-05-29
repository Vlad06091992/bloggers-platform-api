import {BlogsRepository} from "../../features/blogs/blogs-repository";
import {BlogsService} from "../../features/blogs/blogs-service";
import {BlogsController} from "../../features/blogs/blogs-controller";

export const blogsRepository = new BlogsRepository()
export const blogsService = new BlogsService(blogsRepository)
export const blogsController = new BlogsController(blogsService)
