# Baranwal Associates - Architecture Firm Website

**Transforming Dreams Into Reality**

A modern, full-stack web application built for Baranwal Associates, a premier architectural design and construction firm. This project showcases a sophisticated tech stack with enterprise-grade tooling, comprehensive testing, and modern development practices.

## 🏗️ Project Overview

This is a **Next.js 15** application built with **React 19**, **TypeScript**, and **Tailwind CSS 4**. It features a modular architecture, internationalization support, real-time analytics, and a comprehensive testing suite.

### Key Features

- 🏢 **Professional Portfolio**: Showcase architectural projects with interactive carousel
- 🌐 **Internationalization**: Multi-language support (English/French) with Next-Intl
- 🔐 **Authentication**: Secure user management with Clerk
- 📊 **Analytics**: Real-time user tracking with PostHog
- 🎨 **Modern UI**: Beautiful, responsive design with ShadCN/UI components
- 📱 **Mobile-First**: Fully responsive design with touch gestures and accessibility
- 🗄️ **Database**: PostgreSQL with Drizzle ORM and PGLite for local development
- 🛡️ **Security**: Request rate limiting and protection with Arcjet
- 📈 **Monitoring**: Error tracking and performance monitoring with Sentry
- ⚡ **Performance**: Optimized build with bundle analysis and caching strategies

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5.8** - Strict type safety with comprehensive configuration
- **Tailwind CSS 4** - Utility-first CSS framework

### Database & ORM
- **PostgreSQL** - Production database
- **PGLite** - Local development database
- **Drizzle ORM** - Type-safe database operations
- **Drizzle Kit** - Database migrations and management

### Authentication & Security
- **Clerk** - Complete authentication solution
- **Arcjet** - Rate limiting and security protection
- **Zod** - Runtime type validation

### Development Tools
- **Bun** - Fast JavaScript runtime and package manager
- **ESLint** - Code linting with comprehensive rules
- **Lefthook** - Git hooks for automated checks
- **Commitlint** - Conventional commit message enforcement

### Testing & Quality Assurance
- **Vitest** - Unit and integration testing
- **Playwright** - End-to-end testing
- **Storybook** - Component development and testing
- **Chromatic** - Visual regression testing

### Monitoring & Analytics
- **Sentry** - Error monitoring and performance tracking
- **PostHog** - Product analytics and user insights
- **Better Stack** - Application monitoring

### CI/CD & Deployment
- **GitHub Actions** - Automated testing and deployment
- **Checkly** - Synthetic monitoring
- **Codecov** - Code coverage reporting
- **Semantic Release** - Automated versioning and releases

### Internationalization
- **Next-Intl** - Type-safe internationalization
- **Crowdin** - Translation management

## 📁 Project Structure

```
├── .github/                     # GitHub Actions workflows and templates
│   ├── actions/setup-project/   # Reusable action for CI/CD
│   └── workflows/               # CI/CD pipeline definitions
├── migrations/                  # Database migration files
├── public/                      # Static assets
│   └── assets/                  # Images and media files
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── [locale]/           # Internationalized routes
│   │   ├── api/                # API route handlers
│   │   ├── global-error.tsx    # Global error boundary
│   │   ├── robots.ts           # SEO robots configuration
│   │   └── sitemap.ts          # Dynamic sitemap generation
│   ├── components/             # React components (organized by purpose)
│   │   ├── analytics/          # Analytics tracking components
│   │   ├── common/             # Reusable common components
│   │   ├── layout/             # Layout-specific components
│   │   ├── sections/           # Page sections (broken down into sub-components)
│   │   │   ├── ContactSection/ # Contact form, info, map, stats
│   │   │   ├── HeroSection/    # Hero content and background
│   │   │   └── ProjectsSection/ # Project carousel, cards, modal
│   │   └── ui/                 # ShadCN/UI components
│   ├── libs/                   # Core library configurations
│   ├── locales/                # Translation files
│   ├── models/                 # Database schema definitions
│   ├── styles/                 # Global CSS and Tailwind configuration
│   ├── templates/              # Page templates with Storybook stories
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions (organized by category)
│   │   ├── config/             # Application configuration
│   │   ├── database/           # Database utilities
│   │   └── helpers/            # General helper functions
│   └── validations/            # Zod schema validations
├── tests/                      # Test files
│   ├── e2e/                    # End-to-end tests
│   └── integration/            # Integration tests
└── Configuration Files         # Various config files (see below)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** (specified in `package.json` engines)
- **Bun** (recommended package manager)
- **PostgreSQL** (for production) or PGLite (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saraansh/baranwal-associates.git
   cd baranwal-associates
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

4. **Set up the database**
   ```bash
   bun run db:migrate
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

The application will be available at `http://localhost:3000`.

## 📜 Available Scripts

### Development
- `bun run dev` - Start development server with database
- `bun run dev:next` - Start Next.js development server only
- `bun run dev:spotlight` - Start Spotlight debugging tool

### Building & Production
- `bun run build` - Build production application
- `bun run start` - Start production server
- `bun run build-stats` - Build with bundle analysis

### Database Operations
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Drizzle Studio
- `bun run db-server:file` - Start local file-based database
- `bun run db-server:memory` - Start in-memory database

### Code Quality & Testing
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Fix ESLint issues automatically
- `bun run check:types` - TypeScript type checking
- `bun run check:deps` - Check dependencies with Knip
- `bun run check:i18n` - Validate translations
- `bun run test` - Run unit tests
- `bun run test:e2e` - Run end-to-end tests

### Development Tools
- `bun run storybook` - Start Storybook development server
- `bun run storybook:test` - Run Storybook tests
- `bun run build-storybook` - Build Storybook
- `bun run clean` - Clean build artifacts
- `bun run commit` - Interactive commit with Commitizen

## 🔧 Configuration Files

### Core Configuration
- `next.config.ts` - Next.js configuration with plugins
- `tsconfig.json` - TypeScript compiler configuration
- `postcss.config.mjs` - PostCSS configuration with Tailwind CSS
- `drizzle.config.ts` - Database ORM configuration

### Development Tools
- `eslint.config.mjs` - ESLint configuration with comprehensive rules
- `vitest.config.mts` - Test configuration for unit/UI tests
- `playwright.config.ts` - End-to-end test configuration
- `lefthook.yml` - Git hooks for pre-commit validation
- `commitlint.config.ts` - Commit message format enforcement

### Component Development
- `components.json` - ShadCN/UI component configuration
- `.storybook/` - Storybook configuration

### Quality Assurance
- `knip.config.ts` - Dependency analysis configuration
- `checkly.config.ts` - Synthetic monitoring configuration
- `codecov.yml` - Code coverage configuration

### Internationalization
- `crowdin.yml` - Translation management configuration

## 🏗️ Architecture Decisions

### Component Organization
The project uses a **modular component architecture** where large components are broken down into smaller, focused sub-components:

- **Sections are directories**: Each major section (ContactSection, ProjectsSection, etc.) has its own directory
- **Index files for clean imports**: Each directory exports its main component via `index.tsx`
- **Single responsibility**: Each component has a clear, single purpose
- **Type safety**: Shared types are defined once and reused

### Database Strategy
- **Development**: PGLite for fast, file-based local development
- **Production**: PostgreSQL with connection pooling
- **Migrations**: Drizzle Kit for type-safe schema management
- **ORM**: Drizzle ORM for type-safe database operations

### Testing Strategy
- **Unit Tests**: Vitest with browser testing for component logic
- **Integration Tests**: API and database integration testing
- **E2E Tests**: Playwright for full user journey testing
- **Visual Testing**: Storybook + Chromatic for component appearance
- **Synthetic Monitoring**: Checkly for production monitoring

### Internationalization Approach
- **Type-safe translations**: Next-Intl with TypeScript integration
- **Dynamic routing**: Locale-based URL structure
- **Translation management**: Crowdin for collaborative translation
- **Fallback strategy**: English as default with graceful fallbacks

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions pipeline:

### Build Stage
- **Matrix builds** across Node.js versions (22.x, 24.x)
- **Caching strategies** for dependencies and Next.js builds
- **Environment isolation** with disabled monitoring in CI

### Static Analysis
- **Commit message validation** with Commitlint
- **Code linting** with ESLint and auto-fixing
- **Type checking** with TypeScript strict mode
- **Dependency analysis** with Knip
- **Translation validation** with i18n-check

### Testing Pipeline
- **Unit tests** with coverage reporting to Codecov
- **Component tests** with Storybook
- **E2E tests** with Playwright in Docker
- **Visual regression tests** with Chromatic

### Translation Management
- **Automated Crowdin sync** on pull requests
- **Translation updates** committed back to PR

## 🛡️ Security Features

### Request Protection
- **Rate limiting** with Arcjet
- **DDoS protection** and bot detection
- **CORS configuration** for API security

### Authentication
- **Clerk integration** with multi-locale support
- **Secure session management**
- **Protected routes** and middleware

### Environment Security
- **Type-safe environment variables** with Zod validation
- **Secrets management** via environment variables
- **Production/development environment isolation**

## 📊 Monitoring & Analytics

### Error Tracking
- **Sentry integration** for error monitoring
- **Source map uploads** for better debugging
- **Performance monitoring** and alerting

### User Analytics
- **PostHog integration** for product analytics
- **Privacy-conscious tracking**
- **Custom event tracking**

### Application Monitoring
- **Better Stack** for infrastructure monitoring
- **Checkly** for synthetic monitoring
- **Custom health checks** and alerting

## 🌐 Deployment

The application is configured for deployment on **Vercel** with:

- **Automatic deployments** from main branch
- **Preview deployments** for pull requests
- **Environment variable management**
- **Performance monitoring** and analytics

### Environment Variables Required

```bash
# Authentication
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# Database
DATABASE_URL=

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Monitoring (Optional)
NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN=
NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST=

# Security (Optional)
ARCJET_KEY=

# Application
NEXT_PUBLIC_APP_URL=
```

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch** from `main`
2. **Make your changes** following the established patterns
3. **Run quality checks**:
   ```bash
   bun run lint:fix
   bun run check:types
   bun run test
   ```
4. **Commit using conventional commits**:
   ```bash
   bun run commit
   ```
5. **Create a pull request** with descriptive title and body

### Code Standards

- **TypeScript**: Strict mode with comprehensive type safety
- **ESLint**: Comprehensive linting with auto-fix
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages
- **Component patterns**: Follow established architectural patterns

### Pre-commit Hooks

The project includes automated pre-commit hooks via **Lefthook**:
- **Linting** with auto-fix and staging
- **Type checking** for TypeScript files
- **Commit message validation**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💼 Author

**Saraansh Baranwal**
GitHub: [@saraansh](https://github.com/saraansh)

---

*Built with ❤️ using Next.js, TypeScript, and modern web technologies.*
