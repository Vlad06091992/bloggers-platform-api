import {PostCreateModel} from "../../../posts/model/request-models/PostCreateModel";

export type CreatePostModelForSpecificBlog = Omit<PostCreateModel, "blogId">