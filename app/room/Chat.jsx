"use client"

import React, { useEffect, useState, useContext, useRef } from 'react';
import { SocketContext } from '@/context/SocketProvider';
import { useSocket } from '@/context/SocketProvider';

const Chat = () => {
  const { room } = useContext(SocketContext);
  const socket = useSocket();
  const messageContainerRef = useRef(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleNewMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on('message', handleNewMessage);

    return () => {
      socket.off('message', handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('message', { room, message, from: socket.id });
      setMessage('');
    }
  };

  return (
    <div className="container mx-auto bg-gray-900 h-full flex flex-col-reverse p-4">
      <div className="flex flex-col">
        <div
          className="overflow-y-auto overflow-x-hidden gap-2 flex flex-col h-[22rem] m-1"
          style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}
          ref={messageContainerRef}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`py-1 px-2 rounded-xl flex w-[full] ${msg.from === socket.id ? 'self-end bg-green-500 text-white' : 'self-start bg-blue-500 text-white'}`}
            >
              {msg.message}
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            placeholder='message'
            maxLength={25}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-2xl resize-none"
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-2 bg-slate-600 font-semibold text-white rounded-2xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
