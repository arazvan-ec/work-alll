# Dependencies Map - Sportian Club Management

**Feature ID**: sportian-club-management
**Document Version**: 1.0
**Created**: 2026-01-16
**Author**: Planner

---

## 1. Role Dependencies

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                         ┌──────────────┐                            │
│                         │   PLANNER    │                            │
│                         │  (Planning)  │                            │
│                         └──────┬───────┘                            │
│                                │                                     │
│                    Creates documentation                             │
│                                │                                     │
│              ┌─────────────────┼─────────────────┐                  │
│              │                 │                 │                  │
│              ▼                 ▼                 ▼                  │
│       ┌──────────┐      ┌──────────┐      ┌──────────┐            │
│       │ BACKEND  │      │ FRONTEND │      │    QA    │            │
│       │   Dev    │      │   Dev    │      │ (Review) │            │
│       └────┬─────┘      └────┬─────┘      └────┬─────┘            │
│            │                 │                  │                  │
│            │    Can work     │                  │                  │
│            │   in parallel   │                  │                  │
│            │                 │                  │                  │
│            └────────┬────────┘                  │                  │
│                     │                           │                  │
│              ┌──────┴──────┐                    │                  │
│              │ INTEGRATION │                    │                  │
│              │   Testing   │                    │                  │
│              └──────┬──────┘                    │                  │
│                     │                           │                  │
│                     └───────────────────────────┘                  │
│                                                                     │
│                         ┌──────────────┐                            │
│                         │     QA       │                            │
│                         │   APPROVAL   │                            │
│                         └──────────────┘                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Dependency Rules

| Role | Depends On | Can Work In Parallel With |
|------|------------|---------------------------|
| Planner | - | - |
| Backend | Planner (COMPLETED) | Frontend |
| Frontend | Planner (COMPLETED) | Backend |
| QA | Backend (COMPLETED), Frontend (COMPLETED) | - |

---

## 2. Backend Task Dependencies

### Phase 1: Project Setup

```
1.1 Initialize Symfony ──────┐
                             ├──▶ 1.2 Configure Doctrine ──▶ 1.3 Configure CORS
                             │
                             ▼
                    [All Phase 2 tasks]
```

### Phase 2: Domain Layer

```
2.1 Money VO ──────────────────────────────┐
                                           ├──▶ 2.2 Club Entity
                                           │         │
2.5 Domain Exceptions ─────────────────────┤         │
                                           │         ▼
                                           ├──▶ 2.3 Player Entity
                                           │         │
                                           │         ▼
                                           ├──▶ 2.4 Coach Entity
                                           │
                                           ▼
                                    2.6 Repository Interfaces
                                           │
                                           ▼
                                    2.7 Doctrine Mappings
                                           │
                                           ▼
                                    2.8 Doctrine Repositories
```

### Phase 3: Application Layer

```
[Domain Layer Complete]
           │
           ▼
    3.1 Club DTOs
           │
           ├──▶ 3.2 CreateClubUseCase
           │
           ├──▶ 3.3 GetClubUseCase
           │
           ├──▶ 3.4 UpdateClubBudgetUseCase
           │
           ├──▶ 3.5 AssignPlayerToClubUseCase ◀── 3.12 NotificationService
           │
           ├──▶ 3.6 ReleasePlayerFromClubUseCase ◀── 3.12 NotificationService
           │
           ├──▶ 3.7 AssignCoachToClubUseCase ◀── 3.12 NotificationService
           │
           ├──▶ 3.8 ReleaseCoachFromClubUseCase ◀── 3.12 NotificationService
           │
           ├──▶ 3.9 ListClubPlayersUseCase
           │
           ├──▶ 3.10 CreatePlayerUseCase ◀── 3.12 NotificationService
           │
           └──▶ 3.11 CreateCoachUseCase ◀── 3.12 NotificationService
```

### Phase 4: Infrastructure Layer

```
[Application Layer Complete]
           │
           ▼
    4.5 ExceptionListener
           │
    4.6 Configure Services
           │
           ├──▶ 4.1 ClubController
           │
           ├──▶ 4.2 PlayerController
           │
           └──▶ 4.3 CoachController
                     │
                     ▼
              4.9 Configure Mailer
                     │
                     ▼
              4.10 Create Migration
```

### Phase 5 & 6: Testing & Docker

```
[All Implementation Complete]
           │
           ▼
    5.1-5.8 Tests (can be done during implementation)
           │
           ▼
    6.1 Fixtures
           │
           ▼
    6.2-6.4 Docker & README
```

---

## 3. Frontend Task Dependencies

### Phase 1: Project Setup

```
1.1 Initialize React ──┬──▶ 1.2 Install Dependencies
                       │
                       ▼
                1.3 Configure Tailwind
                       │
                       ▼
                1.4 Configure Routing
                       │
                       ▼
                1.5 Environment Variables
```

### Phase 2: UI Components

```
[Project Setup Complete]
           │
           ▼
    2.1 Layout ──▶ 2.2 Navbar
           │
           ▼
    2.3 Button ─────────────┐
           │                 │
    2.4 Input ──────────────┤
           │                 │
    2.5 Modal ──────────────┼──▶ [All Modals in Phase 5]
           │                 │
    2.6 Table ──────────────┤
           │                 │
    2.7 Toast System ───────┤
           │                 │
    2.8 Skeleton ───────────┘
```

### Phase 3: Services & Hooks

```
[UI Components Ready]
           │
           ▼
    3.1 API Client
           │
           ├──▶ 3.2 Club Service + useClubs
           │
           ├──▶ 3.3 Player Service + usePlayers
           │
           └──▶ 3.4 Coach Service + useCoaches
```

### Phase 4: Pages

```
[Services & Hooks Ready]
           │
           ├──▶ 4.1 Dashboard ◀── Depends on all services
           │
           ├──▶ 4.2 ClubsPage ◀── useClubs
           │         │
           │         ▼
           ├──▶ 4.3 CreateClubPage ◀── useCreateClub
           │         │
           │         ▼
           ├──▶ 4.4 ClubDetailPage ◀── Depends on Phase 5 Modals
           │
           ├──▶ 4.5 PlayersPage ◀── usePlayers
           │         │
           │         ▼
           ├──▶ 4.6 CreatePlayerPage
           │         │
           │         ▼
           ├──▶ 4.7 PlayerDetailPage
           │
           └──▶ 4.8-4.10 Coach Pages (mirror player)
```

### Phase 5: Modals

```
[UI Components + Services Ready]
           │
           ├──▶ 5.1 EditBudgetModal ──────────┐
           │                                   │
           ├──▶ 5.2 AssignPlayerModal ────────┼──▶ Used by ClubDetailPage
           │                                   │
           ├──▶ 5.3 AssignCoachModal ─────────┤
           │                                   │
           ├──▶ 5.4 AssignToClubModal ────────┼──▶ Used by Player/Coach Detail
           │                                   │
           └──▶ 5.5 ConfirmationModal ────────┘
```

---

## 4. Cross-Role Dependencies

### Backend ↔ Frontend

```
BACKEND                                    FRONTEND
────────────────────────────────────────────────────────────

API Endpoint Ready                         Can integrate
POST /api/clubs           ───────────▶     CreateClubPage
GET /api/clubs            ───────────▶     ClubsPage
GET /api/clubs/:id        ───────────▶     ClubDetailPage
PATCH /api/clubs/:id/budget ─────────▶     EditBudgetModal
POST /api/clubs/:id/players/:id ─────▶     AssignPlayerModal
...

If Backend NOT ready:                      Frontend uses mocks
                          ◀───────────     MSW or fake data
```

### Frontend can work WITHOUT Backend by:

1. Using MSW (Mock Service Worker) to mock API
2. Using hardcoded data in services
3. Later replacing mocks with real API calls

**Example mock**:
```typescript
// services/clubs.service.ts (mock version)
const mockClubs = [
  { id: 1, name: 'FC Barcelona', budget: 5000000, totalSalaries: 2440000 },
  // ...
];

export const clubsService = {
  getAll: async () => {
    await delay(500); // Simulate network
    return mockClubs;
  },
  // ...
};
```

---

## 5. Critical Path

### Shortest Path to Working Feature

```
1. Planner completes documentation (CRITICAL)
   ↓
2. Backend: Phase 1 (Setup) + Phase 2 (Domain)
   │
   │  [In Parallel]
   │
   └── Frontend: Phase 1 (Setup) + Phase 2 (UI Components)
       ↓
3. Backend: Phase 3 (Application) + Phase 4 (Infrastructure)
   │
   │  [In Parallel]
   │
   └── Frontend: Phase 3 (Services with mocks) + Phase 4 (Pages)
       ↓
4. Backend: API available at localhost:8080
   │
   └── Frontend: Replace mocks with real API
       ↓
5. Integration testing
   ↓
6. QA Review
   ↓
7. APPROVED
```

### Blockers to Avoid

| Blocker | Impact | Solution |
|---------|--------|----------|
| Planner not complete | Nothing can start | Complete planning first |
| Backend API not ready | Frontend blocked | Frontend uses mocks |
| Missing API endpoint | Frontend feature blocked | Backend prioritizes endpoint |
| Business rule unclear | Implementation wrong | Ask Planner to clarify |
| Tests failing | Can't mark COMPLETED | Fix tests before moving on |

---

## 6. Communication Points

### When Backend Should Update Frontend

- [ ] API endpoint is ready for integration
- [ ] API contract changed (breaking change)
- [ ] New error codes added
- [ ] Response format changed

### When Frontend Should Update Backend

- [ ] Need additional endpoint
- [ ] Need additional data in response
- [ ] Found bug in API response
- [ ] Need query parameter support

### How to Communicate

1. Update `50_state.md` with notes
2. Add entry to "Inter-role Communication" section
3. If urgent, mark as `BLOCKED` with reason

---

## 7. Parallel Work Streams

### Stream 1: Backend Core

```
Days 1-2:  Setup + Domain Layer
Days 3-4:  Application Layer (Use Cases)
Days 5-6:  Infrastructure Layer (Controllers)
Day 7:     Testing + Docker
```

### Stream 2: Frontend Core

```
Days 1-2:  Setup + UI Components
Days 3-4:  Services (with mocks) + Hooks
Days 5-6:  Pages + Modals
Day 7:     Integration + Testing
```

### Stream 3: Integration

```
Day 7-8:   Replace mocks with real API
           Test all flows end-to-end
           Fix integration issues
```

### Stream 4: QA

```
Days 8-9:  Review code
           Run tests
           Test business rules
           Write QA report
```

---

## 8. Risk Dependencies

| Risk | Dependency | Mitigation |
|------|------------|------------|
| Backend delayed | Frontend needs API | Frontend uses mocks |
| Business rule unclear | Implementation wrong | Ask Planner immediately |
| Test coverage low | QA rejection | Write tests during dev |
| Docker issues | Can't run locally | Document setup clearly |
| CORS problems | Frontend can't call API | Configure CORS early |

---

**Document Status**: COMPLETE
**Ready for**: Executive Summary (sportian-club-management.md)
