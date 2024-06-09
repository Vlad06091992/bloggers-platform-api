import mongoose from "mongoose";
import {LikesPostSchema, LikesPostSchemaType, LikesPostType} from "../../domain/likes-posts-entities";

export const LikesPostModel = mongoose.model<LikesPostType, LikesPostSchemaType>("postsLikes", LikesPostSchema);
