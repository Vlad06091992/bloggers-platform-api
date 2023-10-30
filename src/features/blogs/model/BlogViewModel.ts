import {AvailableResolutionsType} from "../../../../src/types";

export type BlogViewModel =  {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction?: any;
    createdAt: string;
    publicationDate: string;
    availableResolution?: AvailableResolutionsType[] | null;
}