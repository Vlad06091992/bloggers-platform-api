import {VideoCreateModel} from "./features/videos/model/VideoCreateModel";
import {AvailableResolutionsType} from "./types";

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

const checkVideoQuality = (videoQuality:Array<string>) => {
    const allowableVideoResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
    let res = true
    let incorrectValue = null
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

export const validateCreateVideoDate = ( {author, title, availableResolution}: VideoCreateModel) => {
    if (author.length > 40 || !author) {
        return createErrorObject(`${author.length > 40 ? "length more then 40" : "Too short name"}`, 'author')
    } else if (title.length > 40 || !title) {

        return createErrorObject(`${title.length > 40 ? "length more then 40" : "Too short name"}`, 'title')
    }

    if(!checkVideoQuality(availableResolution)){
        return createErrorObject(`incorrect quality video`, 'availableResolution')
    }

}
