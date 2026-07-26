import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-lg font-bold">Resume Analyzer</h1>
                <div className="space-x-4">
                    <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                    <Link to="/upload" className="text-white hover:text-gray-300">Resume Upload</Link>
                    <Link to="/job-description" className="text-white hover:text-gray-300">Job Description Input</Link>
                    <Link to="/analysis-result" className="text-white hover:text-gray-300">Analysis Result</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
