const express = require('express')
const router = express.Router()

//roles function
const {ROLE} = require('../utils/Roles')

//importing middleware 
const {authenticate} = require('../middleware/Authenticate')
const {authorize} = require('../middleware/Authorize')

//import controller
const {createRecord,getRecords,getRecordswithId,updateRecords,deleteRecords} = require('../controllers/Records')


//routes
//post a record 
/**
 * @swagger
 * /api/records:
 *   post:
 *     tags: [Records]
 *     summary: Create record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Record created.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Missing or invalid token.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Server error.
 */
router.post("/records",authenticate,authorize([ROLE.ADMIN]),createRecord)
//get records 
/**
 * @swagger
 * /api/records:
 *   get:
 *     tags: [Records]
 *     summary: Get records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Text search in category/notes.
 *     responses:
 *       200:
 *         description: Records fetched.
 *       401:
 *         description: Missing or invalid token.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Server error.
 */
router.get("/records",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getRecords)
//get particular record
/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     tags: [Records]
 *     summary: Get single record by recordId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Record fetched.
 *       400:
 *         description: Invalid record id.
 *       401:
 *         description: Missing or invalid token.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Server error.
 */
router.get("/records/:id",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getRecordswithId)
//patch record
/**
 * @swagger
 * /api/records/{id}:
 *   patch:
 *     tags: [Records]
 *     summary: Update record by recordId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated.
 *       400:
 *         description: Invalid record id or payload.
 *       401:
 *         description: Missing or invalid token.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Server error.
 */
router.patch("/records/:id",authenticate,authorize([ROLE.ADMIN]),updateRecords)
//delete records
/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     tags: [Records]
 *     summary: Soft delete record by recordId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Record soft deleted.
 *       400:
 *         description: Invalid record id.
 *       401:
 *         description: Missing or invalid token.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Server error.
 */
router.delete("/records/:id",authenticate,authorize([ROLE.ADMIN]),deleteRecords)


module.exports = router