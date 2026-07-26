import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

export const uploadResume = async (formData: FormData) => {
    try {
        // Let the browser add the multipart boundary to the Content-Type header.
        const response = await axios.post(`${API_BASE_URL}/resume/upload`, formData);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError?.response?.data?.message || axiosError?.message || 'Unknown error';
        throw new Error(`Error uploading resume: ${message}`);
    }
};

export const analyzeResume = async (resumeData: unknown, jobDescription: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/evaluation/process`, {
            resumeData,
            jobDescription,
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError?.response?.data?.message || axiosError?.message || 'Unknown error';
        throw new Error(`Error analyzing resume: ${message}`);
    }
};
