'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
  onSelect?: (event: Event) => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
  const [imageError, setImageError] = useState(false);

  const startDate = new Date(event.startTime);
  const isUpcoming = startDate > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
    >
      <Card
        className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
        onClick={() => onSelect?.(event)}
        role="article"
        aria-label={event.title}
      >
        {/* Image */}
        <div className="relative h-36 bg-muted overflow-hidden">
          {!imageError && event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl bg-gradient-to-br from-primary/10 to-secondary/10">
              📅
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {isUpcoming && <Badge variant="signal">Upcoming</Badge>}
            {event.category && <Badge variant="secondary">{event.category}</Badge>}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-bold text-foreground leading-tight line-clamp-2">{event.title}</h3>

          {/* DateTime */}
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                {startDate.toLocaleDateString('en-KE', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                {startDate.toLocaleTimeString('en-KE', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
                {event.endTime &&
                  ` - ${new Date(event.endTime).toLocaleTimeString('en-KE', { hour: 'numeric', minute: '2-digit' })}`}
              </span>
            </div>
            {event.venue && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{event.venue.name}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold">
              {(event.priceMin || event.priceMax)
                ? formatPrice(event.priceMin, event.priceMax)
                : 'Free'}
            </span>
            {event.ticketUrl && (
              <Button
                variant="signal"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(event.ticketUrl, '_blank');
                }}
              >
                <Ticket className="h-3.5 w-3.5 mr-1.5" />
                Get Tickets
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}