import React from 'react'
import { FaEdit, FaCheckDouble, FaRegTrashAlt } from 'react-icons/fa'

const Task = ({task, index, deleteTask, getSingleTask, setToCompleted }) => {
  return (
    <div className={task.completed ? "task completed" : "task"}>
        <p>
            <b>{index + 1}. </b>
            {task.name}
        </p>
        <div className='task-icons'>
            <FaCheckDouble  color={task.completed ? 'green' : 'black'} onClick={()=>setToCompleted(task)} />
            <FaEdit color='purple' onClick={()=>getSingleTask(task)} />
            <FaRegTrashAlt  color='red' onClick={(id)=>deleteTask(task._id)} />
        </div>
    </div>
  );
}

export default Task