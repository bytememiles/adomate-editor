# Adomate Editor

A modern, desktop-focused editor built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** with strict configuration
- **Tailwind CSS v4** with custom color palette
- **Redux Toolkit** for state management
- **Konva & React Konva** for canvas graphics
- **ESLint** with comprehensive rules
- **Prettier** for code formatting
- **Husky** for Git hooks
- **GitHub Actions** CI/CD

## 🛠️ Development Setup

### Prerequisites

- Node.js 18.20.8 (see `.nvmrc`)
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd adomate-editor

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn typecheck    # Run TypeScript type checking
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues
yarn format       # Format code with Prettier
yarn format:check # Check code formatting
```

## 📁 Project Structure

```
src/
├── app/          # Next.js App Router pages
├── components/   # React components
├── lib/          # Library configurations
├── styles/       # Global styles and CSS modules
├── types/        # TypeScript type definitions
└── utils/        # Utility functions

Path Aliases:
- @/app/* → src/app/*
- @/components/* → src/components/*
- @/lib/* → src/lib/*
- @/styles/* → src/styles/*
- @/types/* → src/types/*
- @/utils/* → src/utils/*
```

## 🔧 Configuration

### TypeScript

- Strict mode enabled
- No unchecked indexed access
- Exact optional property types
- No fallthrough cases in switch
- Comprehensive path aliases

### ESLint

- Next.js recommended rules
- TypeScript-specific rules
- Import organization and sorting
- Circular dependency prevention
- Named exports preferred (except React components)

### Prettier

- 100 character line width
- Single quotes
- Trailing commas
- Bracket spacing

### Git Hooks

- Pre-commit: Runs linting and formatting
- Ensures code quality before commits

## 🚦 CI/CD

GitHub Actions workflow runs on:

- Push to main/develop branches
- Pull requests to main/develop branches

Checks:

- TypeScript compilation
- ESLint validation
- Prettier formatting
- Build verification

## 🎨 Design System

### Color Palette

- **Primary**: Soft grays (#f8fafc to #0f172a)
- **Accent**: Blue tones (#f0f9ff to #0c4a6e)
- **Background**: Light gray (#f8fafc)
- **Foreground**: Dark gray (#334155)

### Responsive Design

- Desktop-only application (min-width: 1024px)
- Mobile users see desktop-only warning
- Optimized for large screens

## 📝 Development Guidelines

### Code Style

1. Use TypeScript strict mode
2. Prefer named exports over default exports
3. Organize imports by type and alphabetically
4. Use path aliases for imports
5. Follow ESLint and Prettier configurations

### Import Organization

```typescript
// Built-in modules
import React from 'react';

// External dependencies
import { Stage, Layer } from 'react-konva';

// Internal types
import type { CanvasElement } from '@/types';

// Internal utilities
import { createNewElement } from '@/utils/helpers';
```

### Component Structure

```typescript
import React from 'react';

import type { ComponentProps } from '@/types';

interface ComponentProps {
  // Props interface
}

export const Component: React.FC<ComponentProps> = ({ prop }) => {
  // Component implementation
};
```

## 🔍 Quality Assurance

### Pre-commit Checks

- TypeScript compilation
- ESLint validation
- Prettier formatting
- No circular dependencies

### Continuous Integration

- Automated testing on every PR
- Build verification
- Code quality checks
- Artifact generation

## 📚 Dependencies

### Core

- Next.js 15.4.6
- React 19.1.0
- TypeScript 5.9.2

### State Management

- Redux Toolkit 2.8.2
- React Redux 9.2.0

### Graphics

- Konva 9.3.22
- React Konva 19.0.7

### Utilities

- Zod 4.0.17 (Schema validation)
- Nanoid 5.1.5 (ID generation)
- Clsx 2.1.1 (Conditional classes)

### Development

- ESLint 9.33.0
- Prettier 3.6.2
- Husky 8.0.3
- Lint-staged 13.3.0

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all checks pass
5. Submit a pull request

## 📄 License

This project is private and proprietary.
