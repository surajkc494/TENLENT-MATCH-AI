import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export const uploadResume = async (formData: FormData) => {
    try {
        const response = await axios.post(`${API_URL}/resume/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error('Error uploading resume: ' + (axiosError?.response?.data?.message || axiosError?.message || 'Unknown error'));
    }
};

export const analyzeResume = async (resumeData: unknown, jobDescription: string) => {
    try {
        const response = await axios.post(`${API_URL}/evaluation/process`, {
            resumeData,
            jobDescription,
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error('Error analyzing resume: ' + (axiosError?.response?.data?.message || axiosError?.message || 'Unknown error'));
    }
};