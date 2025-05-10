// TypeScript: declare the global function for fallback session creation
declare global {
  interface Window {
    __CREATE_SUMMARIZER_CONVERSATION__?: () => string;
  }
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { Button } from '../components/ui/Button';
import useStore from '../store';
import { summarizeLecture } from '../utils/api';
import { jsPDF } from 'jspdf';
import { handleFileUpload } from '../utils/fileHandler';
import { toast } from 'sonner';

const LectureSummarizer: React.FC = () => {
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

  // If no conversation, show a message and offer to start a new session
  if (!conversation) {
    return (
      <div className="p-8 text-center text-red-600">
        No conversation found. Please start a new Lecture Summarizer session from the home screen.<br />
        <button
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          onClick={() => {
            // Create a new conversation and navigate using the global function
            const newId = typeof window !== 'undefined' && typeof window.__CREATE_SUMMARIZER_CONVERSATION__ === 'function'
              ? window.__CREATE_SUMMARIZER_CONVERSATION__()
              : '';
            if (newId) {
              navigate(`/summarizer/${newId}`);
            } else {
              alert('Could not create a new session. Please return to the home screen.');
            }
          }}
        >
          Start New Session
        </button>
      </div>
    );
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
      const response = await summarizeLecture(content);
      
      if (response.error) {
        setError(response.error);
        toast.error(response.error);
      } else {
        addMessage(conversation.id, {
          content: response.text,
          role: 'assistant'
        });
      }
    } catch (err) {
      const errorMessage = 'Failed to get response. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFile = async (file: File) => {
    try {
      addMessage(conversation.id, {
        content: `Uploaded ${file.name} for summarization`,
        role: 'user',
        type: 'file',
        fileName: file.name
      });

      const text = await handleFileUpload(file);
      await handleSendMessage(text, true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    }
  };

  const exportToPDF = () => {
    const summary = conversation.messages
      .filter(m => m.role === 'assistant')
      .pop();
      
    if (!summary) return;
    
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Lecture Summary', 20, 20);
    
    doc.setFontSize(12);
    const textLines = doc.splitTextToSize(summary.content, 170);
    doc.text(textLines, 20, 30);
    
    doc.save('summary.pdf');
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
          <h1 className="text-xl font-bold ml-2 dark:text-white">Lecture Summarizer</h1>
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
            <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full mb-4">
              <svg
                className="h-8 w-8 text-purple-500 dark:text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Upload lecture notes
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Paste lecture content or upload a file (PDF or text). I'll create a concise, structured summary with key points highlighted.
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
          placeholder="Paste lecture notes or upload a file..."
        />
      </div>
    </div>
  );
};

export default LectureSummarizer;