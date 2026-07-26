import React from 'react';
import UploadCard from '../components/UploadCard/UploadCard';

const ResumeUpload: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Upload Your Resume</h1>
            <UploadCard />
        </div>
    );
};

export default ResumeUpload;