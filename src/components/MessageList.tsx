import React from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4 pb-4">
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex max-w-[80%] md:max-w-[70%] rounded-lg p-4 ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white'
            }`}
          >
            <div className="flex-shrink-0 mr-3">
              {message.role === 'user' ? (
                <User className="h-6 w-6 text-white" />
              ) : (
                <Bot className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              {message.type === 'file' ? (
                <div className="flex items-center space-x-2">
                  <div className="bg-white dark:bg-slate-700 p-2 rounded">
                    <svg
                      className="h-6 w-6 text-blue-500"
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
                  <span className={message.role === 'user' ? 'text-white' : ''}>
                    {message.fileName || 'File'}
                  </span>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              )}
              <div className="text-xs opacity-70 mt-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;