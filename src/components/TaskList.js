import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { URL } from '../App';
import TaskForm from './TaskForm';
import Task from './Task';
import loadingImg from '../assets/loader.gif'

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", completed: false });
    const [isEditing, setIsEditing] = useState(false);
    const [taskID, setTaskID] = useState("");
    const {name} = formData;

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    };

    const getTasks = async ()=> {
        setIsLoading(true);
        try {
            //destructure "data" from repsonse object, set tasks state to present recieved data
            const {data} = await axios.get(`${URL}/api/tasks`)
            setTasks(data);
            setIsLoading(false)
        } catch (error) {
            toast.error(error.message);
            setIsLoading(false);
        }
    }

    const getSingleTask = async (task) => {
        setFormData({ name: task.name, completed: false })        
        setTaskID(task._id);
        setIsEditing(true);
    };

    const updateTask = async (e)=>{
        e.preventDefault();
        if (name === "") {
            return toast.error("Input field cannot be empty.");
            
        }
        try {
                await axios.put(`${URL}/api/tasks/${taskID}`, formData)
                console.log("update Task is receiving form data")
                setFormData({ ...formData, name: "" })
                setIsEditing(false)
                getTasks()
            } catch (error) {
                toast.error(error.message);
            }
    };

    const setToCompleted = async (task)=>{
       
        const newFormData = {
            name: task.name,
            completed: task.completed
        }
        if (newFormData.completed) {
            newFormData.completed = false
        } else { 
            newFormData.completed = true
        }

        try {
            await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
            getTasks();
        } catch (error) {
            toast.error(error.message)
        }
    };

    useEffect(()=> {
        getTasks();
    }, [])

    const createTask = async(e) => {
        e.preventDefault();
        if (name=== "") {
            return toast.error("Input field cannot be empty");
        }
        try {
            await axios.post(`${URL}/api/tasks`, formData );
            toast.success("Task added")
            setFormData({...formData, name: ""})
            getTasks();
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${URL}/api/tasks/${id}`);
            getTasks();
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        const cTask = tasks.filter((task)=> {
            return task.completed === true
        })
        setCompletedTasks(cTask)
    }, [tasks])


  return (
    <div>
        <h3>Task Manager</h3>
        <TaskForm name={name} 
            handleInputChange={handleInputChange} 
            createTask={createTask}
            isEditing={isEditing}
            updateTask={updateTask}
        />
        {tasks.length > 0 && (
            <div className='--flex-between --pb'>
            <p>
                <b>All Tasks: </b> {tasks.length}
            </p>
            <p>
                <b>Completed Tasks: </b> {completedTasks.length}
            </p>
        </div>
        )}
        
        <hr />
        {
            isLoading && (
                <div className='--.flex-center'>
                    <img src={loadingImg} alt="loading..." />
                </div>
            )
        }
        {
            !isLoading && tasks.length === 0 ? (
                <p>No tasks have been added!</p>
            ) : (
                <>
                {tasks.map((task, index)=> {
                    return (
                        <Task 
                        key={task._id} 
                        task={task} 
                        index={index} 
                        deleteTask={deleteTask}
                        getSingleTask={getSingleTask} 
                        setToCompleted={setToCompleted}                        />
                    )
                })}
                </>
            )
        }
    </div>
  )
}

export default TaskList