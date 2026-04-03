const express = require('express')
const router = express.Router()

//roles function
const {ROLE} = require('../utils/Roles')

//importing middleware 
const {authenticate} = require('../middleware/Authenticate')
const {authorize} = require('../middleware/Authorize')

//import controller
const {getTotalIncome,getTotalExpense,getNetBalance,getCategoryBreakdown,getRecentTransaction,getMonthlyTrend} = require('../controllers/Dashboard')

//routes
/**
 * @swagger
 * /api/summary/total-income:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get total income
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Total income calculated.
 */
router.get("/summary/total-income",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getTotalIncome)
/**
 * @swagger
 * /api/summary/total-expense:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get total expense
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Total expense calculated.
 */
router.get("/summary/total-expense",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getTotalExpense)
/**
 * @swagger
 * /api/summary/net-balance:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get net balance (income - expense)
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Net balance calculated.
 */
router.get("/summary/net-balance",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getNetBalance)
/**
 * @swagger
 * /api/summary/category-breakdown:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get expense category breakdown
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Category totals fetched.
 */
router.get("/summary/category-breakdown",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getCategoryBreakdown)
/**
 * @swagger
 * /api/summary/recent-transaction:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *     responses:
 *       200:
 *         description: Recent transactions fetched.
 */
router.get("/summary/recent-transaction",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getRecentTransaction)
/**
 * @swagger
 * /api/summary/monthly-trend:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get monthly income and expense trend
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Monthly trend fetched.
 */
router.get("/summary/monthly-trend",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getMonthlyTrend)

module.exports = router