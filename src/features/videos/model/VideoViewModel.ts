import {AvailableResolutionsType} from "../../../../src/types";

export type VideoViewModel =  {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction?: any;
    createdAt: Date;
    publicationDate: Date;
    availableResolution?: AvailableResolutionsType[] | null;
}