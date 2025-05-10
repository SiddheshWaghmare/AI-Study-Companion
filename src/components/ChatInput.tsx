import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from './ui/Button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendFile?: (file: File) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendFile,
  isDisabled = false,
  placeholder = 'Type your message...',
}) => {
  const [message, setMessage] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendFile) {
      onSendFile(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2">
      {onSendFile && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            disabled={isDisabled}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </>
      )}
      
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={isDisabled}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          style={{
            minHeight: '60px',
            maxHeight: '150px',
            height: 'auto',
          }}
        />
        <button
          type="submit"
          disabled={!message.trim() || isDisabled}
          className="absolute bottom-2 right-2 text-blue-500 hover:text-blue-600 disabled:opacity-50 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;