import React, { useState } from 'react';

const JobDescriptionForm: React.FC<{ onSubmit: (description: string) => void }> = ({ onSubmit }) => {
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(description);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col p-4 border rounded shadow-md">
            <label htmlFor="job-description" className="mb-2 text-lg font-semibold">Job Description</label>
            <textarea
                id="job-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="p-2 border rounded mb-4"
                placeholder="Enter the job description here..."
                required
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Submit
            </button>
        </form>
    );
};

export default JobDescriptionForm;