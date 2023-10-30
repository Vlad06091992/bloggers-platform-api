import {AvailableResolutionsType} from "../../../types";

export type BlogCreateModel = {
    title: string
    author: string
    availableResolutions?: AvailableResolutionsType[] | null
}
