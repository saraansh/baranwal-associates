# Source Code Organization

This directory contains the main source code for the application, organized for better maintainability and readability.

## Directory Structure

### `/app/`
Next.js App Router pages and layouts.
- `[locale]/` - Internationalized routes
  - `(auth)/` - Authentication-related pages
  - `(marketing)/` - Marketing/public pages
  - `api/` - API routes
- `robots.ts` - Robots.txt generation
- `sitemap.ts` - Sitemap generation

### `/components/`
React components organized by purpose.
- `/ui/` - ShadCN/UI components
- `/layout/` - Layout-related components
- `/common/` - Common reusable components
- `/sections/` - Page sections
- `/analytics/` - Analytics components

### `/libs/`
Core library configurations and utilities.
- `Arcjet.ts` - Arcjet security configuration
- `DB.ts` - Database instance
- `Env.ts` - Environment variables
- `I18n.ts` - Internationalization setup
- `I18nNavigation.ts` - I18n navigation utilities
- `I18nRouting.ts` - I18n routing configuration
- `Logger.ts` - Logging configuration
- `ShadCN.ts` - ShadCN/UI configuration

### `/locales/`
Translation files.
- `en.json` - English translations
- `fr.json` - French translations

### `/models/`
Database models and schemas.
- `Schema.ts` - Database schema definitions

### `/styles/`
Global styles and CSS.
- `global.css` - Global CSS styles

### `/templates/`
Page templates and layouts.
- `BaseTemplate.tsx` - Base page template
- `BaseTemplate.stories.tsx` - Storybook stories
- `BaseTemplate.test.tsx` - Unit tests

### `/types/`
TypeScript type definitions.
- `I18n.ts` - Internationalization types

### `/utils/`
Utility functions organized by purpose.
- `/config/` - Application configuration
- `/database/` - Database utilities
- `/helpers/` - General helper functions

### `/validations/`
Data validation schemas.
- `CounterValidation.ts` - Counter API validation

## Best Practices

1. **Import Organization**: Use index files for cleaner imports
2. **Component Organization**: Group components by their purpose and functionality
3. **Utility Organization**: Separate utilities by their domain (config, database, helpers)
4. **Type Safety**: Use TypeScript for all new code
5. **Documentation**: Keep README files updated when adding new directories

## Adding New Code

1. **Components**: Add to appropriate subdirectory in `/components/`
2. **Pages**: Add to appropriate subdirectory in `/app/[locale]/`
3. **Utilities**: Add to appropriate subdirectory in `/utils/`
4. **Types**: Add to `/types/` directory
5. **Validations**: Add to `/validations/` directory
6. **Models**: Add to `/models/` directory

## Import Examples

```tsx
import { Hello } from '@/components/common';
// Components
import { ThemeProvider } from '@/components/layout';
import { Button } from '@/components/ui/button';

// Libs
import { db } from '@/libs/DB';
import { Env } from '@/libs/Env';
// Utils
import { AppConfig } from '@/utils/config';

import { createDbConnection } from '@/utils/database';
import { getBaseUrl } from '@/utils/helpers';
```
