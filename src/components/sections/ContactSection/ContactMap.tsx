'use client';

import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ContactMap() {
  return (
    <Card className="border-2 border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <MapPin className="h-6 w-6 text-primary" />
          Our Location
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden rounded-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.8717211737107!2d83.37096067626749!3d26.748469367127974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39914464aa0324a3%3A0x1a6f0c2776ff1d3b!2sEr.%20Anand%20Prakash%20Baranwal!5e0!3m2!1sen!2sin!4v1756246300332!5m2!1sen!2sin"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
            title="Baranwal Associates - Office Location"
            sandbox="allow-scripts"
          />
        </div>
      </CardContent>
    </Card>
  );
}
