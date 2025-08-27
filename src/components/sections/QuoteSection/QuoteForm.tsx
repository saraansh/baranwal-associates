'use client';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  message: string;
};

export function QuoteForm() {
  const t = useTranslations('Contact');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    projectType: '',
    budgetRange: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your API
      // For now, we'll just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        projectType: '',
        budgetRange: '',
        message: '',
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const projectTypes = [
    'Residential Villa',
    'Apartment Complex',
    'Commercial Building',
    'Office Space',
    'Retail Space',
    'Healthcare Facility',
    'Educational Institution',
    'Hospitality Project',
    'Industrial Facility',
    'Urban Planning',
    'Interior Design',
    'Other',
  ];

  const budgetRanges = [
    'Under ₹50 Lakhs',
    '₹50 Lakhs - ₹1 Crore',
    '₹1 Crore - ₹5 Crores',
    '₹5 Crores - ₹10 Crores',
    '₹10 Crores - ₹25 Crores',
    'Above ₹25 Crores',
    'Let\'s Discuss',
  ];

  return (
    <Card className="border-2 border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Send className="h-6 w-6 text-primary" />
          {t('form_title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name, Email, and Phone Row */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('name_label')}</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={e => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                required
                className="transition-colors focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email_label')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
                className="transition-colors focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('phone_label')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className="transition-colors focus:border-primary"
              />
            </div>
          </div>

          {/* Project Type and Budget Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectType">{t('project_type_label')}</Label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={e => handleInputChange('projectType', e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" className="bg-background text-muted-foreground">Select project type</option>
                {projectTypes.map(type => (
                  <option key={type} value={type} className="bg-background text-foreground">{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetRange">{t('budget_label')}</Label>
              <select
                id="budgetRange"
                value={formData.budgetRange}
                onChange={e => handleInputChange('budgetRange', e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" className="bg-background text-muted-foreground">Select budget range</option>
                {budgetRanges.map(range => (
                  <option key={range} value={range} className="bg-background text-foreground">{range}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">{t('message_label')}</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={e => handleInputChange('message', e.target.value)}
              placeholder="Tell us about your project requirements, timeline, and any specific preferences..."
              rows={3}
              className="transition-colors focus:border-primary"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary py-3 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/90"
          >
            {isSubmitting
              ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Sending...
                  </div>
                )
              : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    {t('submit_button')}
                  </div>
                )}
          </Button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Thank you! Your quote request has been submitted. We'll get back to you within 24 hours.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Sorry, something went wrong. Please try again or contact us directly.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
