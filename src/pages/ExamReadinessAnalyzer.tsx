import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const initialAIMessage = `Welcome to the Exam Readiness Analyzer!\n\nTo get started, please enter your exam topic. I will generate 10 MCQ questions to assess your readiness. Answer each question in this chat, and I will check your answers, explain the correct ones, and provide a summary of your performance at the end.`;

const GEMINI_API_KEY = 'AIzaSyDKywCX7-9M-nXIs33qLaEIcir1O3f3Cus';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const ExamReadinessAnalyzer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: initialAIMessage }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<'topic' | 'confirm' | 'quiz' | 'summary'>('topic');
  const [mcqs, setMcqs] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizState, setQuizState] = useState<any[]>([]); // Stores Q/A pairs

  // Helper to call Gemini API
  async function callGemini(prompt: string): Promise<string> {
    const res = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'AI did not return a response.';
  }

  // Step 1: Handle topic input and start quiz
  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { sender: 'user', text: input }]);
    if (step === 'topic') {
      setIsLoading(true);

      // If file, you could extract text here (not implemented)
      const prompt = `Generate 10 multiple-choice questions (with 4 options each, but do NOT include the correct answer or any answer indication) on the topic: '${input}'. Format each as:\nQ: ...\nA) ...\nB) ...\nC) ...\nD) ...`;
      const mcqText = await callGemini(prompt);
      // Parse MCQs (no answers)
      const questions = mcqText
        .split(/Q: /)
        .filter(Boolean)
        .map(q => 'Q: ' + q.trim().replace(/\nAnswer:.*/g, ''));
      setMcqs(questions);
      setStep('confirm');
      setInput('');
      setMessages(msgs => [
        ...msgs,
        { sender: 'ai', text: `Great! I'll prepare 10 MCQ questions on "${input}". Are you ready to start? (Type 'ready' to begin)` }
      ]);
      setIsLoading(false);
      return;
    }
    if (step === 'confirm') {
      if (input.trim().toLowerCase().includes('ready') || input.trim().toLowerCase().includes('yes')) {
        // Immediately show the first question from the already-generated list
        setStep('quiz');
        setCurrent(0);
        // Remove Gemini filler lines from the first question
        let firstQuestion = mcqs[0]
          .replace(/Here are 10 multiple-choice questions.*?(\n|:)/gi, '')
          .replace(/^Okay,?\s*/i, '')
          .replace(/each with 4 options but without any indication of the correct answer\.?/gi, '')
          .replace(/each with 4 answer options but no indication of the correct answer\.?/gi, '')
          .replace(/without revealing the correct answers\.?/gi, '')
          .replace(/without any indication of the correct answer\.?/gi, '')
          .trim();
        setMessages(msgs => [
          ...msgs,
          { sender: 'ai', text: firstQuestion }
        ]);
      } else {
        setMessages(msgs => [
          ...msgs,
          { sender: 'ai', text: `No problem! Just type 'ready' when you want to begin the quiz.` }
        ]);
      }
      setInput('');
      return;
    }
    if (step === 'quiz') {
      // User answers a question
      setIsLoading(true);
      const userAnswer = input.trim();
      setUserAnswers(ans => [...ans, userAnswer]);
      // Check answer with Gemini
      const checkPrompt = `Here is a multiple-choice question and a user's answer. Tell if the answer is correct, explain the correct answer, and provide encouragement or advice. Reply as a tutor in a friendly conversational way.\n${mcqs[current]}\nUser's answer: ${userAnswer}`;
      const feedback = await callGemini(checkPrompt);
      setQuizState(qs => [...qs, { question: mcqs[current], userAnswer, feedback }]);
      setMessages(msgs => [
        ...msgs,
        { sender: 'ai', text: feedback }
      ]);
      if (current < 9 && mcqs[current + 1]) {
        setCurrent(cur => cur + 1);
        // Remove any instance of 'without revealing the correct answers' from the AI reply
        let nextQuestion = mcqs[current + 1].replace(/without revealing the correct answers\.?/gi, '').trim();
        nextQuestion = nextQuestion.replace(/Here are 10 multiple-choice questions about.*:?/gi, '').trim();
        setMessages(msgs => msgs.concat({ sender: 'ai', text: nextQuestion }));
      } else {
        // Quiz finished, get summary
        setStep('summary');
        setMessages(msgs => [...msgs, { sender: 'ai', text: 'Analyzing your answers and preparing your readiness summary...' }]);
        // Wait for state to update before summarizing
        setTimeout(async () => {
          const summaryPrompt = `You are an AI exam readiness coach. Here are the 10 questions, the user's answers, and your feedbacks. Give a summary of the user's strengths, weaknesses, readiness for the topic, and suggest areas for improvement.\n${[...quizState, { question: mcqs[current], userAnswer, feedback }].map((qa, i) => `Q${i + 1}: ${qa.question}\nAnswer: ${qa.userAnswer}\nFeedback: ${qa.feedback}`).join('\n\n')}`;
          const summary = await callGemini(summaryPrompt);
          setMessages(msgs => [...msgs, { sender: 'ai', text: summary }]);
          setIsLoading(false);
        }, 500);
        return;
      }
      setIsLoading(false);
    }
    setInput('');
  };

  const navigate = useNavigate();

  return (
  <motion.div
    className="bg-[#15192a] rounded-2xl shadow-2xl max-w-2xl w-full p-0 sm:p-0 flex flex-col items-center justify-center mx-auto my-24"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="w-full flex flex-col items-center justify-center p-0 sm:p-0">
      <div className="w-full flex items-center gap-3 px-6 pt-6 pb-2">
        <button
          className="group flex items-center focus:outline-none"
          onClick={() => navigate('/home')}
          aria-label="Back to WelcomeScreen"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.2}
            stroke="url(#arrow-gradient)"
            className="w-6 h-6 mr-1 group-hover:brightness-125"
            style={{ display: 'inline-block' }}
          >
            <defs>
              <linearGradient id="arrow-gradient" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a78bfa" />
                <stop offset="1" stopColor="#f472b6" />
              </linearGradient>
            </defs>
            <path stroke="url(#arrow-gradient)" strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-white ml-1">Exam Readiness Analyzer</h2>
      </div>
      <div className="flex flex-col w-full h-[60vh] px-4 pb-4">
        <div className="bg-[#181d2f] p-6 rounded-xl h-full overflow-y-auto mb-4 flex flex-col">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-line ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-[#232946] text-gray-100'}`}
                dangerouslySetInnerHTML={{
                  __html: msg.sender === 'ai'
                    ? msg.text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
                    : msg.text
                }}
              />
            </motion.div>
          ))}
        </div>
        <div className="flex gap-2 mt-auto">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg border border-[#232946] bg-[#232946] text-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
            placeholder={step === 'topic' ? 'Enter your exam topic...' : 'Type your answer...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            disabled={isLoading}
          />
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? '...' : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-4-4m4 4-4 4" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);
};

export default ExamReadinessAnalyzer;
