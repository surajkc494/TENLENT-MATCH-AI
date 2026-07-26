import React from 'react';
import Navbar from '../components/Navbar/Navbar';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Navbar />
            <h1 className="text-4xl font-bold mt-10">Welcome to the Resume Analyzer</h1>
            <p className="mt-4 text-lg text-center max-w-md">
                Analyze your resume against job descriptions to improve your chances of landing your dream job.
            </p>
        </div>
    );
};

export default Home;