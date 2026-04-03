const m = require("mongoose");

const RecordSchema = new m.Schema({
  userId: {
    type: Number,
    required: true,
  },
  recordId: {
    type: Number,
    required: true,
    unique:true
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  category: {
    type: String,
    required: false,
    index:true
  },
  date: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    required: false,
    index:true
  },
  isDeleted:{
    type:Boolean,
    required:false,
    default:false
  }
});

module.exports = m.model("Record", RecordSchema);
