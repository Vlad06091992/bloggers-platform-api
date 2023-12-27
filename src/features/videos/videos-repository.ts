import { db } from "../../db";
import { VideoType } from "../../types";
import { VideoCreateModel } from "../videos/model/VideoCreateModel";
import { VideoUpdateModel } from "../videos/model/VideoUpdateModel";
import { Video } from "./videos-utils/video-utils";

const UpdateVideo = (
  video: VideoType,
  updateData: VideoUpdateModel,
): VideoType => {
  return {
    title: updateData.title,
    author: updateData.author,
    availableResolutions:
      updateData.availableResolutions || video.availableResolutions,
    publicationDate: updateData.publicationDate || video.publicationDate,
    createdAt: video.createdAt,
    id: video.id,
    canBeDownloaded: updateData.canBeDownloaded ?? video.canBeDownloaded,
    minAgeRestriction: updateData.minAgeRestriction || video.minAgeRestriction,
  };
};

export const videosRepositoryMemory = {
  findVideos(title: string | null) {
    let foundedVideos = db.videos;
    if (title) {
      foundedVideos = foundedVideos.filter((v) => v.title.indexOf(title) > -1);
    }
    return foundedVideos;
  },
  getVideoById(id: string) {
    const video = db.videos.find((v: VideoType) => v.id === +id!);
    if (video && id) {
      return video;
    }
  },
  createVideo(data: VideoCreateModel) {
    const video = new Video(data);
    db.videos.push(video);
    return video;
  },
  updateVideo(id: string, data: VideoUpdateModel) {
    const {} = data;
    const indexVideo = db.videos.findIndex((el) => el.id == +id);

    let video = db.videos.find((v: VideoType) => v.id === +id);
    if (video !== undefined) {
      db.videos[indexVideo] = UpdateVideo(video, data);
    }
    return video;
  },
  deleteVideo(id: string) {
    const indexItem = db.videos.findIndex((v) => v.id === +id);

    if (indexItem > -1) {
      db.videos.splice(indexItem, 1);
      return true;
    } else {
      return false;
    }
  },
};
