import {AvailableResolutionsType} from "../../../types";

export type VideoUpdateModel = {
    title: string,
    author: string,
    availableResolutions: AvailableResolutionsType[]
    canBeDownloaded: boolean
    minAgeRestriction: number
    publicationDate: Date
}


