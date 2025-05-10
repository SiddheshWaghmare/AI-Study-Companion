import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { Button } from '../components/ui/Button';
import useStore from '../store';
import { generateQuestions } from '../utils/api';
import { jsPDF } from 'jspdf';
import { handleFileUpload } from '../utils/fileHandler';

const QuestionGenerator: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    conversation,
    addMessage
  } = useStore(state => {
    const conversation = state.conversations.find(c => c.id === id);
    return {
      conversation,
      addMessage: state.addMessage
    };
  });

  useEffect(() => {
    if (!conversation) {
      navigate('/');
    }
  }, [conversation, navigate]);

  if (!conversation) {
    return null;
  }

  const handleSendMessage = async (content: string, fromFile: boolean = false) => {
    // Add user message only if not from file
    if (!fromFile) {
      addMessage(conversation.id, {
        content,
        role: 'user'
      });
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get AI response
      const response = await generateQuestions(content);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Filter out generic fallback responses
        // Stricter filter for fallback/generic responses
        const fallbackPhrases = [
          "I need the content you're referring to",
          "Once you provide the specific content",
          "Here are 5 general database study questions",
          "commonly used for exam preparation in the meantime"
        ];
        const isFallback = fallbackPhrases.some(phrase =>
          response.text?.toLowerCase().includes(phrase.toLowerCase())
        );
        // Only show if it looks like real questions (contains 'question', 'answer', or numbered list)
        const looksLikeQuestions = /question|answer|\d+\./i.test(response.text || '');
        if (response.text && !isFallback && looksLikeQuestions) {
          addMessage(conversation.id, {
            content: response.text,
            role: 'assistant'
          });
        }
      }
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFile = async (file: File) => {
    try {
      const text = await handleFileUpload(file);
      // Only show a short message in chat, do NOT show the extracted text
      addMessage(conversation.id, {
        content: `Uploaded ${file.name} for generating questions`,
        role: 'user',
        type: 'file',
        fileName: file.name
      });
      // Use the extracted text to generate questions, but don't show it in chat
      await handleSendMessage(text, true);
    } catch (err) {
      setError('Failed to process file. Please upload a valid PDF or text file.');
      console.error(err);
    }
  };

  const exportToPDF = () => {
    // Find the last assistant message (questions)
    const questions = conversation.messages
      .filter(m => m.role === 'assistant')
      .pop();
      
    if (!questions) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Study Questions', 20, 20);
    
    // Add content
    doc.setFontSize(12);
    const textLines = doc.splitTextToSize(questions.content, 170);
    doc.text(textLines, 20, 30);
    
    // Save the PDF
    doc.save('questions.pdf');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/home') }
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold ml-2 dark:text-white">Question Generator</h1>
        </div>
        
        {conversation.messages.some(m => m.role === 'assistant') && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToPDF}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            <span>Export PDF</span>
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 bg-white dark:bg-slate-900 rounded-lg p-4 shadow">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded-full mb-4">
              <svg
                className="h-8 w-8 text-pink-500 dark:text-pink-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Generate study questions
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Paste content from your study materials or upload a file. I'll create questions to help you test your knowledge.
            </p>
          </div>
        ) : (
          <MessageList messages={conversation.messages} />
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendFile={handleSendFile}
          isDisabled={isLoading}
          placeholder="Paste study content or upload a file..."
        />
      </div>
    </div>
  );
};

export default QuestionGenerator;