const mongoose = require("mongoose");
const User = require("./models/User");
require('dotenv').config()

async function seedUsers() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({});

  await User.create([
    {
      user_id: 1,
      name: "Admin User",
      email: "admin@test.com",
      role: "ADMIN",
      isActive: true,
    },
    {
      user_id: 2,
      name: "Analyst User",
      email: "analyst@test.com",
      role: "ANALYST",
      isActive: true,
    },
    {
      user_id: 3,
      name: "Viewer User",
      email: "viewer@test.com",
      role: "VIEWER",
      isActive: true,
    },
  ]);

  console.log("✅ Users seeded");
  process.exit();
}

seedUsers();