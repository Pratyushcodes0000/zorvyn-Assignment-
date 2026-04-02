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
router.post("/records",authenticate,authorize([ROLE.ADMIN]),createRecord)
//get records 
router.get("/records",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getRecords)
//get particular record
router.get("/records/:id",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST,ROLE.VIEWER]),getRecordswithId)
//patch record
router.patch("/records/:id",authenticate,authorize([ROLE.ADMIN]),updateRecords)
//delete records
router.delete("/records/:id",authenticate,authorize([ROLE.ADMIN]),deleteRecords)


module.exports = router