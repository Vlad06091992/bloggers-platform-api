import {AvailableResolutionsType} from "../../../types";

export type PostCreateModel = {
    title: string
    author: string
    availableResolutions?: AvailableResolutionsType[] | null
}
