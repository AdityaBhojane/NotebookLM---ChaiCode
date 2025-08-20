import React, { useState, useRef, useEffect } from 'react';
import { Lock, Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

interface ChatInterfacePanelProps {
  messages: Message[];
  isStreaming: boolean;
  chatCount: number;
  maxChats: number;
}

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span className="text-sm text-muted-foreground ml-2">Assistant is typing...</span>
    </div>
  );
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 mb-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser 
          ? "bg-chat-user text-chat-user-foreground" 
          : "bg-chat-assistant text-chat-assistant-foreground border"
      )}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>
      
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-3 shadow-sm",
        isUser
          ? "bg-chat-user text-chat-user-foreground ml-auto"
          : "bg-chat-assistant text-chat-assistant-foreground border"
      )}>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        <div className="text-xs opacity-70 mt-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};

const ChatLimitWarning: React.FC<{ chatCount: number; maxChats: number }> = ({ chatCount, maxChats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
    >
      <Lock className="w-5 h-5 text-destructive" />
      <div>
        <p className="text-sm font-medium text-destructive">
          Chat Limit Reached
        </p>
        <p className="text-xs text-destructive/80">
          You've used {chatCount}/{maxChats} free chats. Upgrade to continue.
        </p>
      </div>
    </motion.div>
  );
};

const ChatInterfacePanel: React.FC<ChatInterfacePanelProps> = ({ 
  messages, 
  isStreaming,
  chatCount,
  maxChats
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasReachedLimit = chatCount >= maxChats;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Chat Interface</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered responses from your sources
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            {chatCount}/{maxChats} chats used
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Ready to Help</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Add your sources and ask a question to get started. I'll analyze your documents and provide detailed answers.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <AnimatePresence>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </AnimatePresence>
            
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-chat-assistant text-chat-assistant-foreground border flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-chat-assistant text-chat-assistant-foreground border rounded-lg px-4 py-3">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {hasReachedLimit && (
        <div className="p-6 border-t">
          <ChatLimitWarning chatCount={chatCount} maxChats={maxChats} />
        </div>
      )}
    </div>
  );
};

export default ChatInterfacePanel;
