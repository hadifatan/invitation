# Invitation Showcase & Management Platform

## Overview

This is a full-stack web application for showcasing and managing invitation designs. The platform features a public-facing gallery where visitors can browse elegant invitation designs for various occasions (weddings, birthdays, corporate events, etc.) and share their favorites via Telegram. An admin dashboard allows authorized users to manage the invitation catalog and configure platform settings.

The application follows a modern monorepo structure with a React frontend and Express backend, using PostgreSQL for data persistence and shadcn/ui for a polished, accessible interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, configured to serve from the `client` directory
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component Strategy**
- shadcn/ui component library (New York style variant) providing pre-built, customizable components
- Radix UI primitives for accessible, unstyled UI components
- Tailwind CSS for utility-first styling with custom design tokens
- Component aliases configured for clean imports (`@/components`, `@/lib`, `@/hooks`)

**State Management**
- TanStack Query (React Query) for server state management, data fetching, and caching
- React Hook Form with Zod resolvers for form validation
- Express sessions for authentication state

**Design System**
- Custom color scheme using HSL color variables for light/dark mode support
- Typography system using DM Sans (primary), Playfair Display (display/serif), and Geist Mono (code)
- Spacing system based on Tailwind's unit scale (2, 4, 6, 8, 12, 16)
- Visual design inspired by portfolio platforms (Behance, Dribbble) for the showcase and admin dashboards (Linear, Notion) for management interface

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- Custom Vite integration for development with HMR (Hot Module Replacement)
- Session-based authentication using express-session with PostgreSQL session store (connect-pg-simple)
- Middleware logging for API requests with response time tracking

**API Design**
- RESTful API endpoints organized by resource type
- Multipart form handling with Multer for image uploads (stored in `uploads/` directory)
- Validation using Zod schemas imported from shared schema definitions
- Authentication middleware protecting admin routes

**File Upload Strategy**
- Images stored on local filesystem in `uploads/` directory
- Multer disk storage with unique filename generation (timestamp + random suffix)
- File type validation (JPEG, PNG, WebP only)
- 5MB file size limit enforced
- Images served statically via Express

### Database & ORM

**Database**
- PostgreSQL as the primary database (via Neon serverless driver)
- WebSocket-based connections using the `ws` library for Neon compatibility
- Connection pooling with pg Pool

**ORM & Schema Management**
- Drizzle ORM for type-safe database queries and schema definition
- Schema-first approach with shared TypeScript types
- Migrations managed via Drizzle Kit (output to `migrations/` directory)

**Data Models**
- **Invitations**: Core content with title, description, price, imageUrl, timestamps
- **Admin Users**: Authentication with username and bcrypt-hashed passwords
- **Settings**: Key-value configuration store (e.g., Telegram link)
- All tables use UUID primary keys generated via PostgreSQL's `gen_random_uuid()`

**Storage Layer Pattern**
- IStorage interface abstracting database operations
- DatabaseStorage implementation using Drizzle ORM
- Supports CRUD operations for all entity types
- Settings support upsert operations for configuration management

### Authentication & Authorization

**Strategy**
- Session-based authentication using express-session
- Sessions stored in PostgreSQL via connect-pg-simple
- Passwords hashed with bcrypt (salt rounds: 10)
- Session data includes `adminId` for authenticated users

**Protected Routes**
- `requireAuth` middleware checks for valid session before allowing admin access
- Unauthorized requests return 401 status
- Client-side route protection via React Query session checks
- Automatic redirect to login page for unauthenticated admin access

**Default Credentials**
- Username: `admin`
- Password: `admin123`
- Created automatically via seed script if not exists

### External Dependencies

**Core Libraries**
- `@neondatabase/serverless`: Neon PostgreSQL driver with WebSocket support
- `drizzle-orm`: TypeScript ORM for database operations
- `express`: Web server framework
- `react` & `react-dom`: UI library
- `vite`: Build tool and dev server
- `@tanstack/react-query`: Server state management

**Authentication & Security**
- `bcryptjs`: Password hashing
- `express-session`: Session management
- `connect-pg-simple`: PostgreSQL session store

**File Handling**
- `multer`: Multipart form-data handling for file uploads

**UI Components**
- `@radix-ui/*`: Accessible component primitives (20+ components)
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority`: Type-safe variant management
- `react-hook-form`: Form state management
- `zod`: Schema validation
- `lucide-react`: Icon library

**Development Tools**
- `typescript`: Type checking
- `tsx`: TypeScript execution for development
- `esbuild`: Production bundling for server code
- `@replit/vite-plugin-*`: Replit-specific development enhancements

**Third-Party Services**
- Telegram (via configurable link) for sharing invitation selections
- Neon for serverless PostgreSQL hosting