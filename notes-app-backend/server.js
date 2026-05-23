const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Note = require("./models/Note");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://Saiteja:Saiteja244@cluster0.fnhabke.mongodb.net/?appName=Cluster0"
)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


// HOME
app.get("/", (req, res) => {
  res.send("Notes API Running");
});


// REGISTER
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
        "User Registered"
    });

  } catch (error) {

    res.json({
      message: error.message
    });
  }
});


// LOGIN
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
      token
    });

  } catch (error) {

    res.json({
      message: error.message
    });
  }
});


// CREATE NOTE
app.post("/notes", auth,
async (req, res) => {

  try {

    const note = new Note({
      title: req.body.title,
      content:
        req.body.content,
      userId: req.user.id
    });

    await note.save();

    res.json(note);

  } catch (error) {

    res.json({
      message: error.message
    });
  }
});


// GET NOTES
app.get("/notes", auth,
async (req, res) => {

  const notes =
    await Note.find({
      userId: req.user.id
    });

  res.json(notes);
});


// UPDATE NOTE
app.put("/notes/:id",
auth,
async (req, res) => {

  const updatedNote =
    await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

  res.json(updatedNote);
});


// DELETE NOTE
app.delete("/notes/:id",
auth,
async (req, res) => {

  await Note.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message:
      "Note Deleted"
  });
});

app.listen(5000, () => {
  console.log("Server Running");
});