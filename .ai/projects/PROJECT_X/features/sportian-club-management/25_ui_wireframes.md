# UI Wireframes & Flows - Sportian Club Management

**Feature ID**: sportian-club-management
**Document Version**: 1.0
**Created**: 2026-01-16
**Author**: Planner

---

## 1. Navigation Structure

```
┌────────────────────────────────────────────────────────────────────┐
│  SPORTIAN                    [Dashboard] [Clubs] [Players] [Coaches] │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                         [MAIN CONTENT AREA]                         │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

**Routes**:
- `/` - Dashboard
- `/clubs` - Lista de clubes
- `/clubs/new` - Crear club
- `/clubs/:id` - Detalle de club
- `/players` - Lista de jugadores
- `/players/new` - Crear jugador
- `/players/:id` - Detalle de jugador
- `/coaches` - Lista de entrenadores
- `/coaches/new` - Crear entrenador
- `/coaches/:id` - Detalle de entrenador

---

## 2. Dashboard Page (`/`)

### 2.1 Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  DASHBOARD                                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │   CLUBS     │  │  PLAYERS    │  │  COACHES    │  │  BUDGET   │ │
│  │     3       │  │    15       │  │     5       │  │ €15.5M    │ │
│  │             │  │ (6 free)    │  │ (2 free)    │  │ total     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  QUICK ACTIONS                                                │ │
│  │  [+ New Club]  [+ New Player]  [+ New Coach]                 │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  CLUBS OVERVIEW                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Club Name        │ Budget    │ Salaries  │ Available   │ │ │
│  │  ├─────────────────────────────────────────────────────────┤ │ │
│  │  │ FC Barcelona     │ €5M       │ €2.44M    │ €2.56M      │ │ │
│  │  │ Real Madrid      │ €6M       │ €3.48M    │ €2.52M      │ │ │
│  │  │ Manchester Utd   │ €4.5M     │ €2.28M    │ €2.22M      │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Components

- **MetricCard**: Shows count/total with label
- **QuickActions**: Buttons linking to create forms
- **ClubsOverviewTable**: Simple table with budget info

### 2.3 Data Requirements

- GET `/api/dashboard/stats`
- GET `/api/clubs` (for overview table)

---

## 3. Clubs List Page (`/clubs`)

### 3.1 Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  CLUBS                                              [+ New Club]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Club Name          │ Budget     │ Salaries   │ Available     │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │ FC Barcelona  →    │ €5,000,000 │ €2,440,000 │ €2,560,000   │ │
│  │ Real Madrid   →    │ €6,000,000 │ €3,480,000 │ €2,520,000   │ │
│  │ Manchester Utd →   │ €4,500,000 │ €2,280,000 │ €2,220,000   │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  → Click row to view club details                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Components

- **PageHeader**: Title + primary action button
- **ClubsTable**: Clickable rows, budget columns
- **BudgetIndicator**: Color-coded available budget

### 3.3 Interactions

- Click row → Navigate to `/clubs/:id`
- Click "New Club" → Navigate to `/clubs/new`

---

## 4. Create Club Page (`/clubs/new`)

### 4.1 Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Clubs                                                    │
│                                                                     │
│  CREATE NEW CLUB                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │  Club Name *                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ FC Liverpool                                            │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │  Must be 3-100 characters                                     │ │
│  │                                                               │ │
│  │  Budget *                                                     │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ € 3,000,000                                             │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │  Initial budget for salaries (must be > 0)                    │ │
│  │                                                               │ │
│  │                              [Cancel]  [Create Club]          │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Components

- **BackButton**: Navigate to `/clubs`
- **ClubForm**: Name + Budget fields
- **SubmitButton**: Create Club (with loading state)

### 4.3 Validation

- Name: Required, 3-100 chars
- Budget: Required, > 0

### 4.4 Success Flow

1. User fills form
2. Click "Create Club"
3. POST `/api/clubs`
4. Show success toast
5. Navigate to `/clubs/:newId`

---

## 5. Club Detail Page (`/clubs/:id`)

### 5.1 Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Clubs                                                    │
│                                                                     │
│  FC BARCELONA                                  [Edit Budget]        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │ BUDGET          │  │ TOTAL SALARIES  │  │ AVAILABLE       │    │
│  │ €5,000,000      │  │ €2,440,000      │  │ €2,560,000 ✓   │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ [Players (3)]  [Coaches (1)]                                  │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │  PLAYERS                                    [+ Assign Player] │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Name              │ Salary      │ Actions               │ │ │
│  │  ├─────────────────────────────────────────────────────────┤ │ │
│  │  │ Lionel Messi      │ €1,500,000  │ [Release]            │ │ │
│  │  │ Pedri             │ €500,000    │ [Release]            │ │ │
│  │  │ Gavi              │ €400,000    │ [Release]            │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Components

- **ClubHeader**: Name + Edit Budget button
- **BudgetStats**: Three stat cards
- **Tabs**: Players / Coaches
- **MembersTable**: Name, Salary, Release action

### 5.3 Interactions

- Click "Edit Budget" → Open EditBudgetModal
- Click "Assign Player" → Open AssignPlayerModal
- Click "Release" → Open ConfirmationModal → Release player

---

## 6. Edit Budget Modal

### 6.1 Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  EDIT BUDGET                                            [X]   │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │  Current Budget: €5,000,000                                   │ │
│  │  Current Salaries: €2,440,000                                 │ │
│  │  ───────────────────────────────────                          │ │
│  │                                                               │ │
│  │  New Budget *                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ € 6,000,000                                             │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ⚠️ Budget cannot be lower than €2,440,000 (current salaries)│ │
│  │                                                               │ │
│  │                              [Cancel]  [Save Budget]          │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Validation

- Budget must be >= current salaries (RN-2)
- Show warning if reducing budget
- Disable save if invalid

---

## 7. Assign Player Modal

### 7.1 Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  ASSIGN PLAYER TO FC BARCELONA                          [X]   │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │  Available Budget: €2,560,000                                 │ │
│  │  ───────────────────────────────────                          │ │
│  │                                                               │ │
│  │  Select Player *                                              │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ ▼ Neymar Jr                                             │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │  Only showing free players                                    │ │
│  │                                                               │ │
│  │  Salary *                                                     │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ € 2,000,000                                             │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ After assignment:                                       │ │ │
│  │  │ Available: €2,560,000 - €2,000,000 = €560,000 ✓        │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │                              [Cancel]  [Assign Player]        │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Real-time Calculation

- Show available budget
- Calculate remaining after assignment
- Disable "Assign" if salary > available
- Show error if exceeds budget

### 7.3 Validation

- Player selection required
- Salary >= 0
- Salary <= available budget (RN-1)

---

## 8. Confirmation Modal

### 8.1 Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  CONFIRM RELEASE                                        [X]   │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │  ⚠️ Are you sure you want to release Lionel Messi?           │ │
│  │                                                               │ │
│  │  The player will become a free agent and their salary         │ │
│  │  (€1,500,000) will be freed from the club's budget.          │ │
│  │                                                               │ │
│  │                              [Cancel]  [Release Player]       │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Players List Page (`/players`)

### 9.1 Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  PLAYERS                                            [+ New Player]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────┐  ┌───────────────────────────────┐  │
│  │ Search: [_______________] │  │ Status: [All ▼]               │  │
│  └───────────────────────────┘  └───────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Name              │ Club              │ Salary      │ Status  │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │ Lionel Messi  →   │ FC Barcelona      │ €1,500,000  │ Hired   │ │
│  │ Pedri         →   │ FC Barcelona      │ €500,000    │ Hired   │ │
│  │ Neymar Jr     →   │ -                 │ -           │ Free    │ │
│  │ Kylian Mbappé →   │ -                 │ -           │ Free    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Showing 1-10 of 15      [< Prev]  [1] [2]  [Next >]               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 Components

- **SearchInput**: Filter by name
- **StatusFilter**: All / Free / Hired
- **PlayersTable**: Clickable rows
- **Pagination**: Page controls

### 9.3 Data Requirements

- GET `/api/players?name=X&status=free&page=1&limit=10`

---

## 10. Create Player Page (`/players/new`)

### 10.1 Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Players                                                  │
│                                                                     │
│  CREATE NEW PLAYER                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │  Player Name *                                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Harry Kane                                              │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │  Must be 3-100 characters                                     │ │
│  │                                                               │ │
│  │  ℹ️ Player will be created as free agent (no club)           │ │
│  │                                                               │ │
│  │                              [Cancel]  [Create Player]        │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 11. Player Detail Page (`/players/:id`)

### 11.1 Wireframe - Free Player

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Players                                                  │
│                                                                     │
│  NEYMAR JR                                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │  Status: 🟢 FREE AGENT                                        │ │
│  │                                                               │ │
│  │  This player is not associated with any club.                 │ │
│  │                                                               │ │
│  │                                        [Assign to Club]       │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.2 Wireframe - Hired Player

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Players                                                  │
│                                                                     │
│  LIONEL MESSI                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │  Status: 🔵 HIRED                                             │ │
│  │                                                               │ │
│  │  Club: FC Barcelona  →                                        │ │
│  │  Salary: €1,500,000                                           │ │
│  │                                                               │ │
│  │                                        [Release from Club]    │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.3 Interactions

- Free player: "Assign to Club" → Open modal with club selection + salary
- Hired player: "Release from Club" → Confirmation modal

---

## 12. Coach Pages

Coach pages follow the **same structure** as Player pages:

- `/coaches` - List with search and pagination
- `/coaches/new` - Create coach form
- `/coaches/:id` - Detail with status and actions

---

## 13. Toast Notifications

### 13.1 Success Toast

```
┌────────────────────────────────────────┐
│ ✓ Player created successfully          │
└────────────────────────────────────────┘
```

### 13.2 Error Toast

```
┌────────────────────────────────────────┐
│ ✗ Budget exceeded. Available: €560,000 │
└────────────────────────────────────────┘
```

### 13.3 Toast Placement

- Top-right corner
- Auto-dismiss after 5 seconds
- Stack multiple toasts

---

## 14. Loading States

### 14.1 Skeleton Loader (Tables)

```
┌───────────────────────────────────────────────────────────────┐
│ ████████████  │ █████████  │ █████████  │ ████████           │
│ ██████████    │ █████████  │ █████████  │ ████████           │
│ ████████████  │ █████████  │ █████████  │ ████████           │
└───────────────────────────────────────────────────────────────┘
```

### 14.2 Button Loading

```
┌──────────────────────┐
│ [⟳ Creating...]      │  (disabled)
└──────────────────────┘
```

---

## 15. Responsive Design

### 15.1 Mobile Table → Cards

```
Desktop:
┌───────────────────────────────────────────────────────────────┐
│ Name        │ Club           │ Salary     │ Status           │
├───────────────────────────────────────────────────────────────┤
│ Messi       │ FC Barcelona   │ €1.5M      │ Hired            │
└───────────────────────────────────────────────────────────────┘

Mobile:
┌─────────────────────────────┐
│ Lionel Messi                │
│ FC Barcelona                │
│ €1,500,000   [Hired]        │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Neymar Jr                   │
│ No club                     │
│ -            [Free]         │
└─────────────────────────────┘
```

### 15.2 Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 16. User Flows

### 16.1 Create Club and Hire Player

```
1. Dashboard → Click "New Club"
2. Fill name: "FC Liverpool", budget: €3,000,000
3. Click "Create Club" → Success toast → Redirect to /clubs/4
4. On club detail, click "Assign Player"
5. Select "Neymar Jr" from dropdown
6. Enter salary: €2,000,000
7. See calculation: Available after: €1,000,000 ✓
8. Click "Assign Player"
9. Success toast → Table updates with new player
```

### 16.2 Budget Reduction Blocked

```
1. Navigate to /clubs/1 (FC Barcelona)
2. Click "Edit Budget"
3. Current: €5,000,000, Salaries: €2,440,000
4. Enter new budget: €2,000,000
5. See error: "Budget cannot be lower than €2,440,000"
6. Button disabled
7. Change to €2,500,000
8. Button enabled → Click "Save"
9. Success toast → Budget updated
```

### 16.3 Hire Player Exceeds Budget

```
1. Navigate to /clubs/1 (Available: €2,560,000)
2. Click "Assign Player"
3. Select "Erling Haaland"
4. Enter salary: €3,000,000
5. See error: "Exceeds available budget by €440,000"
6. Assign button disabled
7. Change to €2,500,000
8. Calculation shows: Available after: €60,000 ✓
9. Click "Assign" → Success
```

---

**Document Status**: COMPLETE
**Ready for**: Backend Tasks (30_tasks_backend.md)
