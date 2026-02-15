# Spatial Design Dashboard

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Lightning-fast build tool
- **React Router v7** - Client-side routing
- **Zustand 5** - Lightweight state management
- **React Three Fiber 9** - React wrapper for Three.js (3D graphics)
- **React Hook Form + Zod** - Form validation with type-safe schemas
- **Tailwind CSS v4** - Utility-first styling
- **Bun** - Package manager and runtime

## Getting Started

### Prerequisites

- **Bun** (v1.0.0 or higher) - [Install Bun](https://bun.sh)
- Node.js 18+ (for compatibility)

### Installation

```bash
# Clone the repository
cd spatial-design-dashboard

# Install dependencies with Bun
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run linting
bun run lint
```

The development server runs at `http://localhost:5173` by default.

## Project Structure

```
src/
├── api/
│   ├── mockApi.ts              # Mock API with CRUD operations
│   └── storage.ts              # localStorage abstraction layer
├── components/
│   ├── designers/
│   │   ├── DesignerList.tsx    # Grid of designer cards
│   │   ├── DesignerCard.tsx    # Single designer card display
│   │   └── AddDesignerForm.tsx # Form to add new designer
│   ├── editor/
│   │   ├── Scene3D.tsx         # 3D canvas container & interaction logic
│   │   ├── Object3D.tsx        # Individual 3D box mesh
│   │   ├── DesignerSelector.tsx # Modal for selecting designer during placement
│   │   └── ObjectPropertiesPanel.tsx # Edit object properties
│   ├── layout/
│   │   ├── Layout.tsx          # Main page layout with header
│   │   └── Navigation.tsx      # Top navigation links
│   └── ui/
│       ├── Button.tsx          # Reusable button component
│       ├── Input.tsx           # Form input with validation display
│       ├── Select.tsx          # Dropdown select input
│       └── Modal.tsx           # Dialog overlay with Escape close
├── pages/
│   ├── DesignersPage.tsx       # Designers management page
│   └── EditorPage.tsx          # 3D editor page
├── store/
│   ├── useDesignersStore.ts    # Zustand store for designers
│   └── useObjectsStore.ts      # Zustand store for 3D objects
├── types/
│   └── index.ts                # TypeScript interfaces & types
├── utils/
│   └── validation.ts           # Zod schemas for form validation
├── App.tsx                     # Root component with routing
├── main.tsx                    # Entry point with BrowserRouter
└── index.css                   # Global styles & Tailwind config
```

## Architecture & State Management

### Zustand Stores

**useDesignersStore.ts** - Manages designer data

- `designers` - Array of Designer objects
- `isLoading`, `error` - Loading and error states
- Actions: `fetchDesigners`, `addDesigner`, `updateDesigner`, `deleteDesigner`

**useObjectsStore.ts** - Manages 3D objects and selection

- `objects` - Array of Object3D instances
- `selectedObjectId` - Currently selected object ID (for gizmo)
- `isLoading`, `error` - Loading and error states
- Actions: `fetchObjects`, `addObject`, `updateObject`, `deleteObject`, `selectObject`

### Mock API

Located in `src/api/mockApi.ts`:

- CRUD operations for designers and objects
- localStorage persistence with try/catch error handling
- Fixed seed data (3 designers, 3 objects) initialized on first run
- Promise-based async interface mimics real API

### Type Safety

All data structures defined in `src/types/index.ts`:

```typescript
interface Designer {
	id: string
	fullName: string
	workingHours: number
}

interface Object3D {
	id: string
	name: string
	color: string // hex color
	size: 'small' | 'normal' | 'large'
	position: Position
	designerId: string
}

interface Position {
	x: number
	y: number
	z: number
}
```

## Form Validation

Uses **Zod v4** for runtime type checking:

- `designerSchema` - Validates designer form (name required, hours 0-168)
- `objectSchema` - Validates object properties (name, hex color, size enum, designerId)

Schemas are integrated with React Hook Form for seamless validation UI.

## Building & Deployment

### Development Build

```bash
bun run dev
```

Starts Vite dev server with HMR (hot module replacement).

### Production Build

```bash
bun run build
```

Runs TypeScript check + Vite build:

- Minifies and bundles JavaScript
- Optimizes CSS with Tailwind
- Outputs to `dist/` directory
- Bundle size: ~1.2 MB (three.js inclusion)

### Linting

```bash
bun run lint
```

Checks code quality with ESLint.
