import {AvailableResolutionsType} from "../../../types";

export type VideoUpdateModel = {
    title: string,
    author: string,
    availableResolutions?: AvailableResolutionsType[] | null
    canBeDownloaded?: boolean
    minAgeRestriction?: number
    publicationDate?: string
}


