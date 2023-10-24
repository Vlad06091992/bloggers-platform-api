import {VideoCreateModel} from "./features/videos/model/VideoCreateModel";
import {AvailableResolutionsType} from "./types";
import {VideoUpdateModel} from "./features/videos/model/VideoUpdateModel";

export const createErrorObject = (message: string, field: string) => {
    return {
        errorsMessages: [
            {
                message,
                field
            }
        ]
    }

}

const checkVideoQuality = (videoQuality:Array<string> | null | undefined) => {
    const allowableVideoResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
    let res = true
    let incorrectValue = null
    if(videoQuality === null || videoQuality === undefined) return true
    if(!Array.isArray(videoQuality) || videoQuality.length < 1) return false

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
    debugger
    if (author.length > 40 || !author) {
        if(!author) return createErrorObject('no valid filed', 'author')
        return createErrorObject(`${author.length > 20 ? "length more then 20" : "Too short name"}`, 'author')
    } else if (!title || title.length > 40) {
        if(!author) return createErrorObject('no valid filed', 'title')
        return createErrorObject(`${title.length > 40 ? "length more then 40" : "Too short name"}`, 'title')
    }
if(availableResolutions){}

    if(!checkVideoQuality(availableResolutions)){
        return createErrorObject(`incorrect quality video`, 'availableResolutions')
    }
}

export const validateUpdateVideoData = ( {author, title, availableResolutions,minAgeRestriction,canBeDownloaded,publicationDate}: VideoUpdateModel) => {
    if (author.length > 20 || !author) {
        return createErrorObject(`${author.length > 40 ? "length more then 40" : "Too short name"}`, 'author')
    } else if (title.length > 40 || !title) {
        return createErrorObject(`${title.length > 40 ? "length more then 40" : "Too short name"}`, 'title')
    }

    if(minAgeRestriction != undefined){
    if (minAgeRestriction > 18 || minAgeRestriction < 1 || typeof minAgeRestriction != 'number') {
            return createErrorObject(`invalid quality`, 'minAgeRestriction')
        }
    }

    if(canBeDownloaded != undefined){
        if (typeof canBeDownloaded != 'boolean') {
            return createErrorObject(`invalid quality`, 'canBeDownloaded')
        }
    }



    if(publicationDate != undefined){
        if ( typeof publicationDate != "string") {
            return createErrorObject(`invalid quality`, 'publicationDate')
        }
    }



    if(!checkVideoQuality(availableResolutions)){
        return createErrorObject(`incorrect quality video`, 'availableResolution')
    }
}