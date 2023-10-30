import {AvailableResolutionsType} from "../../../types";

export type PostUpdateModel = {
    title: string,
    author: string,
    availableResolutions?: AvailableResolutionsType[] | null
    canBeDownloaded?: boolean
    minAgeRestriction?: number
    publicationDate?: string
}


