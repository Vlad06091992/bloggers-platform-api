import {VideoCreateModel} from "./features/videos/model/VideoCreateModel";
import {ErrorResponseType} from "./types";
import {VideoUpdateModel} from "./features/videos/model/VideoUpdateModel";


class CreateError {
    message: string
    field: string

    constructor(message: string, field: string) {
        this.message = message
        this.field = field
    }
}

const checkVideoQuality = (videoQuality: Array<string> | null | undefined) => {
    const allowableVideoResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
    let res = true
    let incorrectValue = null
    if (videoQuality === null || videoQuality === undefined) return true
    if (!Array.isArray(videoQuality) || videoQuality.length < 1) return false

    for (let i = 0; i < videoQuality.length; i++) {
        let elem = videoQuality[i]
        let result = allowableVideoResolutions.some(el => el === elem)
        if (result === false) {
            incorrectValue = videoQuality[i]
            res = result
            break
        }
    }
    return res
}

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

    if (!checkVideoQuality(availableResolutions)) {
        errObj.errorsMessages.push(new CreateError(`incorrect quality video`, 'availableResolutions'))
    }
    return errObj
}

export const validateUpdateVideoData = ({author, title, availableResolutions, minAgeRestriction, canBeDownloaded, publicationDate}: VideoUpdateModel) => {
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

    if (minAgeRestriction != undefined) {
        if (minAgeRestriction > 18 || minAgeRestriction < 1 || typeof minAgeRestriction != 'number') {
            errObj.errorsMessages.push(new CreateError(`invalid quality`, 'minAgeRestriction'))
        }
    }

    if (canBeDownloaded != undefined) {
        if (typeof canBeDownloaded != 'boolean') {
            errObj.errorsMessages.push(new CreateError(`invalid quality`, 'canBeDownloaded'))
        }
    }

    if (publicationDate != undefined) {
        if (typeof publicationDate != "string") {
            errObj.errorsMessages.push(new CreateError(`invalid quality`, 'publicationDate'))
        }
    }

    if (!checkVideoQuality(availableResolutions)) {
        errObj.errorsMessages.push(new CreateError(`incorrect quality video`, 'availableResolution'))
    }
    return errObj
}