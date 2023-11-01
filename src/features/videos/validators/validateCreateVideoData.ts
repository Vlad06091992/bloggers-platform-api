import {VideoCreateModel} from "../model/VideoCreateModel";
import {CreateError} from "../videos-utils/video-utils";
import {ErrorResponseType} from "../../../types";
import {validateVideoQuality} from "./validateVideoQuality";

export const validateCreateVideoData = ({author, title, availableResolutions}: VideoCreateModel) => {
    const errObj: ErrorResponseType = {
        errorsMessages: []
    }

    if (!author || author.length > 20 || typeof author != 'string') {
        if (!author || typeof author != 'string') errObj.errorsMessages.push(new CreateError('no valid filed', 'author'))
        else {
            errObj.errorsMessages.push(new CreateError(`${author.length > 20 ? "length more then 20" : "Too short name"}`, 'author'))
        }

    }
    if (!title || title.length > 40 || typeof title != 'string') {
        if (!title || typeof title != 'string') errObj.errorsMessages.push(new CreateError('no valid filed', 'title'))
        else {
            errObj.errorsMessages.push(new CreateError(`${title.length > 40 ? "length more then 40" : "Too short name"}`, 'title'))
        }
    }

    if (!validateVideoQuality(availableResolutions)) {
        errObj.errorsMessages.push(new CreateError(`incorrect quality video`, 'availableResolutions'))
    }
    return errObj
}
