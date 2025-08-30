# Components Organization

This directory contains all React components organized by their purpose and functionality.

## Directory Structure

### `/ui/`
ShadCN/UI components - Reusable UI components like buttons, forms, dialogs, etc.
- `button.tsx`
- `form.tsx`
- `dialog.tsx`
- `input.tsx`
- `label.tsx`
- `separator.tsx`
- `tabs.tsx`
- `textarea.tsx`
- `avatar.tsx`
- `badge.tsx`
- `card.tsx`
- `drawer.tsx`
- `dropdown-menu.tsx`

### `/layout/`
Layout-related components used across the application.
- `ThemeProvider.tsx` - Theme context provider
- `LocaleSwitcher.tsx` - Language switcher component
- `ThemeSwitcher.tsx` - Dark/light mode toggle button

### `/common/`
Common reusable components that can be used throughout the application.
- `Hello.tsx` - Welcome/greeting component
- `FloatingWhatsApp.tsx` - Floating WhatsApp contact button

### `/sections/`
Page sections used in marketing pages. Each section is broken down into smaller, focused components:

#### `/HeroSection/`
- `index.tsx` - Main container component
- `HeroContent.tsx` - Text content and call-to-action
- `HeroBackground.tsx` - Background animations and geometric elements

#### `/ProjectsSection/`
- `index.tsx` - Main container component
- `ProjectCard.tsx` - Individual project card component
- `ProjectCarousel.tsx` - Carousel with pagination, swipe gestures, and keyboard navigation
- `ProjectGrid.tsx` - Grid layout for project cards (alternative view)
- `ProjectModal.tsx` - Drawer for project details
- `projectsData.ts` - Project data and types

#### `/ContactSection/`
- `index.tsx` - Main container component
- `ContactInfo.tsx` - Contact information and business hours
- `ContactMap.tsx` - Google Maps integration

### `/QuoteSection/`
- `index.tsx` - Main container component
- `ContactForm.tsx` - Contact form with validation and submission
- `ContactStats.tsx` - Statistics and "Why Choose Us" section

#### Other Sections
- `AboutSection.tsx` - About us section
- `ServicesSection.tsx` - Services showcase section
- `TestimonialsSection.tsx` - Testimonials section
- `FooterSection.tsx` - Footer section

### `/analytics/`
Analytics-related components.
- `PostHogPageView.tsx` - PostHog page view tracking
- `PostHogProvider.tsx` - PostHog provider wrapper

## Usage

Import components using the index files for cleaner imports:

```tsx
import { Hello } from '@/components/common';
import { Hello } from '@/components/common/Hello';
// Use
import { ThemeProvider } from '@/components/layout';

// Instead of
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { ContactSection } from '@/components/sections/ContactSection';
import { ContactSection } from '@/components/sections/ContactSection/ContactForm';
```

## Component Breakdown Benefits

The large section components have been broken down into smaller, focused components for:

1. **Better Maintainability** - Each component has a single responsibility
2. **Improved Reusability** - Components can be reused across different sections
3. **Easier Testing** - Smaller components are easier to unit test
4. **Better Performance** - React can optimize re-renders for smaller components
5. **Team Collaboration** - Multiple developers can work on different components simultaneously

## Special Features

### ProjectCarousel Component
The ProjectsSection now features an advanced carousel with:

- **Responsive Pagination**:
  - Mobile: 2 projects per page (2 rows × 1 column)
  - Tablet: 4 projects per page (2 rows × 2 columns)
  - Desktop: 6 projects per page (2 rows × 3 columns)
  - Large screens: 8 projects per page (2 rows × 4 columns)
- **Navigation Buttons**: Previous/Next buttons with hover effects and proper positioning
- **Swipe Gestures**: Touch and mouse drag support for mobile and desktop
- **Keyboard Navigation**: Arrow keys, Home, and End key support
- **Page Indicators**: Visual dots showing current page and total pages
- **Accessibility**: ARIA labels and keyboard navigation hints
- **Hover UI Fixes**: Proper padding prevents card hover effects from being cut off
- **Minimalistic Cards**: Clean, focused design with essential information only

## Adding New Components

1. **UI Components**: Add to `/ui/` directory
2. **Layout Components**: Add to `/layout/` directory and update `/layout/index.ts`
3. **Common Components**: Add to `/common/` directory and update `/common/index.ts`
4. **Page Sections**:
   - For simple sections: Add to `/sections/` directory
   - For complex sections: Create a subdirectory with index.tsx and smaller components
5. **Analytics Components**: Add to `/analytics/` directory
