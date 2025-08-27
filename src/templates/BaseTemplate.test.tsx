import { page } from '@vitest/browser/context';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import messages from '@/locales/en.json';
import { BaseTemplate } from './BaseTemplate';

describe('Base template', () => {
  describe('Render method', () => {
    it('should have navigation links', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <BaseTemplate>
            <div>Test content</div>
          </BaseTemplate>
        </NextIntlClientProvider>,
      );

      expect(page.getByText('Home')).toBeDefined();
      expect(page.getByText('About')).toBeDefined();
      expect(page.getByText('Services')).toBeDefined();
      expect(page.getByText('Collection')).toBeDefined();
      expect(page.getByText('Contact')).toBeDefined();
    });

    it('should render children content', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <BaseTemplate>
            <div>Test content</div>
          </BaseTemplate>
        </NextIntlClientProvider>,
      );

      expect(page.getByText('Test content')).toBeDefined();
    });

    it('should render custom navigation when provided', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <BaseTemplate leftNav={<li>Custom Nav</li>}>
            <div>Test content</div>
          </BaseTemplate>
        </NextIntlClientProvider>,
      );

      expect(page.getByText('Custom Nav')).toBeDefined();
    });
  });
});
