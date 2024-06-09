import {LikesPostModel} from "../../../features/likes/api/models/likes-post-model";

export const likesPostsRepository = {
    async save(model: any) {
        model.save()
        return true
    },
    async deleteAllRecords() {
        await LikesPostModel.deleteMany({})
        return true
    }
}
