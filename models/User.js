const m = require("mongoose");

const User_Schema = new m.Schema({
  user_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  role:{
    type:String,
    enum:["VIEWER","ANALYST","ADMIN"],
    require:true,
    default:"VIEWER"
  },
  isActive:{
    type:Boolean,
    require:true,
    default:true
  }
});

module.exports = m.model("User", User_Schema);
