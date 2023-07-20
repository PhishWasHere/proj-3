import { useMutation } from '@apollo/client';
import { ADD_TASK } from '../../utils/mutations';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Auth from '../../utils/auth';

export default function AddTask() {
    const { id } = useParams();
 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
  
    const [addTask, { data, error }] = useMutation(ADD_TASK);
  
    const handleSubmit = async (e: any) => {
      e.preventDefault();
      try {
        const { data } = await addTask({
          variables: {
            title,
            description,
            dueDate,
            priority,
            project: id, // Replace this with your project ID
            assignee: Auth.getProfile().data._id,
          },
        });
        console.log('data', data);
      } catch (err) {
        console.error(err);
      }
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <textarea
            placeholder="Task Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <textarea
            placeholder="Task Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
          <button type="submit">Create Task</button>
        </form>
      </div>
    );
  };