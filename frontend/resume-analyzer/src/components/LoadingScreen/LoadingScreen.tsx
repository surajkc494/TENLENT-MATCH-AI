import React from 'react';

const LoadingScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="loader"></div>
            <p className="mt-4 text-lg">Loading, please wait...</p>
        </div>
    );
};

export default LoadingScreen;