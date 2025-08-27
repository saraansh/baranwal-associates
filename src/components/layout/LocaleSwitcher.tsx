'use client';

import type { ChangeEventHandler } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usePathname } from '@/libs/I18nNavigation';
import { routing } from '@/libs/I18nRouting';

export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    router.push(`/${event.target.value}${pathname}`);
    router.refresh(); // Ensure the page takes the new locale into account related to the issue #395
  };

  return (
    <select
      defaultValue={locale}
      onChange={handleChange}
      className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
      aria-label="Language switcher"
    >
      {routing.locales.map(elt => (
        <option key={elt} value={elt} className="bg-background text-foreground">
          {elt.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
