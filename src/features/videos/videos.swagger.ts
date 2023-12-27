// /**
//  * @swagger
//  * /videos:
//  *   get:
//  *     summary: Returns all videos
//  *     responses:
//  *       200:
//  *         description: Success
//  *         content:
//  *           text/plain:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: integer
//  *                   title:
//  *                     type: string
//  *                   author:
//  *                     type: string
//  *                   canBeDownloaded:
//  *                     type: boolean
//  *                   minAgeRestriction:
//  *                     type: integer
//  *                     nullable: true
//  *                   createdAt:
//  *                     type: string
//  *                     format: date-time
//  *                   publicationDate:
//  *                     type: string
//  *                     format: date-time
//  *                   availableResolutions:
//  *                     type: array
//  *                     items:
//  *                       type: string
//  *                       enum:
//  *                         - P144
//  *     tags:
//  *       - Videos
//  */
//
// /**
//  * @swagger
//  * /videos:
//  *   post:
//  *     summary: Create a new video entity
//  *     tags:
//  *       - Videos
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/CreateVideoModel'
//  *           example:
//  *             title: "string"
//  *             author: "string"
//  *             availableResolutions:
//  *               - "P144"
//  *     responses:
//  *       '201':
//  *         description: Returns the newly created video
//  *         content:
//  *           text/plain:
//  *             schema:
//  *               $ref: '#/components/schemas/VideoViewModel'
//  *             example:
//  *               id: 0
//  *               title: "string"
//  *               author: "string"
//  *               canBeDownloaded: true
//  *               minAgeRestriction: null
//  *               createdAt: "2023-12-27T19:11:01.653Z"
//  *               publicationDate: "2023-12-27T19:11:01.653Z"
//  *               availableResolutions:
//  *                 - "P144"
//  *       '400':
//  *         description: If the inputModel has incorrect values
//  *         content:
//  *           text/plain:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorModel'
//  */
//
// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     CreateVideoModel:
//  *       type: object
//  *       required:
//  *         - title
//  *         - author
//  *       properties:
//  *         title:
//  *           type: string
//  *           maxLength: 40
//  *           description: The title of the video (maximum length: 40 characters).
//  *         author:
//  *           type: string
//  *           maxLength: 20
//  *           description: The author of the video (maximum length: 20 characters).
//  *         availableResolutions:
//  *           type: array
//  *           description: At least one resolution should be added.
//  *           items:
//  *             $ref: '#/components/schemas/Resolution'
//  *     VideoViewModel:
//  *       type: object
//  *       properties:
//  *         id:
//  *           type: integer
//  *         title:
//  *           type: string
//  *         author:
//  *           type: string
//  *         canBeDownloaded:
//  *           type: boolean
//  *         minAgeRestriction:
//  *           type: integer
//  *           nullable: true
//  *         createdAt:
//  *           type: string
//  *           format: date-time
//  *         publicationDate:
//  *           type: string
//  *           format: date-time
//  *         availableResolutions:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Resolution'
//  *     ErrorModel:
//  *       type: object
//  *       properties:
//  *         errorsMessages:
//  *           type: array
//  *           items:
//  *             type: object
//  *             properties:
//  *               message:
//  *                 type: string
//  *               field:
//  *                 type: string
//  *     Resolution:
//  *       type: string
//  *       enum:
//  *         - P144
//  *         - P240
//  *         - P360
//  *         - P480
//  *         - P720
//  *         - P1080
//  *         - P1440
//  *         - P2160
//  */
//
// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     UpdateVideoModel:
//  *       type: object
//  *       required:
//  *         - title
//  *         - author
//  *       properties:
//  *         title:
//  *           type: string
//  *           maxLength: 40
//  *           description: The title of the video (maximum length: 40 characters).
//  *         author:
//  *           type: string
//  *           maxLength: 20
//  *           description: The author of the video (maximum length: 20 characters).
//  *         availableResolutions:
//  *           type: array
//  *           description: At least one resolution should be added.
//  *           items:
//  *             $ref: '#/components/schemas/Resolution'
//  *     Resolution:
//  *       type: string
//  *       enum:
//  *         - P144
//  *         - P240
//  *         - P360
//  *         - P480
//  *         - P720
//  *         - P1080
//  *         - P1440
//  *         - P2160
//  */
