import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import WelcomeScreen from './components/WelcomeScreen';
import LandingPage from './pages/index';
import TutorChat from './pages/TutorChat';
import LectureSummarizer from './pages/LectureSummarizer';
import ExamReadinessAnalyzer from './pages/ExamReadinessAnalyzer';
import Writer from './pages/Writer';
import QuestionGenerator from './pages/QuestionGenerator';
import StudyPlanner from './pages/StudyPlanner';

import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Landing page route WITHOUT Layout (no navbar/sidebar) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* All other routes WITH Layout (navbar/sidebar) */}
        <Route element={<Layout />}>
  <Route path="home" element={<WelcomeScreen />} />
  <Route path="tutor/:id" element={<TutorChat />} />
  <Route path="writer/:id" element={<Writer />} />
  <Route path="questions/:id" element={<QuestionGenerator />} />
  <Route path="summarizer/:id" element={<LectureSummarizer />} />
  <Route path="planner" element={<StudyPlanner />} />
  <Route path="exam-readiness" element={<ExamReadinessAnalyzer />} />
          <Route path="home" element={<WelcomeScreen />} />
          <Route path="tutor/:id" element={<TutorChat />} />
          <Route path="writer/:id" element={<Writer />} />
          <Route path="questions/:id" element={<QuestionGenerator />} />
          <Route path="planner" element={<StudyPlanner />} />
          <Route path="exam-readiness" element={<ExamReadinessAnalyzer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;