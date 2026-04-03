const Record = require("../models/Record");
const User = require("../models/User");
const { generateId } = require("../utils/generateId");

exports.createRecord = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { amount, type, category, date, notes } = req.body;
    const parsedamount = parseInt(amount);

    if (!parsedamount || !type || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    //validating amount
    if (isNaN(parsedamount) || parsedamount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative or zero",
      });
    }

    //type normalization
    const normType = type.toLowerCase();

    //checking type
    const allowedType = Record.schema.path("type").enumValues;
    if (type && !allowedType.includes(normType)) {
      return res.status(400).json({
        success: false,
        message: "wrong transcaction type",
      });
    }

    //validating date
    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }
    //category validation
    if (typeof category !== "string" || category.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    //security check if a user exists or not
    const user = await User.findOne({ user_id: user_id });
    if (!user || !user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User not allowed",
      });
    }

    const Rec = {
      userId: user_id,
      recordId: generateId(),
      amount: parsedamount,
      type: normType,
      category,
      date: parsedDate,
      notes,
    };
    try {
      const r = await Record.create(Rec);
      return res.status(201).json({
        success: true,
        data: r,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error saving record to db",
        error: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { type, category, startDate, endDate } = req.query;
    const { search } = req.query;
    let filter = {
      isDeleted: false,
    };
    const skip = (page - 1) * limit;

    // Rolebased filtering
    if (req.user.role !== "ADMIN") {
      filter.userId = req.user.user_id;
    }
    // Type filter
    if (type) {
      filter.type = type.toLowerCase();
    }
    // Category filter
    if (category) {
      filter.category = category;
    }
    // Date filter
    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }
    //serach filter
    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    //sorting date newest to oldest
    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    //counting document for frontend
    const total = await Record.countDocuments(filter);

    return res.status(200).json({
      success: true,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch records",
      error: error.message,
    });
  }
};

exports.getRecordswithId = async (req, res) => {
  try {
    const recordId = parseInt(req.params.id);
    const userId = req.user.user_id;
    const user_role = req.user.role;

    // Validating recordId
    if (isNaN(recordId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record ID",
      });
    }

    //fetching the record
    const r = await Record.findOne({ recordId: recordId });

    if (!r) {
      return res.status(404).json({
        success: false,
        message: "No record with the Id found",
      });
    }

    //checking if user owns it or user is admin
    if (user_role !== "ADMIN" && r.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have valid permissions or you don't own the record",
      });
    }

    return res.status(200).json({
      success: true,
      record: r,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch record",
      error: error.message,
    });
  }
};

exports.updateRecords = async (req, res) => {
  try {
    const recordId = parseInt(req.params.id);
    const userId = req.user.user_id;
    const userRole = req.user.role;
    const { amount, type, category, date, notes } = req.body;
    const parsedAmount = parseInt(amount);

    //checking recordId
    if (isNaN(recordId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record ID",
      });
    }

    //fetching record
    const record = await Record.findOne({ recordId: recordId });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    //cheking role and ownership
    if (userRole !== "ADMIN" && record.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    //updates
    let updateData = {};

    if (amount !== undefined) {
      if (typeof parsedAmount !== "number" || parsedAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid amount",
        });
      }
      updateData.amount = parsedAmount;
    }

    if (type !== undefined) {
      const normalizedType = type.toLowerCase();
      const allowedTypes = Record.schema.path("type").enumValues;

      if (!allowedTypes.includes(normalizedType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid type",
        });
      }

      updateData.type = normalizedType;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (date !== undefined) {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate)) {
        return res.status(400).json({
          success: false,
          message: "Invalid date",
        });
      }

      updateData.date = parsedDate;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    //$set because we don't want to replace doc
    const updatedRecord = await Record.findOneAndUpdate(
      { recordId },
      { $set: updateData },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      data: updatedRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update record",
      error: error.message,
    });
  }
};

exports.deleteRecords = async (req, res) => {
  try {
    const recordId = parseInt(req.params.id);
    const userId = req.user.user_id;
    const userRole = req.user.role;

    if (isNaN(recordId) || !recordId) {
      return res.status(400).json({
        success: false,
        message: "Invalid record ID",
      });
    }

    //fetch record
    const r = await Record.findOne({ recordId: recordId });

    if (!r) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    if (userRole !== "ADMIN" && r.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You dont have permission to delete this record",
      });
    }
    if (r.isDeleted == false) {
      r.isDeleted = !r.isDeleted;
      await r.save();
      return res.status(200).json({
        success: true,
        message: "Doc soft deleted successfully",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Doc already soft deleted successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete record",
      error: error.message,
    });
  }
};
