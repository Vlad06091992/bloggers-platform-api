import { VideoUpdateModel } from "../model/VideoUpdateModel";
import { CreateError } from "../videos-utils/video-utils";
import { ErrorResponseType } from "../../../types";
import { validateVideoQuality } from "./validateVideoQuality";
export const validateUpdateVideoData = ({
  author,
  title,
  availableResolutions,
  minAgeRestriction,
  canBeDownloaded,
  publicationDate,
}: VideoUpdateModel) => {
  const errObj: ErrorResponseType = {
    errorsMessages: [],
  };

  if (!author || author.length > 20 || typeof author != "string") {
    if (!author || typeof author != "string")
      errObj.errorsMessages.push(new CreateError("no valid filed", "author"));
    else {
      errObj.errorsMessages.push(
        new CreateError(
          `${author.length > 20 ? "length more then 20" : "Too short name"}`,
          "author",
        ),
      );
    }
  }
  if (!title || title.length > 40 || typeof title != "string") {
    if (!title || typeof title != "string")
      errObj.errorsMessages.push(new CreateError("no valid filed", "title"));
    else {
      errObj.errorsMessages.push(
        new CreateError(
          `${title.length > 40 ? "length more then 40" : "Too short name"}`,
          "title",
        ),
      );
    }
  }

  if (minAgeRestriction != undefined) {
    if (
      minAgeRestriction > 18 ||
      minAgeRestriction < 1 ||
      typeof minAgeRestriction != "number"
    ) {
      errObj.errorsMessages.push(
        new CreateError(`invalid quality`, "minAgeRestriction"),
      );
    }
  }

  if (canBeDownloaded != undefined) {
    if (typeof canBeDownloaded != "boolean") {
      errObj.errorsMessages.push(
        new CreateError(`invalid quality`, "canBeDownloaded"),
      );
    }
  }

  if (publicationDate != undefined) {
    if (typeof publicationDate != "string") {
      errObj.errorsMessages.push(
        new CreateError(`invalid quality`, "publicationDate"),
      );
    }
  }

  if (!validateVideoQuality(availableResolutions)) {
    errObj.errorsMessages.push(
      new CreateError(`incorrect quality video`, "availableResolution"),
    );
  }
  return errObj;
};
