import express, { Response } from "express";
import { HTTP_STATUSES } from "../../http_statuses/http_statuses";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../../../src/types";
import { QueryVideoModel } from "./model/QueryVideoModel";
import { VideoViewModel } from "./model/VideoViewModel";
import { URIParamsVideoIdModel } from "./model/URIParamsVideoIdModel";
import { VideoCreateModel } from "./model/VideoCreateModel";
import { VideoUpdateModel } from "./model/VideoUpdateModel";
import { validateUpdateVideoData } from "./validators/validateUpdateVideoData";
import { validateCreateVideoData } from "./validators/validateCreateVideoData";
import { videosRepositoryMemory } from "../videos/videos-repository-memory";

export const getVideosRouter = () => {
  const router = express.Router();

  router.get(
    "/",
    (
      req: RequestWithQuery<QueryVideoModel>,
      res: Response<VideoViewModel[]>,
    ) => {
      let foundedVideos = videosRepositoryMemory.findVideos(req.query.title);

      res.status(200).send(foundedVideos);
    },
  );

  router.get(
    "/:id",
    (
      req: RequestWithParams<URIParamsVideoIdModel>,
      res: Response<VideoViewModel | number>,
    ) => {
      const video = videosRepositoryMemory.getVideoById(req.params.id);
      if (video) {
        res.send(video);
      } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404);
      }
    },
  );

  router.post(
    "/",
    (
      req: RequestWithBody<VideoCreateModel>,
      res: Response<VideoViewModel | any>,
    ) => {
      let errorObject = validateCreateVideoData(req.body);
      if (errorObject.errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errorObject);
      } else {
        const newVideo = videosRepositoryMemory.createVideo(req.body);
        res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
      }
    },
  );

  router.put(
    "/:id",
    (
      req: RequestWithParamsAndBody<URIParamsVideoIdModel, VideoUpdateModel>,
      res: Response<VideoViewModel | any>,
    ) => {
      const id = req.params.id;
      let errorObject = validateUpdateVideoData(req.body);
      if (errorObject.errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errorObject);
      } else {
        let updatedVideo = videosRepositoryMemory.updateVideo(id, req.body);
        if (updatedVideo) {
          res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
          res.sendStatus(404);
        }
      }
    },
  );

  router.delete(
    "/:id",
    (req: RequestWithParams<URIParamsVideoIdModel>, res: Response<number>) => {
      const isDeleted = videosRepositoryMemory.deleteVideo(req.params.id);
      isDeleted
        ? res.send(HTTP_STATUSES.NO_CONTENT_204)
        : res.send(HTTP_STATUSES.NOT_FOUND_404);
    },
  );
  return router;
};


/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Returns all videos
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           text/plain:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VideosResponseModel'
 *     tags:
 *       - Videos
 *   post:
 *     summary: Create a new video entity
 *     tags:
 *       - Videos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VideoCreateModel'
 *           example:
 *             title: "string"
 *             author: "string"
 *             availableResolutions:
 *               - "P144"
 *     responses:
 *       '201':
 *         description: Returns the newly created video
 *         content:
 *           text/plain:
 *             schema:
 *               $ref: '#/components/schemas/VideoViewModel'
 *             example:
 *               id: 0
 *               title: "string"
 *               author: "string"
 *               canBeDownloaded: true
 *               minAgeRestriction: null
 *               createdAt: "2023-12-27T19:11:01.653Z"
 *               publicationDate: "2023-12-27T19:11:01.653Z"
 *               availableResolutions:
 *                 - "P144"
 *       '400':
 *         description: If the inputModel has incorrect values
 *         content:
 *           text/plain:
 *             schema:
 *               $ref: '#/components/schemas/APIErrorResult'
 *
 */


/**
 * @openapi
 * /videos/{id}:
 *   get:
 *     summary: Get details of an existing video
 *     tags:
 *       - Videos
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Id of the existing video
 *         schema:
 *           type: string
 *         required: true
 *         example: "string"
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           text/plain:
 *             example:
 *               id: 0
 *               title: "string"
 *               author: "string"
 *               canBeDownloaded: true
 *               minAgeRestriction: null
 *               createdAt: "2023-12-27T19:11:01.653Z"
 *               publicationDate: "2023-12-27T19:11:01.653Z"
 *               availableResolutions:
 *                 - "P144"
 *             schema:
 *               $ref: '#/components/schemas/VideoViewModel'
 *       '404':
 *         description: Not Found
 */


/**
 * @swagger
 * /videos/{id}:
 *   put:
 *     summary: Update an existing post
 *     tags:
 *       - Videos
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to be updated
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VideoUpdateModel'
 *           example:
 *             title: "string"
 *             author: "string"
 *             availableResolutions:
 *             - "P144"
 *     responses:
 *       '204':
 *         description: No Content
 *       '400':
 *         description: If the inputModel has incorrect values
 *         content:
 *           text/plain:
 *             example:
 *               errorsMessages:
 *                 - message: "string"
 *                   field: "string"
 *             schema:
 *               $ref: '#/components/schemas/APIErrorResult'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not Found
 */


/**
 * @swagger
 * /videos/{id}:
 *   delete:
 *     summary: Delete an existing video
 *     tags:
 *       - Videos
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post.
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '204':
 *         description: No Content
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not Found
 */




/**
 * @swagger
 * components:
 *   schemas:
 *     VideoCreateModel:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 40
 *         author:
 *           type: string
 *           maxLength: 20
 *         availableResolutions:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - P144
 *               - P240
 *               - P360
 *               - P480
 *               - P720
 *               - P1080
 *               - P1440
 *               - P2160
 *
 *     VideoUpdateModel:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 40
 *         author:
 *           type: string
 *           maxLength: 20
 *         availableResolutions:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - P144
 *               - P240
 *               - P360
 *               - P480
 *               - P720
 *               - P1080
 *               - P1440
 *               - P2160
 *
 *     VideoViewModel:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *           title:
 *             type: string
 *           author:
 *             type: string
 *           canBeDownloaded:
 *             type: boolean
 *           minAgeRestriction:
 *             type: integer
 *             nullable: true
 *           createdAt:
 *             type: string
 *             format: date-time
 *           publicationDate:
 *             type: string
 *             format: date-time
 *           availableResolutions:
 *             type: array
 *             items:
 *               type: string
 *               enum:
 *                 - P144
 *                 - P240
 *                 - P360
 *                 - P480
 *                 - P720
 *                 - P1080
 *                 - P1440
 */


