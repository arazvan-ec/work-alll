# Frontend Tasks - Sportian Club Management

**Feature ID**: sportian-club-management
**Document Version**: 1.0
**Created**: 2026-01-16
**Author**: Planner
**Target Coverage**: >= 60%

---

## Task Overview

| Phase | Tasks | Priority |
|-------|-------|----------|
| 1. Project Setup | 5 tasks | Critical |
| 2. UI Components | 8 tasks | Critical |
| 3. Services & Hooks | 4 tasks | Critical |
| 4. Pages | 10 tasks | Critical |
| 5. Modals & Forms | 6 tasks | Critical |
| 6. Testing | 5 tasks | High |
| 7. Polish & Integration | 4 tasks | High |

**Total**: 42 tasks

---

## Phase 1: Project Setup

### Task 1.1: Initialize React Project with Vite

**Priority**: Critical

**Actions**:
```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
```

**Files Created**:
- `frontend/package.json`
- `frontend/vite.config.ts`
- `frontend/tsconfig.json`
- `frontend/index.html`
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`

**Acceptance Criteria**:
- [ ] `npm run dev` starts development server
- [ ] TypeScript configured correctly
- [ ] No errors in browser console

---

### Task 1.2: Install Dependencies

**Priority**: Critical

**Actions**:
```bash
npm install react-router-dom @tanstack/react-query axios react-hook-form zod @hookform/resolvers
npm install -D tailwindcss postcss autoprefixer @types/react @types/react-dom
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

**Dependencies**:
- `react-router-dom` - Routing
- `@tanstack/react-query` - Server state management
- `axios` - HTTP client
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@hookform/resolvers` - Zod integration
- `tailwindcss` - Styling

**Dev Dependencies**:
- `vitest` - Test runner
- `@testing-library/react` - React testing utilities

---

### Task 1.3: Configure TailwindCSS

**Priority**: Critical

**Actions**:
```bash
npx tailwindcss init -p
```

**File**: `frontend/tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**File**: `frontend/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Acceptance Criteria**:
- [ ] Tailwind classes work in components
- [ ] Hot reload works with style changes

---

### Task 1.4: Configure Routing

**Priority**: Critical

**File**: `frontend/src/App.tsx`
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ClubsPage from './pages/clubs/ClubsPage';
import CreateClubPage from './pages/clubs/CreateClubPage';
import ClubDetailPage from './pages/clubs/ClubDetailPage';
import PlayersPage from './pages/players/PlayersPage';
import CreatePlayerPage from './pages/players/CreatePlayerPage';
import PlayerDetailPage from './pages/players/PlayerDetailPage';
import CoachesPage from './pages/coaches/CoachesPage';
import CreateCoachPage from './pages/coaches/CreateCoachPage';
import CoachDetailPage from './pages/coaches/CoachDetailPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clubs" element={<ClubsPage />} />
            <Route path="clubs/new" element={<CreateClubPage />} />
            <Route path="clubs/:id" element={<ClubDetailPage />} />
            <Route path="players" element={<PlayersPage />} />
            <Route path="players/new" element={<CreatePlayerPage />} />
            <Route path="players/:id" element={<PlayerDetailPage />} />
            <Route path="coaches" element={<CoachesPage />} />
            <Route path="coaches/new" element={<CreateCoachPage />} />
            <Route path="coaches/:id" element={<CoachDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

**Acceptance Criteria**:
- [ ] All routes accessible
- [ ] React Query provider configured
- [ ] Layout wraps all pages

---

### Task 1.5: Configure Environment Variables

**Priority**: Critical

**File**: `frontend/.env.example`
```
VITE_API_URL=http://localhost:8080/api
```

**File**: `frontend/.env`
```
VITE_API_URL=http://localhost:8080/api
```

**Usage**:
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Phase 2: UI Components

### Task 2.1: Create Layout Component

**Priority**: Critical
**File**: `frontend/src/components/layout/Layout.tsx`

```typescript
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

---

### Task 2.2: Create Navbar Component

**Priority**: Critical
**File**: `frontend/src/components/layout/Navbar.tsx`

**Requirements**:
- Logo/Brand "SPORTIAN"
- Navigation links: Dashboard, Clubs, Players, Coaches
- Active link highlighting
- Responsive (hamburger menu on mobile)

```typescript
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-blue-700 text-white'
        : 'text-gray-300 hover:bg-blue-600 hover:text-white'
    }`;

  return (
    <nav className="bg-blue-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white font-bold text-xl">SPORTIAN</span>
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/clubs" className={linkClass}>Clubs</NavLink>
              <NavLink to="/players" className={linkClass}>Players</NavLink>
              <NavLink to="/coaches" className={linkClass}>Coaches</NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

---

### Task 2.3: Create Button Component

**Priority**: Critical
**File**: `frontend/src/components/ui/Button.tsx`

**Requirements**:
- Variants: primary, secondary, danger
- Sizes: sm, md, lg
- Loading state with spinner
- Disabled state

```typescript
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
```

---

### Task 2.4: Create Input Component

**Priority**: Critical
**File**: `frontend/src/components/ui/Input.tsx`

**Requirements**:
- Label support
- Error message display
- Currency formatting option
- Integration with react-hook-form

```typescript
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
```

---

### Task 2.5: Create Modal Component

**Priority**: Critical
**File**: `frontend/src/components/ui/Modal.tsx`

**Requirements**:
- Backdrop overlay
- Close on X button
- Close on backdrop click (optional)
- Header, body, footer sections
- Trap focus inside modal

```typescript
import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
```

---

### Task 2.6: Create Table Component

**Priority**: Critical
**File**: `frontend/src/components/ui/Table.tsx`

**Requirements**:
- Generic table with typed columns
- Clickable rows (optional)
- Responsive design (cards on mobile)

---

### Task 2.7: Create Toast/Notification System

**Priority**: Critical
**Files**:
- `frontend/src/components/ui/Toast.tsx`
- `frontend/src/hooks/useToast.ts`
- `frontend/src/context/ToastContext.tsx`

**Requirements**:
- Success, error, warning, info variants
- Auto-dismiss after 5 seconds
- Stack multiple toasts
- Position: top-right

```typescript
// hooks/useToast.ts
import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 5000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const useToast = () => {
  const { addToast } = useToastStore();
  return {
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    warning: (message: string) => addToast('warning', message),
    info: (message: string) => addToast('info', message),
  };
};
```

---

### Task 2.8: Create Skeleton Loader

**Priority**: High
**File**: `frontend/src/components/ui/Skeleton.tsx`

```typescript
interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
    />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}
```

---

## Phase 3: Services & Hooks

### Task 3.1: Create API Client

**Priority**: Critical
**File**: `frontend/src/services/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response) {
      const { status, data } = error.response;
      console.error(`API Error [${status}]:`, data.error);
    } else {
      console.error('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### Task 3.2: Create Club Service & Hooks

**Priority**: Critical

**File**: `frontend/src/services/clubs.service.ts`
```typescript
import api from './api';
import { Club, CreateClubDTO, AssignMemberDTO } from '@/types/club';
import { PaginatedResponse, Player } from '@/types';

export const clubsService = {
  getAll: async (): Promise<Club[]> => {
    const { data } = await api.get('/clubs');
    return data.data || data;
  },

  getById: async (id: number): Promise<Club> => {
    const { data } = await api.get(`/clubs/${id}`);
    return data;
  },

  create: async (dto: CreateClubDTO): Promise<Club> => {
    const { data } = await api.post('/clubs', dto);
    return data;
  },

  updateBudget: async (id: number, budget: number): Promise<Club> => {
    const { data } = await api.patch(`/clubs/${id}/budget`, { budget });
    return data;
  },

  assignPlayer: async (clubId: number, playerId: number, salary: number): Promise<Player> => {
    const { data } = await api.post(`/clubs/${clubId}/players/${playerId}`, { salary });
    return data;
  },

  releasePlayer: async (clubId: number, playerId: number): Promise<Player> => {
    const { data } = await api.delete(`/clubs/${clubId}/players/${playerId}`);
    return data;
  },

  assignCoach: async (clubId: number, coachId: number, salary: number) => {
    const { data } = await api.post(`/clubs/${clubId}/coaches/${coachId}`, { salary });
    return data;
  },

  releaseCoach: async (clubId: number, coachId: number) => {
    const { data } = await api.delete(`/clubs/${clubId}/coaches/${coachId}`);
    return data;
  },

  getPlayers: async (clubId: number, params?: { name?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Player>> => {
    const { data } = await api.get(`/clubs/${clubId}/players`, { params });
    return data;
  },
};
```

**File**: `frontend/src/hooks/useClubs.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubsService } from '@/services/clubs.service';
import { useToast } from './useToast';

export const useClubs = () => {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: clubsService.getAll,
  });
};

export const useClub = (id: number) => {
  return useQuery({
    queryKey: ['clubs', id],
    queryFn: () => clubsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateClub = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: clubsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast.success('Club created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create club');
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, budget }: { id: number; budget: number }) =>
      clubsService.updateBudget(id, budget),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clubs', id] });
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast.success('Budget updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update budget');
    },
  });
};

export const useAssignPlayer = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ clubId, playerId, salary }: { clubId: number; playerId: number; salary: number }) =>
      clubsService.assignPlayer(clubId, playerId, salary),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: ['clubs', clubId] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast.success('Player assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to assign player');
    },
  });
};

export const useReleasePlayer = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ clubId, playerId }: { clubId: number; playerId: number }) =>
      clubsService.releasePlayer(clubId, playerId),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: ['clubs', clubId] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast.success('Player released successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to release player');
    },
  });
};
```

---

### Task 3.3: Create Player Service & Hooks

**Priority**: Critical

**File**: `frontend/src/services/players.service.ts`
**File**: `frontend/src/hooks/usePlayers.ts`

Same pattern as clubs.

---

### Task 3.4: Create Coach Service & Hooks

**Priority**: Critical

**File**: `frontend/src/services/coaches.service.ts`
**File**: `frontend/src/hooks/useCoaches.ts`

Same pattern as clubs.

---

## Phase 4: Pages

### Task 4.1: Create Dashboard Page

**Priority**: Critical
**File**: `frontend/src/pages/Dashboard.tsx`

**Requirements**:
- Metric cards: Total clubs, players (free/hired), coaches (free/hired), total budget
- Quick action buttons: New Club, New Player, New Coach
- Clubs overview table

**Data Requirements**:
- GET `/api/dashboard/stats` or calculate from clubs/players/coaches

---

### Task 4.2: Create Clubs List Page

**Priority**: Critical
**File**: `frontend/src/pages/clubs/ClubsPage.tsx`

**Requirements**:
- Table with: Name, Budget, Salaries, Available Budget
- "New Club" button
- Click row to navigate to detail
- Loading skeleton

---

### Task 4.3: Create Club Page

**Priority**: Critical
**File**: `frontend/src/pages/clubs/CreateClubPage.tsx`

**Requirements**:
- Back button to `/clubs`
- Form with name and budget fields
- Validation using Zod
- Submit creates club and redirects to detail

**Zod Schema**:
```typescript
import { z } from 'zod';

export const createClubSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  budget: z.number().positive('Budget must be greater than 0'),
});
```

---

### Task 4.4: Create Club Detail Page

**Priority**: Critical
**File**: `frontend/src/pages/clubs/ClubDetailPage.tsx`

**Requirements**:
- Club header with name and stats (budget, salaries, available)
- "Edit Budget" button opens modal
- Tabs: Players / Coaches
- Players table with "Release" action
- "Assign Player" button opens modal
- Coaches table with "Release" action
- "Assign Coach" button opens modal
- Budget availability indicator (green/yellow/red)

---

### Task 4.5: Create Players List Page

**Priority**: Critical
**File**: `frontend/src/pages/players/PlayersPage.tsx`

**Requirements**:
- Search input for name filter
- Status filter dropdown (All/Free/Hired)
- Table with: Name, Club, Salary, Status
- Pagination controls
- "New Player" button
- Click row to navigate to detail

---

### Task 4.6: Create Player Page

**Priority**: Critical
**File**: `frontend/src/pages/players/CreatePlayerPage.tsx`

**Requirements**:
- Back button
- Form with name field only
- Info: "Player will be created as free agent"
- Validation and submit

---

### Task 4.7: Create Player Detail Page

**Priority**: Critical
**File**: `frontend/src/pages/players/PlayerDetailPage.tsx`

**Requirements**:
- Player info: Name, Status badge
- If FREE: "Assign to Club" button → Opens AssignPlayerToClubModal
- If HIRED: Show club name (link), salary, "Release" button

---

### Task 4.8: Create Coaches List Page

**Priority**: Critical
**File**: `frontend/src/pages/coaches/CoachesPage.tsx`

Mirror of PlayersPage.

---

### Task 4.9: Create Coach Page

**Priority**: Critical
**File**: `frontend/src/pages/coaches/CreateCoachPage.tsx`

Mirror of CreatePlayerPage.

---

### Task 4.10: Create Coach Detail Page

**Priority**: Critical
**File**: `frontend/src/pages/coaches/CoachDetailPage.tsx`

Mirror of PlayerDetailPage.

---

## Phase 5: Modals & Forms

### Task 5.1: Create EditBudgetModal

**Priority**: Critical
**File**: `frontend/src/components/clubs/EditBudgetModal.tsx`

**Requirements**:
- Show current budget and current salaries
- Input for new budget
- Real-time validation: new budget >= current salaries
- Warning message if reducing budget
- Disabled save button if invalid
- On success: close modal, refetch club data

**Props**:
```typescript
interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club;
}
```

---

### Task 5.2: Create AssignPlayerModal

**Priority**: Critical
**File**: `frontend/src/components/clubs/AssignPlayerModal.tsx`

**Requirements**:
- Show available budget
- Dropdown of free players only
- Salary input
- Real-time calculation: "Available after: €X"
- Validation: salary <= available budget
- Error message if exceeds budget
- Disabled assign button if invalid

**Props**:
```typescript
interface AssignPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club;
}
```

---

### Task 5.3: Create AssignCoachModal

**Priority**: Critical
**File**: `frontend/src/components/clubs/AssignCoachModal.tsx`

Mirror of AssignPlayerModal.

---

### Task 5.4: Create AssignToClubModal (from Player/Coach detail)

**Priority**: High
**File**: `frontend/src/components/players/AssignToClubModal.tsx`

**Requirements**:
- Dropdown of all clubs (show available budget)
- Salary input
- Show selected club's available budget
- Validation
- Used from player/coach detail page

---

### Task 5.5: Create ConfirmationModal

**Priority**: Critical
**File**: `frontend/src/components/ui/ConfirmationModal.tsx`

**Requirements**:
- Generic confirmation dialog
- Title, message, confirm button text
- Danger variant for destructive actions

```typescript
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
}
```

---

### Task 5.6: Create Form Components

**Priority**: High

**Files**:
- `frontend/src/components/clubs/ClubForm.tsx`
- `frontend/src/components/players/PlayerForm.tsx`
- `frontend/src/components/coaches/CoachForm.tsx`

**Reusable form components with react-hook-form integration**.

---

## Phase 6: Testing

### Task 6.1: Configure Vitest

**Priority**: High
**File**: `frontend/vite.config.ts`

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/tests/'],
    },
  },
});
```

**File**: `frontend/src/tests/setup.ts`
```typescript
import '@testing-library/jest-dom';
```

---

### Task 6.2: Test UI Components

**Priority**: High

**Files**:
- `frontend/src/tests/components/Button.test.tsx`
- `frontend/src/tests/components/Input.test.tsx`
- `frontend/src/tests/components/Modal.test.tsx`

**Test Cases**:
- Renders correctly
- Handles click events
- Shows loading state
- Disabled state works
- Error messages display

---

### Task 6.3: Test Forms

**Priority**: High

**Files**:
- `frontend/src/tests/components/ClubForm.test.tsx`
- `frontend/src/tests/components/EditBudgetModal.test.tsx`

**Test Cases**:
- Validation shows errors
- Submit with valid data works
- Budget validation (RN-2) in modal
- Salary validation in assign modal

---

### Task 6.4: Test Hooks

**Priority**: High

**File**: `frontend/src/tests/hooks/useClubs.test.tsx`

**Use MSW to mock API responses**.

---

### Task 6.5: Integration Tests

**Priority**: High

**File**: `frontend/src/tests/integration/ClubFlow.test.tsx`

**Test user flows**:
- Create club → See in list
- Open club → See players
- Assign player → Budget updates
- Release player → Player becomes free

---

## Phase 7: Polish & Integration

### Task 7.1: Add Loading States

**Priority**: High

Ensure all pages and modals show:
- Skeleton loaders while fetching
- Spinners on buttons during mutations
- Disable form during submission

---

### Task 7.2: Add Error Handling

**Priority**: High

**Requirements**:
- Toast notifications for all API errors
- Specific messages for 409 and 422 errors
- Network error handling
- 404 pages for not found resources

---

### Task 7.3: Responsive Design

**Priority**: High

**Requirements**:
- Tables become cards on mobile
- Modal widths adjust
- Navigation becomes hamburger menu
- Touch-friendly buttons

---

### Task 7.4: Final Integration Testing

**Priority**: Critical

**Manual testing checklist**:
- [ ] Create club works
- [ ] Edit budget with validation
- [ ] Assign player with budget check
- [ ] Release player
- [ ] Create player (free)
- [ ] Assign coach
- [ ] Release coach
- [ ] Create coach (free)
- [ ] Pagination works
- [ ] Filters work
- [ ] Navigation works
- [ ] Responsive on mobile
- [ ] Error toasts show correctly
- [ ] Success toasts show correctly

---

## Verification Checklist

### Before Marking COMPLETED

- [ ] All 10 pages implemented and navigable
- [ ] All CRUD operations work from UI
- [ ] All modals functional
- [ ] Validations showing in real-time
- [ ] Loading states implemented
- [ ] Error handling with toasts
- [ ] Responsive design (mobile + desktop)
- [ ] Tests passing with >= 60% coverage
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No critical ESLint warnings

### Commands to Verify

```bash
# Run dev server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

**Document Status**: COMPLETE
**Ready for**: QA Tasks (32_tasks_qa.md)
