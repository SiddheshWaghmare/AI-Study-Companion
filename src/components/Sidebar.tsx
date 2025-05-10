import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, FileText, PenTool, HelpCircle, Plus, X } from 'lucide-react';
import { Button } from './ui/Button';
import useStore from '../store';
import { motion } from 'framer-motion';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { addConversation, conversations } = useStore(state => ({
    addConversation: state.addConversation,
    conversations: state.conversations
  }));

  const createNewChat = (type: 'tutor' | 'summarizer' | 'writer' | 'questions') => {
    const id = addConversation(type);
    navigate(`/${type}/${id}`);
    onClose();
  };

  // Group conversations by type
  const groupedConversations = React.useMemo(() => {
    return conversations.reduce((acc, conversation) => {
      if (!acc[conversation.type]) {
        acc[conversation.type] = [];
      }
      acc[conversation.type].push(conversation);
      return acc;
    }, {} as Record<string, typeof conversations>);
  }, [conversations]);

  return (
    <aside className="h-screen w-72 bg-sidebar/80 backdrop-blur-xl border-r-2 border-accent/40 shadow-soft flex flex-col glass-sidebar animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, zIndex: 50, height: '100vh' }}>
      <div className="p-5 flex justify-between items-center border-b border-sidebar/60">
        <h2 className="text-xl font-bold text-accent drop-shadow-lg tracking-wide">Study Tools</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden">
          <X className="h-5 w-5 text-accent" />
        </Button>
      </div>
      <div className="p-5 space-y-5">
        <Button 
          variant="default" 
          className="w-full justify-start glass-btn shadow-soft hover:scale-[1.03] transition-transform duration-200"
          onClick={() => createNewChat('tutor')}
        >
          <BrainCircuit className="mr-2 h-5 w-5 text-accent drop-shadow" />
          <span className="font-semibold">New Tutor Chat</span>
        </Button>
        <Button 
          variant="secondary" 
          className="w-full justify-start glass-btn shadow-soft hover:scale-[1.03] transition-transform duration-200"
          onClick={() => createNewChat('summarizer')}
        >
          <FileText className="mr-2 h-5 w-5 text-accent drop-shadow" />
          <span className="font-semibold">New Summarizer</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start glass-btn text-orange-400 hover:text-orange-500 shadow-soft hover:scale-[1.03] transition-transform duration-200"
          onClick={() => createNewChat('writer')}
        >
          <PenTool className="mr-2 h-5 w-5 text-orange-400 drop-shadow" />
          <span className="font-semibold">New Writer</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start glass-btn text-pink-400 hover:text-pink-500 shadow-soft hover:scale-[1.03] transition-transform duration-200"
          onClick={() => createNewChat('questions')}
        >
          <HelpCircle className="mr-2 h-5 w-5 text-pink-400 drop-shadow" />
          <span className="font-semibold">New Questions</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-6">
          {Object.entries(groupedConversations).map(([type, convs]) => (
            <div key={type}>
              <h3 className="text-xs font-bold text-muted uppercase mb-2 tracking-widest">
                {type === 'tutor' ? 'Tutor Chats' : 
                 type === 'summarizer' ? 'Summaries' : 
                 type === 'writer' ? 'Essays' : 'Question Sets'}
              </h3>
              <ul className="space-y-1">
                {convs.map(conversation => (
                  <motion.li 
                    key={conversation.id}
                    whileHover={{ x: 6, scale: 1.04 }}
                  >
                    <Link
                      to={`/${type}/${conversation.id}`}
                      className="text-sm block py-2 px-3 rounded-xl hover:bg-accent/20 hover:text-accent transition-colors duration-150 text-white truncate glass-list-item"
                      onClick={onClose}
                    >
                      {conversation.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;