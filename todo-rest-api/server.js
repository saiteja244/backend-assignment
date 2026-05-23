const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Task = require("./models/Task");

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
  res.send("Todo API Running");
});


// ADD TASK
app.post("/tasks", async (req, res) => {

  try {

    const task = new Task({
      title: req.body.title
    });

    await task.save();

    res.json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
});


// GET ALL TASKS
app.get("/tasks", async (req, res) => {

  try {

    const tasks = await Task.find();

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
});


// UPDATE TASK
app.put("/tasks/:id", async (req, res) => {

  try {

    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedTask);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
});


// DELETE TASK
app.delete("/tasks/:id", async (req, res) => {

  try {

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task Deleted"
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