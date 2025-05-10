import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { Button } from '../components/ui/Button';
import useStore from '../store';
import { generateEssay } from '../utils/api';
import { jsPDF } from 'jspdf';

const Writer: React.FC = () => {
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
      const response = await generateEssay(content);
      
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

  const exportToPDF = () => {
    // Find the last assistant message (essay)
    const essay = conversation.messages
      .filter(m => m.role === 'assistant')
      .pop();
      
    if (!essay) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    const title = conversation.messages
      .filter(m => m.role === 'user')
      .pop()?.content || 'Essay';
    doc.text(title, 20, 20);
    
    // Add content
    doc.setFontSize(12);
    const textLines = doc.splitTextToSize(essay.content, 170);
    doc.text(textLines, 20, 30);
    
    // Save the PDF
    doc.save('essay.pdf');
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
          <h1 className="text-xl font-bold ml-2 dark:text-white">Writer</h1>
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
            <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-full mb-4">
              <svg
                className="h-8 w-8 text-orange-500 dark:text-orange-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Start writing
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Enter an essay topic or writing prompt. I'll create well-structured content with proper citations and formatting.
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
          placeholder="Enter an essay topic or writing prompt..."
        />
      </div>
    </div>
  );
};

export default Writer;