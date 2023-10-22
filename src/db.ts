import {RootDBType} from "../src/types";

export const db: RootDBType = {
    videos: [{
        title: 'new video',
        id: 1,
        author: "author",
        minAgeRestriction: null,
        canBeDownloaded: true,
        createdAt: new Date(),
        publicationDate: new Date(),
        availableResolution: ['P144']
    },
        {
            title: 'new video2',
            id: 2,
            author: "author2",
            minAgeRestriction: null,
            canBeDownloaded: true,
            createdAt: new Date(),
            publicationDate: new Date(),
            availableResolution: ['P360']
        }]
}

