const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://Saiteja:Saiteja244@cluster0.fnhabke.mongodb.net/?appName=Cluster0"
)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


// Home Route
app.get("/", (req, res) => {
  res.send("User Authentication API Running");
});


// REGISTER USER
app.post("/register", async (req, res) => {

  try {

    const { name, email, password } =
      req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.json({
        message:
          "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({
      message:
        "User Registered Successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
});


// LOGIN USER
app.post("/login", async (req, res) => {

  try {

    const { email, password } =
      req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.json({
        message:
          "User Not Found"
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.json({
        message:
          "Invalid Password"
      });
    }

    const token =
      jwt.sign(
        { id: user._id },
        "mySecretKey"
      );

    res.json({
      message:
        "Login Successful",
      token
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
});

app.listen(5000, () => {
  console.log("Server Running");
});