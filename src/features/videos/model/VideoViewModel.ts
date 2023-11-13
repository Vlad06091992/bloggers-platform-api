import {AvailableResolutionsType} from "../../../../src/types";

export type VideoViewModel =  {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: null | number;
    createdAt: string;
    publicationDate: string;
    availableResolutions?: AvailableResolutionsType[] | null;
}