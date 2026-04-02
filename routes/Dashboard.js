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
router.get("/summary/total-income",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getTotalIncome)
router.get("/summary/total-expense",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getTotalExpense)
router.get("/summary/net-balance",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getNetBalance)
router.get("/summary/category-breakdown",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getCategoryBreakdown)
router.get("/summary/recent-transaction",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getRecentTransaction)
router.get("/summary/monthly-trend",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getMonthlyTrend)

module.exports = router