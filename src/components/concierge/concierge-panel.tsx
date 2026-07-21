'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, User, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useConcierge } from '@/hooks/use-concierge';
import { useConciergeStore, usePlaceStore } from '@/store';

export function ConciergePanel() {
  const { isOpen, messages, loading, streamText, setOpen, sendQuery, clearMessages } =
    useConcierge();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    setInput('');
    sendQuery(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 top-20 z-50 md:inset-x-auto md:right-4 md:w-[420px] bg-background rounded-3xl shadow-2xl flex flex-col overflow-hidden border"
            role="dialog"
            aria-modal="true"
            aria-label="AI Concierge"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gem/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-gem" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Concierge</h3>
                  <p className="text-xs text-muted-foreground">Powered by GPT-4o</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button variant="ghost" size="icon-sm" onClick={clearMessages} title="Clear chat">
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Sparkles className="h-12 w-12 text-gem mb-4" />
                  <h4 className="text-lg font-bold mb-2">Ask me anything!</h4>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                    Find the best places around you. Try:
                  </p>
                  <div className="space-y-2 w-full">
                    {[
                      'Find rooftop restaurants under KSh 2,000 near Westlands',
                      'Hidden gems for a first date',
                      'Outdoor activities this weekend',
                      'Best nightlife spots open right now',
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        className="w-full text-left text-xs p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                      >
                        ✦ {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    {msg.role === 'assistant' && (
                      <div className="h-7 w-7 rounded-full bg-gem/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="h-3.5 w-3.5 text-gem" />
                      </div>
                    )}
                    <div className={cn('max-w-[85%]', msg.role === 'user' ? 'order-first' : '')}>
                      <div
                        className={cn(
                          'p-3 rounded-2xl text-sm leading-relaxed',
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                        )}
                      >
                        {msg.content}
                      </div>
                      {msg.places && msg.places.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {msg.places.map((place) => (
                            <Card
                              key={place.id}
                              className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => usePlaceStore.getState().setSelectedPlace(place)}
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                  {place.imageUrl ? (
                                    <img src={place.imageUrl} alt="" className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xs">📍</div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate">{place.name}</p>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-2.5 w-2.5" />
                                    {place.distanceM ? `${(place.distanceM / 1000).toFixed(1)}km` : place.city}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-3.5 w-3.5 text-secondary-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {loading && streamText && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="h-7 w-7 rounded-full bg-gem/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="h-3.5 w-3.5 text-gem" />
                    </div>
                    <div className="bg-muted p-3 rounded-2xl rounded-bl-md text-sm">
                      {streamText}
                      <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-0.5" />
                    </div>
                  </motion.div>
                )}
                {loading && !streamText && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="h-7 w-7 rounded-full bg-gem/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-gem" />
                    </div>
                    <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-background/95 backdrop-blur-md">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about places nearby..."
                  disabled={loading}
                  className="flex-1"
                  aria-label="Search query"
                />
                <Button variant="gem" size="icon" onClick={handleSend} disabled={loading || !input.trim()} aria-label="Send message">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">10 AI searches remaining today</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}