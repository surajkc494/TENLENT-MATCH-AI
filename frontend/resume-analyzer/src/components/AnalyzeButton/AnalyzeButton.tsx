import React from 'react';

interface AnalyzeButtonProps {
    onClick: () => void;
    loading: boolean;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ onClick, loading }) => {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition duration-200`}
        >
            {loading ? 'Analyzing...' : 'Analyze'}
        </button>
    );
};

export default AnalyzeButton;