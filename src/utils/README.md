# Utils Organization

This directory contains utility functions and configurations organized by their purpose.

## Directory Structure

### `/config/`
Application configuration and settings.
- `AppConfig.ts` - Main application configuration (name, locales, etc.)
- `index.ts` - Exports all config utilities

### `/database/`
Database-related utilities and connections.
- `DBConnection.ts` - Database connection setup
- `DBMigration.ts` - Database migration runner
- `index.ts` - Exports all database utilities

### `/helpers/`
General helper functions used throughout the application.
- `Helpers.ts` - Common utility functions (getBaseUrl, getI18nPath, isServer)
- `Helpers.test.ts` - Tests for helper functions
- `index.ts` - Exports all helper utilities

## Usage

Import utilities using the index files for cleaner imports:

```tsx
// Use
import { AppConfig } from '@/utils/config';
// Instead of
import { AppConfig } from '@/utils/config/AppConfig';
import { createDbConnection } from '@/utils/database';

import { createDbConnection } from '@/utils/database/DBConnection';
import { getBaseUrl } from '@/utils/helpers';
import { getBaseUrl } from '@/utils/helpers/Helpers';
```

## Available Utilities

### Config
- `AppConfig` - Application configuration object
- `ClerkLocalizations` - Clerk authentication localizations

### Database
- `createDbConnection()` - Creates a database connection

### Helpers
- `getBaseUrl()` - Gets the base URL for the application
- `getI18nPath(url, locale)` - Generates internationalized paths
- `isServer()` - Checks if code is running on server side

## Adding New Utilities

1. **Configuration**: Add to `/config/` directory and update `/config/index.ts`
2. **Database**: Add to `/database/` directory and update `/database/index.ts`
3. **Helpers**: Add to `/helpers/` directory and update `/helpers/index.ts`
