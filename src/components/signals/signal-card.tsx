'use client';

import { motion } from 'framer-motion';
import { Clock, TrendingUp, Percent, Calendar, Sparkles, AlertTriangle, Car, CircleDot } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, formatTimeAgo } from '@/lib/utils';
import type { Signal, SignalType } from '@/types';

const signalIcons: Record<SignalType, React.ReactNode> = {
  new_place: <Sparkles className="h-4 w-4" />,
  price_drop: <Percent className="h-4 w-4" />,
  price_surge: <TrendingUp className="h-4 w-4" />,
  event_upcoming: <Calendar className="h-4 w-4" />,
  promotion: <Sparkles className="h-4 w-4" />,
  trending: <TrendingUp className="h-4 w-4" />,
  availability: <CircleDot className="h-4 w-4" />,
  traffic_anomaly: <AlertTriangle className="h-4 w-4" />,
};

const signalColors: Record<SignalType, string> = {
  new_place: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  price_drop: 'bg-green-500/20 text-green-400 border-green-500/30',
  price_surge: 'bg-red-500/20 text-red-400 border-red-500/30',
  event_upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  promotion: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  trending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  availability: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  traffic_anomaly: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

interface SignalCardProps {
  signal: Signal;
  onSelect?: (signal: Signal) => void;
  index?: number;
}

export function SignalCard({ signal, onSelect, index = 0 }: SignalCardProps) {
  const icon = signalIcons[signal.type];
  const colorClass = signalColors[signal.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card
        className={cn(
          'p-4 cursor-pointer transition-all hover:shadow-md',
          signal.score > 0.8 && 'border-l-4 border-l-signal-new'
        )}
        onClick={() => onSelect?.(signal)}
        role="article"
        aria-label={signal.title}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              'h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 border',
              colorClass
            )}
          >
            {icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={cn('text-xs', colorClass.split(' ')[1])}>
                {signal.type.replace(/_/g, ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(signal.createdAt)}
              </span>
            </div>

            <h4 className="font-semibold text-sm leading-snug">{signal.title}</h4>

            {signal.body && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {signal.body}
              </p>
            )}

            {signal.place && (
              <div className="flex items-center gap-2 mt-2">
                <div className="h-7 w-7 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {signal.place.imageUrl ? (
                    <img
                      src={signal.place.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs">
                      📍
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium truncate">{signal.place.name}</span>
              </div>
            )}

            {/* Relevance score bar */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${signal.score * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {Math.round(signal.score * 100)}% relevant
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}