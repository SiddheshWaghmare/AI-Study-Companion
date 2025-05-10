import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, FileText, PenTool, HelpCircle, CalendarCheck2, User } from 'lucide-react';
import useStore from '../store';
import ProfileDropdown from './ProfileDropdown';
import { motion } from 'framer-motion';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const addConversation = useStore(state => state.addConversation);

  // Expose global function for fallback session creation (for LectureSummarizer error recovery)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__CREATE_SUMMARIZER_CONVERSATION__ = () => {
        if (typeof addConversation === 'function') {
          return addConversation('summarizer');
        }
        return '';
      };
    }
    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && window.__CREATE_SUMMARIZER_CONVERSATION__) {
        delete window.__CREATE_SUMMARIZER_CONVERSATION__;
      }
    };
  }, [addConversation]);

  const createConversation = (type: 'tutor' | 'summarizer' | 'writer' | 'questions') => {
    const id = addConversation(type);
    navigate(`/${type}/${id}`);
  };

  const goToPlanner = () => {
    navigate('/planner');
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.10, y: -12, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }
  };

  return (
    <div className="homepage-root flex flex-col items-center justify-center min-h-screen w-full">
      <div className="max-w-2xl w-full mx-auto flex flex-col items-center">
        <h1
          className="text-3xl sm:text-4xl font-extrabold mb-2 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 text-transparent bg-clip-text drop-shadow-lg"
        >
          Your AI-Powered Study Companion
        </h1>
        <motion.p
          className="font-mono font-semibold text-base sm:text-lg mb-6 text-center text-violet-300 tracking-wider drop-shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Choose a section below and start studying.
        </motion.p>
      </div>
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-24 gap-y-16 px-4">
        <motion.div
          className="group bg-pink-700 dark:bg-pink-800 text-white rounded-xl overflow-visible cursor-pointer flex flex-col justify-center items-center min-h-[260px] min-w-[260px] h-full w-full shadow-lg border border-transparent hover:border-violet-400 hover:shadow-2xl hover:brightness-110 hover:ring-4 hover:ring-pink-300/40 transform transition-transform duration-500 ease-in-out transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.7 }}
          whileHover="hover"
          onClick={() => navigate('/exam-readiness')}
        >
          <div className="p-6 h-full flex flex-col transform transition-transform duration-500 ease-in-out" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', width: '100%' }}>
            <div className="flex flex-col items-center mb-4" style={{ width: '100%' }}>
              <div className="bg-pink-500 p-3 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold mt-2 mb-2">Exam Readiness Analyzer</h2>
            </div>
            <p className="" style={{ margin: 0 }}>
              Get personalized feedback on your exam preparedness. Upload your syllabus or past papers and let AI highlight weak areas, suggest targeted practice, and track your progress.
            </p>
          </div>
        </motion.div>
        <motion.div
          className="group bg-green-700 dark:bg-green-800 text-white rounded-xl overflow-visible cursor-pointer flex flex-col justify-center items-center min-h-[260px] min-w-[260px] h-full w-full shadow-lg border border-transparent hover:border-violet-400 hover:shadow-2xl hover:brightness-110 hover:ring-4 hover:ring-green-300/40 transform transition-transform duration-500 ease-in-out transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover="hover"
          onClick={goToPlanner}
        >
          <div 
            className="p-6 h-full flex flex-col transform transition-transform duration-500 ease-in-out" 
            style={{ 
              justifyContent: 'center', 
              alignItems: 'center', 
              textAlign: 'center', 
              height: '100%', 
              width: '100%' 
            }}
          >
            <div 
              className="flex flex-col items-center mb-4" 
              style={{ 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%' 
              }}
            >
              <div className="bg-green-500 p-3 rounded-lg">
                <CalendarCheck2 className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold mt-2 mb-2">AI Study Planner</h2>
            </div>
            <p className="" style={{ margin: 0 }}>
              Generate a personalized, day-by-day study plan with AI. Enter your goals, topics, and exam date to get a smart, actionable schedule.
            </p>
          </div>
        </motion.div>
        <motion.div
          className="group bg-slate-900 dark:bg-slate-800 text-white rounded-xl overflow-visible cursor-pointer flex flex-col justify-center items-center min-h-[260px] min-w-[260px] h-full w-full shadow-lg border border-transparent hover:border-violet-400 hover:shadow-2xl hover:brightness-110 hover:ring-4 hover:ring-blue-300/40 transform transition-transform duration-500 ease-in-out transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover="hover"
          onClick={() => createConversation('tutor')}
        >
          <div 
            className="p-6 h-full flex flex-col transform transition-transform duration-500 ease-in-out" 
            style={{ 
              justifyContent: 'center', 
              alignItems: 'center', 
              textAlign: 'center', 
              height: '100%', 
              width: '100%' 
            }}
          >
            <div 
              className="flex flex-col items-center mb-4" 
              style={{ 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%' 
              }}
            >
              <div className="bg-blue-500 p-3 rounded-lg">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold mt-2 mb-2">Personal Tutor</h2>
            </div>
            <p className="" style={{ margin: 0 }}>
              Your ultimate academic companion. Ask general questions, unravel complex concepts, solve and understand difficult questions.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          className="group bg-purple-900 dark:bg-purple-800 text-white rounded-xl overflow-visible cursor-pointer flex flex-col justify-center items-center min-h-[260px] min-w-[260px] h-full w-full shadow-lg border border-transparent hover:border-violet-400 hover:shadow-2xl hover:brightness-110 hover:ring-4 hover:ring-purple-300/40 transform transition-transform duration-500 ease-in-out transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover="hover"
          onClick={() => createConversation('summarizer')}
        >
          <div 
            className="p-6 h-full flex flex-col transform transition-transform duration-500 ease-in-out" 
            style={{ 
              justifyContent: 'center', 
              alignItems: 'center', 
              textAlign: 'center', 
              height: '100%', 
              width: '100%' 
            }}
          >
            <div 
              className="flex flex-col items-center mb-4" 
              style={{ 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%' 
              }}
            >
              <div className="bg-purple-500 p-3 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold mt-2 mb-2">Lecture Summarizer</h2>
            </div>
            <p className="" style={{ margin: 0 }}>
              Master lecture material effortlessly. Your key to comprehensive understanding. Get detailed insights saving you time while ensuring you grasp the essentials.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          className="group bg-orange-800 dark:bg-orange-700 text-white rounded-xl overflow-visible cursor-pointer flex flex-col justify-center items-center min-h-[260px] min-w-[260px] h-full w-full shadow-lg border border-transparent hover:border-violet-400 hover:shadow-2xl hover:brightness-110 hover:ring-4 hover:ring-orange-300/40 transform transition-transform duration-500 ease-in-out transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.5 }}
          whileHover="hover"
          onClick={() => createConversation('writer')}
        >
          <div 
            className="p-6 h-full flex flex-col transform transition-transform duration-500 ease-in-out" 
            style={{ 
              justifyContent: 'center', 
              alignItems: 'center', 
              textAlign: 'center', 
              height: '100%', 
              width: '100%' 
            }}
          >
            <div 
              className="flex flex-col items-center mb-4" 
              style={{ 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%' 
              }}
            >
              <div className="bg-orange-500 p-3 rounded-lg">
                <PenTool className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold mt-2 mb-2">Writer</h2>
            </div>
            <p className="" style={{ margin: 0 }}>
              Generate essays, papers, and other written content with proper structure and citations. Perfect for academic writing assistance.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          className="group bg-pink-800 dark:bg-pink-700 text-white rounded-xl overflow-visible cursor-pointer flex flex-col justify-center items-center min-h-[260px] min-w-[260px] h-full w-full shadow-lg border border-transparent hover:border-violet-400 hover:shadow-2xl hover:brightness-110 hover:ring-4 hover:ring-pink-300/40 transform transition-transform duration-500 ease-in-out transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.6 }}
          whileHover="hover"
          onClick={() => createConversation('questions')}
        >
          <div 
            className="p-6 h-full flex flex-col transform transition-transform duration-500 ease-in-out" 
            style={{ 
              justifyContent: 'center', 
              alignItems: 'center', 
              textAlign: 'center', 
              height: '100%', 
              width: '100%' 
            }}
          >
            <div 
              className="flex flex-col items-center mb-4" 
              style={{ 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%' 
              }}
            >
              <div className="bg-pink-500 p-3 rounded-lg">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold mt-2 mb-2">Questions Generator</h2>
            </div>
            <p className="" style={{ margin: 0 }}>
              Create practice questions from your study materials. Test your knowledge and prepare for exams with customized quizzes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;