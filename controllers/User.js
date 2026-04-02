const User = require("../models/User");
const { validate } = require("deep-email-validator");
const { generateId } = require("../utils/generateId");
const jwt = require("jsonwebtoken");
const key = process.env.KEY;

exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) {
      return res.status(400).status({
        success: false,
        message: "Empty name or email field",
      });
    }
    //verifying email
    const isValid = await validate(email);
    if (!isValid.valid) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email",
      });
    }
    //check role
    const allowedRoles = User.schema.path("role").enumValues;
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    let user = await User.findOne({ email: email });
    if (user) {
      return res.json({
        message: "user already exist",
      });
    }
    const id = generateId();
    user = {
      user_id: id,
      name: name,
      email: email,
      role: role,
    };

    try {
      await User.create(user);
    } catch (error) {
      return res.status(409).json({
        success: false,
        message: "Error creating user",
      });
    }

    const token = jwt.sign(user, key, {
      expiresIn: "168h",
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let filter = {
      isActive: true,
    };

    if (role) {
      //check if abything other than the provoded values are sent
      const allowedRoles = User.schema.path("role").enumValues;

      if (role && !allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }

      filter.role = role;
    }

    if (typeof isActive !== "undefined") {
      filter.isActive = isActive === "true";
    }

    //fetching user with basic pagination and limit
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = parseInt(req.params.id);
    const { role, isActive } = req.body;

    let updateFields = {};

    //check if role is valid
    if (role) {
      const allowedRoles = User.schema.path("role").enumValues;
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }
      updateFields.role = role;
    }

    //check if is active present anf is boolean
    if (typeof isActive !== "undefined") {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be a boolean",
        });
      }
      updateFields.isActive = isActive;
    }
    //check if the update fields list is non empty
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    //real update portion
    // $set beacuse we dont want to override whole doc
    //new -> return updated doc
    // runValidators -> enforce schema rules
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isActive: false } }, //soft delete not deleting record
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User is inactive",
      });
    }
    
    const payload = {
      user_id:user.user_id,
      name:user.name,
      email:user.email,
      role:user.role
    }

    const token = jwt.sign(payload,process.env.KEY,{
      expiresIn:"1d"
    })

    return res.status(200).json({
      success:true,
      token
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
