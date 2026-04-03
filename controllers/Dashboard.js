const Record = require("../models/Record");
const User = require("../models/User");

exports.getTotalIncome = async (req, res) => {
  try {
    let baseFilter = {
      isDeleted: false,
    };

    if (req.user.role !== "ADMIN") {
      baseFilter.userId = req.user.user_id;
    }

    const { startDate, endDate } = req.query;

    if (startDate || endDate) {
      baseFilter.date = {};

      if (startDate) {
        baseFilter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        baseFilter.date.$lte = new Date(endDate);
      }
    }

    const result = await Record.aggregate([
      { $match: { ...baseFilter, type: "income" } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);

    const totalIncome = result[0]?.totalIncome || 0;

    return res.status(200).json({
      success: true,
      totalIncome,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to calculate total income",
      error: error.message,
    });
  }
};

exports.getTotalExpense = async (req, res) => {
  try {
    let baseFilter = {
      isDeleted: false,
    };

    if (req.user.role !== "ADMIN") {
      baseFilter.userId = req.user.user_id;
    }

    const { startDate, endDate } = req.query;

    if (startDate || endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({
          success: false,
          message: "startDate cannot be greater than endDate",
        });
      }

      baseFilter.date = {};

      if (startDate) {
        const sDate = new Date(startDate);
        if (isNaN(sDate)) {
          return res.status(400).json({
            success: false,
            message: "Invalid startDate",
          });
        }
        baseFilter.date.$gte = sDate;
      }

      if (endDate) {
        const eDate = new Date(endDate);
        if (isNaN(eDate)) {
          return res.status(400).json({
            success: false,
            message: "Invalid EndDate",
          });
        }
        baseFilter.date.$lte = eDate;
      }
    }

    const result = await Record.aggregate([
      { $match: { ...baseFilter, type: "expense" } },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    const totalExpense = result[0]?.totalExpense || 0;

    return res.status(200).json({
      success: true,
      totalExpense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to calculate total expense",
      error: error.message,
    });
  }
};

exports.getNetBalance = async (req, res) => {
  try {
    let baseFilter = {
      isDeleted: false,
    };

    if (req.user.role !== "ADMIN") {
      baseFilter.userId = req.user.user_id;
    }

    const { startDate, endDate } = req.query;

    if (startDate || endDate) {
      baseFilter.date = {};

      let sDate, eDate;

      if (startDate) {
        sDate = new Date(startDate);
        if (isNaN(sDate)) {
          return res.status(400).json({
            success: false,
            message: "Invalid startDate",
          });
        }
        baseFilter.date.$gte = sDate;
      }

      if (endDate) {
        eDate = new Date(endDate);
        if (isNaN(eDate)) {
          return res.status(400).json({
            success: false,
            message: "Invalid endDate",
          });
        }
        baseFilter.date.$lte = eDate;
      }

      if (sDate && eDate && sDate > eDate) {
        return res.status(400).json({
          success: false,
          message: "startDate cannot be greater than endDate",
        });
      }
    }

    const result = await Record.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let income = 0,
      expense = 0;

    result.forEach((r) => {
      if (r._id === "income") income = r.total;
      if (r._id === "expense") expense = r.total;
    });

    const net = income - expense;

    return res.status(200).json({
      success: true,
      income,
      expense,
      net,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to calculate net balance",
      error: error.message,
    });
  }
};

exports.getCategoryBreakdown = async (req, res) => {
  try {
    let baseFilter = {
      isDeleted: false,
      type: "expense",
    };

    if (req.user.role !== "ADMIN") {
      baseFilter.userId = req.user.user_id;
    }

    const { startDate, endDate } = req.query;

    if (startDate || endDate) {
      baseFilter.date = {};

      let sDate, eDate;

      if (startDate) {
        sDate = new Date(startDate);
        if (isNaN(sDate)) {
          return res.status(400).json({
            success: false,
            message: "Invalid startDate",
          });
        }
        baseFilter.date.$gte = sDate;
      }

      if (endDate) {
        eDate = new Date(endDate);
        if (isNaN(eDate)) {
          return res.status(400).json({
            success: false,
            message: "Invalid endDate",
          });
        }
        baseFilter.date.$lte = eDate;
      }

      if (sDate && eDate && sDate > eDate) {
        return res.status(400).json({
          success: false,
          message: "startDate cannot be greater than endDate",
        });
      }
    }

    const result = await Record.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    //making the output dashboard ready
    const formattedOutput = result.map((r) => ({
      category: r._id || "Uncategorized",
      total: r.total,
    }));

    return res.status(200).json({
      success: true,
      data: formattedOutput,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to calculate category breakdown",
      error: error.message,
    });
  }
};

exports.getRecentTransaction = async (req, res) => {
  try {
    const { limit } = req.query;
    //maximum 50
    const parsedLimit = Math.min(parseInt(limit) || 5, 50);
    if (parsedLimit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Limit must be greater than 0",
      });
    }
    let baseFilter = {
      isDeleted: false,
    };

    if (req.user.role !== "ADMIN") {
      baseFilter.userId = req.user.user_id;
    }

    const records = await Record.find(baseFilter)
      .sort({ date: -1 })
      .limit(parsedLimit)
      .select("recordId amount type category date notes");

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent transactions",
      error: error.message,
    });
  }
};

exports.getMonthlyTrend = async (req, res) => {
  try {
    let baseFilter = {
      isDeleted: false,
    };

    if (req.user.role !== "ADMIN") {
      baseFilter.userId = req.user.user_id;
    }

    const { startDate, endDate } = req.query;

    if (startDate || endDate) {
      baseFilter.date = {};

      let sDate, eDate;

      if (startDate) {
        sDate = new Date(startDate);
        if (isNaN(sDate)) {
          return res.status(400).json({
            success: false,
            message: "Invalid startDate",
          });
        }
        baseFilter.date.$gte = sDate;
      }

      if (endDate) {
        eDate = new Date(endDate);
        if (isNaN(eDate)) {
          return res.status(400).json({
            success: false,
            message: "Invalid endDate",
          });
        }
        baseFilter.date.$lte = eDate;
      }

      if (sDate && eDate && sDate > eDate) {
        return res.status(400).json({
          success: false,
          message: "startDate cannot be greater than endDate",
        });
      }
    }

    const result = await Record.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyMap = {};

    result.forEach((r) => {
      const { year, month, type } = r._id;
      const key = `${year}-${month}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          year,
          month,
          income: 0,
          expense: 0,
        };
      }

      monthlyMap[key][type] = r.total;
    });

    const formatted = Object.values(monthlyMap).sort((a, b) => {
      if (a.year === b.year) return a.month - b.month;
      return a.year - b.year;
    });

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch monthly trend",
      error: error.message,
    });
  }
};
