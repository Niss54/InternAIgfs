import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from './ChatWindow';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex items-start gap-2 max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-primary text-primary-foreground shadow-[0_0_10px_hsla(217_91%_60%/0.5)]' 
            : 'bg-gradient-to-r from-primary to-accent text-primary-foreground pulse-glow'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Content */}
        <div className={`glass-card p-3 relative ${
          isUser 
            ? 'bg-primary/20 border-primary/30 shadow-[0_0_15px_hsla(217_91%_60%/0.3)]' 
            : 'bg-secondary/50 border-border/50'
        }`}>
          {/* Message text */}
          <p className="text-sm text-foreground leading-relaxed">
            {message.content}
          </p>
          
          {/* Timestamp */}
          <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* AI message glow effect */}
          {!isUser && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
};