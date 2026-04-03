const express = require("express");
const router = express.Router();

//importing middleware
const { authenticate } = require("../middleware/Authenticate");
const { authorize } = require("../middleware/Authorize");

//roles function
const { ROLE } = require("../utils/Roles");

//import controller
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/User");

//get all users
/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [Users]
 *     summary: Get users
 *     description: Returns paginated users. Admin and Analyst only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, ANALYST, VIEWER]
 *         description: Filter users by role.
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status.
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
 *     responses:
 *       200:
 *         description: Users fetched successfully.
 *       400:
 *         description: Invalid query parameters.
 *       401:
 *         description: Missing or invalid token.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Server error.
 */
router.get(
  "/user",
  authenticate,
  authorize([ROLE.ADMIN, ROLE.ANALYST]),
  getUsers,
);
//post user
/**
 * @swagger
 * /api/user:
 *   post:
 *     tags: [Users]
 *     summary: Create user
 *     description: Creates a user and returns a JWT token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [ADMIN, ANALYST, VIEWER]
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Missing or invalid token.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: User already exists or create conflict.
 *       500:
 *         description: Server error.
 */
router.post("/user", authenticate, authorize([ROLE.ADMIN]), createUser);
//update user (change role || dectivate user)
/**
 * @swagger
 * /api/user/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user role or active status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric user_id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, ANALYST, VIEWER]
 *               isActive:
 *                 type: boolean
 *             example:
 *               role: ANALYST
 *               isActive: true
 *     responses:
 *       200:
 *         description: User updated.
 *       400:
 *         description: Invalid user id or body.
 *       401:
 *         description: Missing or invalid token.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.patch("/user/:id", authenticate, authorize([ROLE.ADMIN]), updateUser);
//soft delete user
/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Deactivate user (soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric user_id.
 *     responses:
 *       200:
 *         description: User deactivated successfully.
 *       400:
 *         description: Invalid user id.
 *       401:
 *         description: Missing or invalid token.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.delete("/user/:id", authenticate, authorize([ROLE.ADMIN]), deleteUser);
//login route (token issue)
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login by email
 *     description: Issues a JWT token for an active user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Email is required.
 *       403:
 *         description: User inactive.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.post("/auth/login", login);

module.exports = router;
