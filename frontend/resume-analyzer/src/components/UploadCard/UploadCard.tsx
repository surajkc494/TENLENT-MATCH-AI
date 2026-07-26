import React, { useState } from 'react';
import { uploadResume } from '../../services/api';
import { useAnalysis } from '../../context/AnalysisContext';

const UploadCard: React.FC = () => {
    const { setResume, setResumeData } = useAnalysis();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            return;
        }

        setIsUploading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await uploadResume(formData);
            setResume(file);
            // `uploadResume` returns the parsed API envelope body, so store the parsedData from response.data.
            setResumeData(response?.data?.parsedData ?? response?.data);
            setMessage(`Upload successful: ${response?.message || 'Resume parsed'}`);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
                onClick={handleUpload}
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
                disabled={!file || isUploading}
            >
                {isUploading ? 'Uploading...' : 'Upload Resume'}
            </button>
            {message ? <p className="mt-4 text-sm text-gray-700">{message}</p> : null}
        </div>
    );
};

export default UploadCard;
