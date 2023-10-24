import express, {Response} from "express";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {
    AvailableResolutionsType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery,
    RootDBType,
    VideoType
} from "../../../src/types";
import {QueryVideoModel} from "./model/QueryVideoModel";
import {VideoViewModel} from "./model/VideoViewModel";
import {URIParamsVideoIdModel} from "./model/URIParamsVideoIdModel";
import {VideoCreateModel} from "./model/VideoCreateModel";
import {VideoUpdateModel} from "./model/VideoUpdateModel";
import {validateCreateVideoData, validateUpdateVideoData} from "../../utils";


class Video {
    canBeDownloaded: boolean;
    title: string;
    author: string;
    availableResolution?: AvailableResolutionsType[] | null | undefined
    id: number
    minAgeRestriction: null | number
    createdAt: string
    publicationDate: string

    constructor({title, author, availableResolutions}: VideoCreateModel) {
        this.title = title
        this.author = author
        this.availableResolution = availableResolutions
        this.id = +new Date()
        this.minAgeRestriction = null
        this.canBeDownloaded = false
        this.createdAt = new Date().toISOString()
        this.publicationDate = new Date().toISOString()
    }
}

const UpdateVideo = (video: VideoType, updateData: VideoUpdateModel): VideoType => {
    return {
        title: updateData.title,
        author: updateData.author,
        availableResolution: updateData.availableResolutions || video.availableResolution,
        publicationDate: updateData.publicationDate || video.publicationDate,
        createdAt: video.createdAt,
        id: video.id,
        canBeDownloaded: updateData.canBeDownloaded ?? video.canBeDownloaded,
        minAgeRestriction: updateData.minAgeRestriction || video.minAgeRestriction,
    }
}

export const getVideosRouter = (db: RootDBType) => {
    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryVideoModel>, res: Response<VideoViewModel[]>) => {
        let foundedVideos = db.videos

        if (req.query.title) {
            foundedVideos = foundedVideos.filter(v => v.title.indexOf(req.query.title) > -1)
        }
        // res.status(200).send(foundedCourses.map(el=>(getCourseViewModel(el))))
        res.status(200).send(foundedVideos)
    })

    router.get('/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response<VideoViewModel | number>) => {
        const id = req.params.id
        const video = db.videos.find((v: VideoType) => v.id === +id)
        if (video) {
            // res.send(getCourseViewModel(course))
            res.send(video)

        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.post('/', (req: RequestWithBody<VideoCreateModel>, res: Response<VideoViewModel | any>) => {
        let {title, author, availableResolutions} = req.body
        let errorObject = validateCreateVideoData(req.body)

        if (errorObject) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errorObject)
        } else {
            const video = new Video({author, availableResolutions, title})
            db.videos.push(video)
            // res.status(HTTP_STATUSES.CREATED_201).send(getCourseViewModel(course))
            res.status(HTTP_STATUSES.CREATED_201).send(video)
        }
    })


    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsVideoIdModel, VideoUpdateModel>, res: Response<VideoViewModel | any>) => {
        const id = req.params.id
        const indexVideo = db.videos.findIndex(el => el.id == +id)
        const dataForUpdate = req.body

        let errorObject = validateUpdateVideoData(req.body)
        if (errorObject) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errorObject)
        } else {
            let video = db.videos.find((v: VideoType) => v.id === +id)
            if (video !== undefined) {
                db.videos[indexVideo] = UpdateVideo(video, dataForUpdate)
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            }
        }

    })


    router.delete('/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response<number>) => {
        const id = req.params.id
        const indexItem = db.videos.findIndex(v => v.id === +id)

        if (indexItem > -1) {
            db.videos.splice(indexItem, 1)
            res.send(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    return router

}



