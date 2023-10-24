import {AvailableResolutionsType} from "../../../types";

export type gVideoCreateModel = {
    title: string
    author: string
    availableResolutions?: AvailableResolutionsType[] | null
}
