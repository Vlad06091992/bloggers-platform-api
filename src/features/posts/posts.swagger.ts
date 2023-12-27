//endpoints

/**
 * @swagger
 * components:
 *   schemas:
 *     PostResponseModel:
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
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               content:
 *                 type: string
 *               blogId:
 *                 type: string
 *               blogName:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 */

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
 *         schema:
 *           $ref: '#/components/schemas/PostResponseModel'
 *       '404':
 *         description: Not Found
 *         content:
 *           text/plain:
 *             example:
 *               errorMessage: "Posts not found"
 *               errorCode: 404
 *           schema:
 *             type: object
 *             properties:
 *               errorMessage:
 *                 type: string
 *               errorCode:
 *                 type: number
 *                 example: 404
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
 *     CreateNewBlog:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 15
 *         description:
 *           type: string
 *           maxLength: 500
 *         websiteUrl:
 *           type: string
 *           pattern: '^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'
 *       required:
 *         - name
 *         - description
 *         - websiteUrl
 *       example:
 *         name: "Example Blog"
 *         description: "This is a sample blog."
 *         websiteUrl: "https://example.com"
 *     BlogViewModel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         websiteUrl:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         isMembership:
 *           type: boolean
 *           description: True if the user has an active membership subscription to the blog.
 *       required:
 *         - id
 *         - name
 *         - description
 *         - websiteUrl
 */




/**
 * @swagger
 * components:
 *   schemas:
 *     PostResponseModel:
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
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               content:
 *                 type: string
 *               blogId:
 *                 type: string
 *               blogName:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 */