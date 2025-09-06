# AI Agent Instructions for Omarasti Repository

## Repository Overview

This is the **Omarasti** repository - a Next.js application for orienteering and track management. The project allows users to create, manage, and navigate orienteering tracks with real-time location tracking and route visualization.

## Critical Repository Structure

### ⚠️ IMPORTANT: Working Directory

**ALL PROJECT FILES ARE LOCATED IN THE `omarasti/` SUBDIRECTORY**

Before executing any commands (npm, git, file operations), you MUST first navigate to the `omarasti/` directory:

```bash
cd omarasti
```

### Directory Structure

```
/
├── README.md                    # Root readme (not the main project)
├── data/                        # Sample data files
├── data_tampere/               # Tampere-specific data and Docker setup
└── omarasti/                   # 🎯 MAIN PROJECT DIRECTORY
    ├── package.json            # Node.js dependencies and scripts
    ├── next.config.js          # Next.js configuration
    ├── tailwind.config.js      # Tailwind CSS configuration
    ├── postcss.config.js       # PostCSS configuration
    ├── tsconfig.json           # TypeScript configuration
    ├── netlify.toml            # Netlify deployment config
    ├── components/             # React components
    ├── pages/                  # Next.js pages (file-based routing)
    ├── models/                 # Data models and state management
    ├── utils/                  # Utility functions
    ├── public/                 # Static assets
    ├── styles/                 # CSS and styling files
    └── test/                   # Test files
```

## Technology Stack

- **Framework**: Next.js (React-based)
- **Language**: JavaScript/TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Recoil
- **Maps**: Leaflet/OpenStreetMap integration
- **Database**: MongoDB with Mongoose
- **Deployment**: Netlify
- **Location Services**: HTML5 Geolocation API

## Key Features

1. **Track Management**: Create and manage orienteering tracks
2. **Real-time Navigation**: GPS-based navigation with compass
3. **Route Recording**: Track and visualize running routes
4. **Marker System**: Checkpoint and finish line management
5. **Distance Calculation**: Real-time distance to targets
6. **Timer**: Track running times and performance

## Common Commands (Run from `omarasti/` directory)

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Security audit
npm audit
npm audit fix
npm audit fix --force

# Run tests
npm test
```

## File Naming Conventions

- **Pages**: Follow Next.js conventions (`pages/` directory)
- **Components**: PascalCase (e.g., `DesignMap.js`, `Layout.tsx`)
- **Utilities**: camelCase (e.g., `useAccurrateLocation.js`)
- **Dynamic Routes**: Use bracket notation (e.g., `[...default].js`)

## State Management

The application uses Recoil for state management with key atoms:

- `runState`: Current run/session state
- `trackState`: Track and marker data
- Location state managed via custom hooks

## Location Services

- Uses HTML5 Geolocation API with custom accuracy hooks
- Implements distance calculations between coordinates
- Supports real-time location updates with configurable intervals

## Development Guidelines

1. **Always work from `omarasti/` directory**
2. **Check for TypeScript errors** after making changes
3. **Test location features** require HTTPS or localhost
4. **Follow React hooks patterns** for state management
5. **Use dynamic imports** for map components (SSR considerations)

## Deployment

- Configured for Netlify deployment
- Build output goes to `.next/` directory
- Static assets served from `public/` directory

## Common Issues

1. **Directory Errors**: Ensure you're in `omarasti/` before running commands
2. **Map SSR Issues**: Use dynamic imports with `{ ssr: false }` for map components
3. **Location Permissions**: Requires user permission for geolocation
4. **Build Errors**: Check TypeScript types and import paths

## Security Notes

- Regular `npm audit` checks required
- Mongoose and PostCSS have had known vulnerabilities
- Use `npm audit fix --force` for breaking changes when needed

---

**Remember**: This repository structure is critical for proper operation. All npm commands, file operations, and development work must be performed from within the `omarasti/` subdirectory.
