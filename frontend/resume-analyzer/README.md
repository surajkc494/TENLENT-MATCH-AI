# Resume Analyzer

## Overview
The Resume Analyzer is a web application designed to help users analyze their resumes against job descriptions. It provides insights into match scores, skill comparisons, and suggestions for improving resumes.

## Features
- **Home Page**: A landing page that introduces the application.
- **Resume Upload**: Users can upload their resumes for analysis.
- **Job Description Input**: Users can input job descriptions to compare against their resumes.
- **Analysis Result**: Displays the results of the analysis, including match scores and skill comparisons.

## Components
- **Navbar**: Navigation links to different pages.
- **Upload Card**: Interface for uploading resumes.
- **Job Description Form**: Form for entering job descriptions.
- **Analyze Button**: Triggers the analysis process.
- **Loading Screen**: Displays a loading indicator during analysis.
- **Match Score Card**: Shows the match score between the resume and job description.
- **Skill Comparison Table**: Compares skills from the resume and job description.
- **Missing Skills Card**: Highlights skills that are missing from the resume.
- **AI Explanation Card**: Provides explanations from the AI regarding the analysis.
- **Resume Suggestions Card**: Offers suggestions for improving the resume.

## Technologies Used
- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: Promise-based HTTP client for making API requests.
- **TypeScript**: Superset of JavaScript that adds static types.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd resume-analyzer
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## API Integration
The application connects to APIs for resume analysis and job description processing. Ensure that the API endpoints are correctly configured in the `src/services/api.ts` file.

## Responsive Design
The application is built with responsive design principles, ensuring a seamless experience across devices.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.