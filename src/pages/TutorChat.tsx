import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { Button } from '../components/ui/Button';
import useStore from '../store';
import { generateTutorResponse } from '../utils/api';
import { Message } from '../types';

const TutorChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    conversation,
    addMessage,
    deleteConversation
  } = useStore(state => {
    const conversation = state.conversations.find(c => c.id === id);
    return {
      conversation,
      addMessage: state.addMessage,
      deleteConversation: state.deleteConversation
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

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage(conversation.id, {
      content,
      role: 'user'
    });

    setIsLoading(true);
    setError(null);

    try {
      // Get AI response
      const response = await generateTutorResponse(content);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Add AI response
        addMessage(conversation.id, {
          content: response.text,
          role: 'assistant'
        });
      }
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/home') }
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-2 dark:text-white">Personal Tutor</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 bg-white dark:bg-slate-900 rounded-lg p-4 shadow">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
              <svg
                className="h-8 w-8 text-blue-500 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Start a new conversation
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Ask any question about your studies. I can explain concepts, solve problems, and help you understand complex topics.
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
          isDisabled={isLoading}
          placeholder="Ask anything about your studies..."
        />
      </div>
    </div>
  );
};

export default TutorChat;