import React, { useState } from 'react';
import axios from 'axios';

const GroupForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
       // console.log('Submitting form with:', { name, description }); // Add logging
        try {
            const response = await axios.post('http://localhost:3000/api/groups/create', {
                name,
                description
            });
            console.log('Group created:', response.data);
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Description:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <button type="submit">Create Group</button>
        </form>
    );
};

export default GroupForm;