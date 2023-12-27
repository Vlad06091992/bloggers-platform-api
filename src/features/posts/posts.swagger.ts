/**
 * @openapi
 * /posts:
 *   get:
 *     summary: Returns all posts
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         description: Number of portions that should be returned.
 *         schema:
 *           type: integer
 *           format: int32
 *         default: 1
 *         example: 1
 *         required: false
 *       - in: query
 *         name: pageSize
 *         description: Portions size that should be returned.
 *         schema:
 *           type: integer
 *           format: int32
 *         default: 10
 *         example: 10
 *         required: false
 *       - in: query
 *         name: sortBy
 *         description: Field by which sorting occurs.
 *         schema:
 *           type: string
 *         default: createdAt
 *         example: createdAt
 *         required: false
 *       - in: query
 *         name: sortDirection
 *         description: Sorting direction.
 *         schema:
 *           type: string
 *         default: desc
 *         example: desc
 *         enum:
 *           - asc
 *           - desc
 *         required: false
 *     description: Returns all posts
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           text/plain:
 *             example:
 *               pagesCount: 0
 *               page: 0
 *               pageSize: 0
 *               totalCount: 0
 *               items:
 *                 - id: "string"
 *                   title: "string"
 *                   shortDescription: "string"
 *                   content: "string"
 *                   blogId: "string"
 *                   blogName: "string"
 *                   createdAt: "2023-12-27T16:48:20.678Z"
 *             schema:
 *              $ref: '#/components/schemas/PostsResponseModel'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PostsgitResponseModel:
 *       type: object
 *       properties:
 *         pagesCount:
 *           type: number
 *         page:
 *           type: number
 *         pageSize:
 *           type: number
 *         totalCount:
 *           type: number
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PostViewModel'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FieldError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         field:
 *           type: string
 *
 *     APIErrorResult:
 *       type: object
 *       properties:
 *         errorsMessages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FieldError'
 *     PostCreateModel:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 15
 *         shortDescription:
 *           type: string
 *           maxLength: 500
 *         content:
 *           type: string
 *           maxLength: 5000
 *       required:
 *         - title
 *         - shortDescription
 *         - content
 *       example:
 *         title: "New Post"
 *         shortDescription: "A short description for the new post."
 *         content: "The content of the new post."
 *     PostViewModel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         shortDescription:
 *           type: string
 *         content:
 *           type: string
 *         blogId:
 *           type: string
 *         blogName:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "string"
 *         title: "string"
 *         shortDescription: "string"
 *         content: "string"
 *         blogId: "string"
 *         blogName: "string"
 *         createdAt: "2023-12-27T16:48:20.678Z"
 */
