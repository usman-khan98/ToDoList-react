import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function App() {

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  async function fetchData() {
    const result = await axios.get('/tasks');
      if (result.data.length > 0) {
        console.log(result.data);
        setTasks(result.data);
      }
  }
  
  useEffect(() => {
    fetchData()
  }, []);


  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { task, completed: false, completedTime: null, creationTime: Date.now() };
    console.log(newTask);
    const query = await axios.post('/tasks', newTask, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log(query.data);
    setTasks((prevTasks) => {
      return [...prevTasks, newTask];
    });
    setTask("");
    window.location.reload(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleDelete = async (i) => {
    const newTasks = [...tasks];
    console.log(newTasks[i]);
    newTasks[i].completed = true;
    newTasks[i].completedTime = Date.now();
    await axios.delete(`/tasks/${newTasks[i]._id}`);
    window.location.reload(false);
  };




  return (
    <div className='container-sm'>
      <div className="background">
        <div className="transbox">
          <div className="menu-icon">
            <MenuIcon fontSize='large' className='m-icon'/>
          </div>
          <p>To do List</p>
          <div className="expand-icon">
            <ExpandMoreIcon fontSize='small' />
          </div>
        </div>
      </div>
      <div className="list-group list">
        {tasks.map((t, i) => (
          <li key ={i} className="list-group-item list-group-item-action">
            <label className="control control-checkbox">
                {t.task}
              <input type="checkbox" name='check' />
              <div className="control_indicator"></div>
              <DragIndicatorIcon fontSize='medium' onClick={() => handleDelete(i)} style={{ position: 'absolute', left: '95%' }} />
            </label>
          </li>
        ))}

        <div className="list-group-item list-group-item-action addTask">
          <TextField id="standard-basic" label="Add New Task" variant="standard" type="text" value={task} onChange={handleChange} onKeyDown={handleKeyDown} />
          <Button variant="contained" color='success' onClick={handleSubmit} startIcon={<AddIcon />}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
