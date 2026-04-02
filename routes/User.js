const express = require('express')
const router = express.Router()

//importing middleware 
const {authenticate} = require('../middleware/Authenticate')
const {authorize} = require('../middleware/Authorize')

//roles function
const {ROLE} = require('../utils/Roles')

//import controller
const {createUser, getUsers,updateUser,deleteUser,login} = require("../controllers/User")


//get all users
router.get("/user",authenticate,authorize([ROLE.ADMIN,ROLE.ANALYST]),getUsers)
//post user
router.post("/user",authenticate,authorize([ROLE.ADMIN]),createUser)
//update user (change role || dectivate user)
router.patch("/user/:id",authenticate,authorize([ROLE.ADMIN]),updateUser)
//soft delete user
router.delete("/user/:id",authenticate,authorize([ROLE.ADMIN]),deleteUser)
//login route (token issue)
router.post("/auth/login",login)


module.exports = router