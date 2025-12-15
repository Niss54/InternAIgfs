import React, { useState } from 'react';
import { Send, Mic, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const emojis = ['😊', '😄', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉', '🤝', '💪'];

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleMicClick = () => {
    // TODO: Implement voice recording functionality
    setIsRecording(!isRecording);
  };

  return (
    <div className="p-3">
      <div className="flex items-end gap-2">
        {/* Emoji Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0 text-muted-foreground hover:text-foreground"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 glass-card">
            <div className="grid grid-cols-4 gap-1">
              {emojis.map((emoji, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 text-lg hover:scale-110 transition-transform"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="input-glass resize-none min-h-[40px] max-h-[100px] pr-20"
            disabled={disabled}
          />
          
          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="absolute right-2 bottom-2 w-8 h-8 p-0 btn-neon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Microphone Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMicClick}
          className={`w-9 h-9 p-0 transition-all ${
            isRecording 
              ? 'text-destructive animate-pulse' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Mic className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};