import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { subscribeToMessages, updateMessageStatus, deleteMessage } from '../../services/messagesService';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToMessages((data) => {
      setMessages(data);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleRead = async (id, currentStatus) => {
    try {
      await updateMessageStatus(id, !currentStatus);
    } catch (error) {
      alert("Failed to update message status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(id);
      } catch (error) {
        alert("Failed to delete message");
      }
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Mail className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <p className="text-[--text-muted] text-sm mt-1">Manage contact form submissions</p>
          </div>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
          <input 
            type="text" 
            placeholder="Search messages..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div className="bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Mail className="w-12 h-12 text-white/10 mb-4" />
            <p className="text-white/60">No messages found.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            <AnimatePresence>
              {filteredMessages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-6 flex flex-col md:flex-row gap-6 transition-colors ${msg.isRead ? 'bg-transparent hover:bg-white/5' : 'bg-primary/5 hover:bg-primary/10'}`}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${msg.isRead ? 'bg-white/10' : 'bg-gradient-to-br from-primary to-accent-2'}`}>
                          {msg.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-base leading-tight">{msg.name}</h3>
                          <p className="text-primary text-xs">{msg.email}</p>
                        </div>
                      </div>
                      <div className="text-[11px] text-[--text-muted] whitespace-nowrap">
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="pt-2 pl-13 md:pl-0">
                      <h4 className="text-white text-sm font-medium mb-1">Subject: {msg.subject}</h4>
                      <p className="text-[--text-muted] text-sm leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-xl border border-white/5">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center md:items-start justify-end gap-3 shrink-0">
                    <button 
                      onClick={() => handleToggleRead(msg.id, msg.isRead)}
                      className={`p-2 rounded-lg border transition-colors flex items-center gap-2 text-xs font-medium ${msg.isRead ? 'text-[--text-muted] border-white/10 hover:bg-white/10' : 'text-primary border-primary/20 hover:bg-primary/20'}`}
                      title={msg.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {msg.isRead ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span className="hidden sm:inline">{msg.isRead ? 'Mark Unread' : 'Mark Read'}</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 rounded-lg border border-white/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-colors flex items-center gap-2 text-xs font-medium"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
