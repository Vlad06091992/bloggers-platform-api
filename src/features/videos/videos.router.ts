import express, {Response} from "express";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../../src/types";
import {QueryVideoModel} from "./model/QueryVideoModel";
import {VideoViewModel} from "./model/VideoViewModel";
import {URIParamsVideoIdModel} from "./model/URIParamsVideoIdModel";
import {VideoCreateModel} from "./model/VideoCreateModel";
import {VideoUpdateModel} from "./model/VideoUpdateModel";
import {validateUpdateVideoData} from "./validators/validateUpdateVideoData";
import {validateCreateVideoData} from "./validators/validateCreateVideoData";
import {videosRepository} from "./videos-repository";


export const getVideosRouter = () => {
    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryVideoModel>, res: Response<VideoViewModel[]>) => {
        let foundedVideos = videosRepository.findVideos(req.query.title)

        res.status(200).send(foundedVideos)
    })

    router.get('/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response<VideoViewModel | number>) => {
        const video = videosRepository.getVideoById(req.params.id)
        if (video) {
            res.send(video)

        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.post('/', (req: RequestWithBody<VideoCreateModel>, res: Response<VideoViewModel | any>) => {
        let errorObject = validateCreateVideoData(req.body)
        if (errorObject.errorsMessages.length > 0) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errorObject)
        } else {
            const newVideo = videosRepository.createVideo(req.body)
            res.status(HTTP_STATUSES.CREATED_201).send(newVideo)
        }
    })

    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsVideoIdModel, VideoUpdateModel>, res: Response<VideoViewModel | any>) => {
        const id = req.params.id
        let errorObject = validateUpdateVideoData(req.body)
        if (errorObject.errorsMessages.length > 0) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errorObject)
        } else {
            let updatedVideo = videosRepository.updateVideo(id, req.body)
            if (updatedVideo) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(404)
            }
        }
    })

    router.delete('/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response<number>) => {
        const isDeleted = videosRepository.deleteVideo(req.params.id)
        isDeleted ? res.send(HTTP_STATUSES.NO_CONTENT_204) : res.send(HTTP_STATUSES.NOT_FOUND_404)
    })
    return router
}



