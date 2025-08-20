import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, Cpu, Brain, User2, CpuIcon, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import nodeIcon from "../assets/icons8-nodejs.svg";
import jsIcon from "../assets/icons8-javascript.svg";
import { socket } from '@/apis/socket';
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AssistantChatPanelProps {
  agent: 'nodejs' | 'javascript' | 'default';
  maxChats: number;
  sources: string[];
}

const agentConfig = {
  nodejs: {
    name: 'Node.js Assistant',
    Icon: <img src={nodeIcon} alt="icon" className='w-full h-full p-[4px]' />,
    bgColor: 'bg-green-500',
    bgGradient: 'from-green-50 to-green-100',
    borderColor: 'border-green-200',
    accentColor: 'text-green-600',
    buttonVariant: 'green' as const
  },
  javascript: {
    name: 'JavaScript Assistant',
    Icon: <img src={jsIcon} alt="icon" className='w-12 h-12' />,
    bgColor: 'bg-yellow-500',
    bgGradient: 'from-yellow-50 to-yellow-100',
    borderColor: 'border-yellow-200',
    accentColor: 'text-yellow-600',
    buttonVariant: 'yellow' as const
  },
  default: {
    name: 'AI Assistant',
    Icon: <CpuIcon />,
    bgColor: 'bg-blue-500',
    bgGradient: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    accentColor: 'text-blue-600',
    buttonVariant: 'default' as const
  }
};

const AssistantChatPanel: React.FC<AssistantChatPanelProps> = ({
  agent,
  maxChats,
  sources
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatCount, setChatCount] = useState(0)

  const config = agentConfig[agent];
  const hasReachedLimit = chatCount >= maxChats;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || hasReachedLimit || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    socket.emit("client", inputValue);
    setChatCount(pre => pre + 1)
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const handler = (data: string) => {
      console.log(data)
      setMessages(pre => [...pre, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    };
    socket.on("server", handler);
    return () => {
      socket.off("server", handler);
    };
  }, []);

  useEffect(() => {
    if (messages?.length > 0) {
      localStorage.removeItem("chat");
      console.log("Item removed");
      localStorage.setItem('chat', JSON.stringify(messages));
      localStorage.setItem('limit', JSON.stringify(chatCount))
    }
  }, [messages]);

  useEffect(() => {
    const msgs = JSON.parse(localStorage.getItem("chat") || "[]");
    const limit = JSON.parse(localStorage.getItem("limit") || "0");
    setMessages(msgs.map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    })));
    setChatCount(limit)
  }, []);

  return (
    <div className={cn(
      "h-full flex flex-col transition-all duration-300",
      `bg-gradient-to-br ${config.bgGradient} dark:from-gray-900 dark:to-gray-800`
    )}>
      {/* Header */}
      <div className={cn("p-6 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur", config.borderColor, "dark:border-gray-700")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", config.bgColor)}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <>{config.Icon}</>
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{config.name}</h2>
              <p className="text-sm text-muted-foreground">Powered by RAG system</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={()=>{
              localStorage.removeItem("chat");
              setMessages([])
            }} className={cn("px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 bg-red-500 text-white")}>
              <Trash2 className='size-4'/>
              delete chats
            </button>
            <div className={cn("px-3 py-1 rounded-full text-xs font-medium", config.bgColor, "text-white")}>
              {chatCount}/{maxChats} chat used
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Bot className={cn("w-8 h-8", config.accentColor)} />
            </div>
            <h3 className="text-lg font-medium mb-2 text-foreground">Start a conversation with {config.name}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ask questions about your uploaded content and sources.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <motion.div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground"
                        : cn("text-white", config.bgColor)
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 " />
                    ) : (
                      <>{config.Icon}</>
                    )}
                  </motion.div>

                  <div className={cn(
                    "max-w-[80%] rounded-lg px-4 py-3 shadow-sm",
                    message.role === 'user'
                      ? "bg-primary bg-white dark:bg-gray-800 border "
                      : "bg-white dark:bg-gray-800 border dark:border-gray-700"
                  )}>
                    <div className="text-sm whitespace-pre-wrap text-foreground"><ReactMarkdown>{message.content}</ReactMarkdown></div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <motion.div
                  className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", config.bgColor)}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <>{config.Icon}</>
                </motion.div>
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg px-4 py-3">
                  <div className="flex space-x-1">
                    <motion.div
                      className={cn("w-2 h-2 rounded-full", config.bgColor)}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className={cn("w-2 h-2 rounded-full", config.bgColor)}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className={cn("w-2 h-2 rounded-full", config.bgColor)}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className={cn("p-6 border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur", config.borderColor, "dark:border-gray-700")}>
        {hasReachedLimit ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <p className="text-sm font-medium text-destructive">Chat limit reached</p>
            <p className="text-xs text-destructive/80">Upgrade to continue chatting</p>
          </motion.div>
        ) : (
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${config.name} anything...`}
              className="flex-1"
              disabled={isTyping}
              animated={true}
            />
            <Button
              onClick={handleSend}
              variant={config.buttonVariant}
              disabled={!inputValue.trim() || isTyping}
              animated={true}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantChatPanel;
