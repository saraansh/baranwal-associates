'use client';

import { Clock, Mail, MapPin, MessageCircle, Phone, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ContactInfo() {
  const t = useTranslations('Contact');

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Address',
      value: t('address'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: t('phone'),
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Mail,
      label: 'Email',
      value: t('email'),
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello! I\'m interested in your architectural services.');
    window.open(`https://wa.me/${t('whatsapp').replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <Card className="border-2 border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Users className="h-6 w-6 text-primary" />
          {t('info_title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Contact Details */}
          {contactInfo.map((info) => {
            const IconComponent = info.icon;
            return (
              <div key={`contact-${info.label}`} className="flex items-center gap-4 rounded-lg bg-secondary/30 p-4 transition-all duration-300 hover:scale-105 hover:bg-secondary/50">
                <div className={`rounded-full bg-gradient-to-br p-3 ${info.color} text-white transition-transform duration-300 hover:scale-110`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{info.label}</h4>
                  <p className="text-muted-foreground">{info.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* WhatsApp and Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connect With Us</h4>
            <Button
              onClick={handleWhatsAppClick}
              className="w-full gap-2 bg-green-500 text-white transition-all duration-300 hover:scale-105 hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </Button>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="text-xs transition-all duration-300 hover:scale-105">
                Facebook
              </Button>
              <Button variant="outline" size="sm" className="text-xs transition-all duration-300 hover:scale-105">
                Instagram
              </Button>
              <Button variant="outline" size="sm" className="text-xs transition-all duration-300 hover:scale-105">
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Business Hours
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between rounded-lg bg-secondary/20 p-2">
                <span>Monday - Friday:</span>
                <span className="font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between rounded-lg bg-secondary/20 p-2">
                <span>Saturday:</span>
                <span className="font-medium">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between rounded-lg bg-secondary/20 p-2">
                <span>Sunday:</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
