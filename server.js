//jshint esversion:6
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')


app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.set('strictQuery', true)
mongoose.connect("mongodb+srv://admin:admin@cluster0.dycul.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  },
  completedTime: {
    type: Date
  },
  creationTime: {
    type: Date,
    required: true
  }
});

const Task = mongoose.model('Task', taskSchema);

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find({});
  res.send(tasks)
});

app.post('/tasks', async (req, res) => {
  console.log(req.body);  
  const task = new Task({
    task: req.body.task,
    completed: req.body.completed,
    completedTime: req.body.completedTime,
    creationTime: req.body.creationTime
  });
  
  await task.save(function (err) {
    if (err) {
        res.send(err)
    }
  });
    res.send(task)
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  Task.findByIdAndDelete(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ message: 'Task deleted successfully' });
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
