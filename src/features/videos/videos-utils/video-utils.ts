import { AvailableResolutionsType } from "../../../types";
import { VideoCreateModel } from "../model/VideoCreateModel";

export class CreateError {
  message: string;
  field: string;

  constructor(message: string, field: string) {
    this.message = message;
    this.field = field;
  }
}

export class Video {
  canBeDownloaded: boolean;
  title: string;
  author: string;
  availableResolutions?: AvailableResolutionsType[] | null | undefined;
  id: number;
  minAgeRestriction: null | number;
  createdAt: string;
  publicationDate: string;

  constructor({ title, author, availableResolutions }: VideoCreateModel) {
    this.title = title;
    this.author = author;
    this.availableResolutions = availableResolutions;
    this.id = +new Date();
    this.minAgeRestriction = null;
    this.canBeDownloaded = false;
    this.createdAt = new Date().toISOString();
    this.publicationDate = new Date(
      new Date().setDate(new Date().getDate() + 1),
    ).toISOString();
  }
}
