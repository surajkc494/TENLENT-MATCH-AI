import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import ResumeUpload from './pages/ResumeUpload';
import JobDescriptionInput from './pages/JobDescriptionInput';
import AnalysisResult from './pages/AnalysisResult';
import Navbar from './components/Navbar/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/upload" component={ResumeUpload} />
        <Route path="/resume-upload" exact>
          <Redirect to="/upload" />
        </Route>
        <Route path="/job-description" component={JobDescriptionInput} />
        <Route path="/analysis-result" component={AnalysisResult} />
      </Switch>
    </Router>
  );
};

export default App;
