'use client';

import { Clock, MessageCircle, Trophy, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ContactStats() {
  return (
    <Card className="border-2 border-border bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Trophy className="h-6 w-6 text-primary" />
          Why Choose Us
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="group text-center transition-all duration-300 hover:scale-105">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <Clock className="h-8 w-8 animate-pulse" />
            </div>
            <div className="text-2xl font-bold text-primary">24hrs</div>
            <div className="text-sm text-muted-foreground">Response Time</div>
          </div>
          <div className="group text-center transition-all duration-300 hover:scale-105">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <MessageCircle className="h-8 w-8 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="text-2xl font-bold text-accent">Free</div>
            <div className="text-sm text-muted-foreground">Initial Consultation</div>
          </div>
          <div className="group text-center transition-all duration-300 hover:scale-105">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <Users className="h-8 w-8 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <div className="text-2xl font-bold text-secondary-foreground">25+</div>
            <div className="text-sm text-muted-foreground">Team Members</div>
          </div>
          <div className="group text-center transition-all duration-300 hover:scale-105">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <Trophy className="h-8 w-8 animate-bounce" style={{ animationDelay: '1.5s' }} />
            </div>
            <div className="text-2xl font-bold text-primary">99%</div>
            <div className="text-sm text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
