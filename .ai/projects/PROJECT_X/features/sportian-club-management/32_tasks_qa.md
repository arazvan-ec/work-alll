# QA Tasks - Sportian Club Management

**Feature ID**: sportian-club-management
**Document Version**: 1.0
**Created**: 2026-01-16
**Author**: Planner

---

## QA Overview

| Category | Tasks | Priority |
|----------|-------|----------|
| Backend Review | 6 tasks | Critical |
| Frontend Review | 6 tasks | Critical |
| Integration Testing | 5 tasks | Critical |
| Business Rules | 4 tasks | Critical |
| Documentation | 3 tasks | High |

**Total**: 24 tasks

---

## Prerequisites for QA

Before starting QA:
1. Wait for Planner status: `COMPLETED`
2. Wait for Backend status: `COMPLETED`
3. Wait for Frontend status: `COMPLETED`
4. Read all planning documentation
5. Setup local environment

---

## Phase 1: Backend Review

### Task 1.1: Review Backend Code Structure

**Priority**: Critical

**Checklist**:
- [ ] DDD architecture correctly implemented
  - [ ] Domain layer has entities, value objects, repository interfaces
  - [ ] Application layer has use cases, DTOs
  - [ ] Infrastructure layer has Doctrine repos, controllers
- [ ] No business logic in controllers
- [ ] No infrastructure dependencies in Domain layer
- [ ] Repository interfaces in Domain, implementations in Infrastructure
- [ ] Money value object used for budget and salary

**Files to Review**:
```
backend/src/Domain/
backend/src/Application/
backend/src/Infrastructure/
```

---

### Task 1.2: Run Backend Tests

**Priority**: Critical

**Commands**:
```bash
cd backend
./vendor/bin/phpunit
./vendor/bin/phpunit --coverage-html var/coverage
```

**Acceptance Criteria**:
- [ ] All tests pass (green)
- [ ] Coverage >= 70%
- [ ] No skipped tests without reason

**Coverage Report Location**: `backend/var/coverage/index.html`

---

### Task 1.3: Validate API Contracts

**Priority**: Critical

**Test each endpoint manually**:

```bash
# Create Club
curl -X POST http://localhost:8080/api/clubs \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Club", "budget": 1000000}'

# Get Club
curl http://localhost:8080/api/clubs/1

# List Clubs
curl http://localhost:8080/api/clubs

# Update Budget
curl -X PATCH http://localhost:8080/api/clubs/1/budget \
  -H "Content-Type: application/json" \
  -d '{"budget": 1500000}'

# Create Player
curl -X POST http://localhost:8080/api/players \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Player"}'

# Assign Player
curl -X POST http://localhost:8080/api/clubs/1/players/1 \
  -H "Content-Type: application/json" \
  -d '{"salary": 100000}'

# Release Player
curl -X DELETE http://localhost:8080/api/clubs/1/players/1

# List Club Players
curl "http://localhost:8080/api/clubs/1/players?page=1&limit=10"
```

**Verify**:
- [ ] Response formats match API contract documentation
- [ ] HTTP status codes are correct
- [ ] Error responses have proper format

---

### Task 1.4: Validate Code Quality

**Priority**: High

**Commands**:
```bash
# PSR-12 check
./vendor/bin/php-cs-fixer fix --dry-run --diff

# PHPStan
./vendor/bin/phpstan analyse src --level=6
```

**Acceptance Criteria**:
- [ ] PSR-12 compliant
- [ ] No PHPStan errors at level 6

---

### Task 1.5: Validate Docker Setup

**Priority**: High

**Commands**:
```bash
cd backend
docker-compose up -d
docker-compose exec php composer install
docker-compose exec php bin/console doctrine:migrations:migrate -n
docker-compose exec php bin/console doctrine:fixtures:load -n
```

**Acceptance Criteria**:
- [ ] Docker containers start without errors
- [ ] Application accessible at http://localhost:8080
- [ ] Database migrations work
- [ ] Fixtures load correctly

---

### Task 1.6: Validate Fixtures Data

**Priority**: High

**Verify in database**:
- [ ] 3 clubs exist with correct budgets
- [ ] 15 players (9 hired, 6 free)
- [ ] 5 coaches (3 hired, 2 free)
- [ ] Salary sums don't exceed budgets

```bash
# Connect to MySQL
docker-compose exec mysql mysql -u root -proot sportian

# Check data
SELECT * FROM clubs;
SELECT * FROM players;
SELECT * FROM coaches;
SELECT c.name, c.budget,
       COALESCE(SUM(p.salary), 0) + COALESCE(SUM(co.salary), 0) as total_salaries
FROM clubs c
LEFT JOIN players p ON p.club_id = c.id
LEFT JOIN coaches co ON co.club_id = c.id
GROUP BY c.id;
```

---

## Phase 2: Frontend Review

### Task 2.1: Review Frontend Code Structure

**Priority**: Critical

**Checklist**:
- [ ] Clean component architecture
  - [ ] UI components in `components/ui/`
  - [ ] Feature components in `components/clubs/`, etc.
  - [ ] Pages in `pages/`
- [ ] Services separate from components
- [ ] Hooks abstract data fetching
- [ ] TypeScript types properly defined
- [ ] No `any` types (except where necessary)

**Files to Review**:
```
frontend/src/components/
frontend/src/pages/
frontend/src/services/
frontend/src/hooks/
frontend/src/types/
```

---

### Task 2.2: Run Frontend Tests

**Priority**: Critical

**Commands**:
```bash
cd frontend
npm test
npm test -- --coverage
```

**Acceptance Criteria**:
- [ ] All tests pass
- [ ] Coverage >= 60%

---

### Task 2.3: Validate Build

**Priority**: Critical

**Commands**:
```bash
npm run build
npx tsc --noEmit
npm run lint
```

**Acceptance Criteria**:
- [ ] Build succeeds without errors
- [ ] No TypeScript errors
- [ ] No critical ESLint warnings

---

### Task 2.4: Test All Pages

**Priority**: Critical

**Manual testing**:

| Page | Route | Test |
|------|-------|------|
| Dashboard | `/` | Loads metrics, quick actions work |
| Clubs List | `/clubs` | Shows all clubs, click navigates |
| Create Club | `/clubs/new` | Form works, validates, creates |
| Club Detail | `/clubs/:id` | Shows data, tabs work |
| Players List | `/players` | Search/filter work, pagination |
| Create Player | `/players/new` | Form works |
| Player Detail | `/players/:id` | Shows status, actions work |
| Coaches List | `/coaches` | Same as players |
| Create Coach | `/coaches/new` | Same as players |
| Coach Detail | `/coaches/:id` | Same as players |

---

### Task 2.5: Test All Modals

**Priority**: Critical

**Manual testing**:

| Modal | Test |
|-------|------|
| Edit Budget | Opens, validates min budget, saves |
| Assign Player | Shows free players, validates budget, assigns |
| Assign Coach | Same as player |
| Confirmation | Shows message, confirms, cancels |

---

### Task 2.6: Test Responsive Design

**Priority**: High

**Test on**:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Checklist**:
- [ ] Navigation works on all sizes
- [ ] Tables become cards on mobile
- [ ] Modals fit screen
- [ ] Forms are usable on mobile
- [ ] Buttons are touch-friendly

---

## Phase 3: Integration Testing

### Task 3.1: Test Frontend-Backend Integration

**Priority**: Critical

**Prerequisites**:
- Backend running at http://localhost:8080
- Frontend running at http://localhost:5173

**Test Flow 1: Create Club**:
1. Navigate to `/clubs/new`
2. Enter name: "QA Test Club", budget: 1000000
3. Click "Create Club"
4. Verify: Success toast, redirect to club detail
5. Verify: Club appears in `/clubs` list

**Test Flow 2: Assign Player**:
1. Create free player via `/players/new`
2. Navigate to club detail
3. Click "Assign Player"
4. Select player, enter salary
5. Verify: Success, player in club's players tab
6. Verify: Available budget decreased

**Test Flow 3: Release Player**:
1. On club detail, click "Release" on player
2. Confirm in modal
3. Verify: Player removed from club
4. Verify: Player status is "Free" in `/players`

---

### Task 3.2: Test CORS Configuration

**Priority**: Critical

**Verify**:
- [ ] No CORS errors in browser console
- [ ] OPTIONS preflight requests succeed
- [ ] All API methods work (GET, POST, PATCH, DELETE)

---

### Task 3.3: Test Error Handling

**Priority**: Critical

**Test scenarios**:

| Scenario | Expected |
|----------|----------|
| Create club with empty name | Error toast, form error |
| Budget reduction below salaries | Error toast with message |
| Assign player exceeding budget | Error toast with available/required |
| Assign already hired player | Error toast "already associated" |
| Network error (stop backend) | Network error toast |
| 404 (invalid club ID) | Error toast, redirect |

---

### Task 3.4: Test Loading States

**Priority**: High

**Verify**:
- [ ] Tables show skeleton while loading
- [ ] Buttons show spinner during submit
- [ ] Forms disabled during submission
- [ ] No flickering between states

---

### Task 3.5: Test Data Consistency

**Priority**: Critical

**After operations, verify**:
- [ ] Club budget calculations are correct
- [ ] Total salaries match player + coach sums
- [ ] Available budget = budget - salaries
- [ ] Player/coach counts are correct
- [ ] Free/hired counts are correct

---

## Phase 4: Business Rules Validation

### Task 4.1: Test RN-1 (Budget Control on Hiring)

**Priority**: Critical

**Test Cases**:

| Test | Setup | Action | Expected |
|------|-------|--------|----------|
| 4.1.1 | Club: budget=100000, salaries=80000 | Assign player salary=30000 | Error 422: "Budget exceeded. Available: 20000, Required: 30000" |
| 4.1.2 | Club: budget=100000, salaries=70000 | Assign player salary=30000 | Success (exact limit) |
| 4.1.3 | Club: budget=100000, salaries=70000 | Assign player salary=29000 | Success |
| 4.1.4 | Club: budget=100000, salaries=100000 | Assign player salary=1 | Error 422 |

**UI Verification**:
- [ ] Modal shows available budget
- [ ] Real-time calculation updates
- [ ] Button disabled when salary > available
- [ ] Error message appears

---

### Task 4.2: Test RN-2 (Budget Control on Modification)

**Priority**: Critical

**Test Cases**:

| Test | Setup | Action | Expected |
|------|-------|--------|----------|
| 4.2.1 | Club: budget=100000, salaries=80000 | Set budget=70000 | Error 422: "Budget cannot be lower than current salaries. Current: 80000" |
| 4.2.2 | Club: budget=100000, salaries=80000 | Set budget=80000 | Success (exact limit) |
| 4.2.3 | Club: budget=100000, salaries=80000 | Set budget=120000 | Success (increase) |
| 4.2.4 | Club: budget=100000, salaries=0 | Set budget=50000 | Success |

**UI Verification**:
- [ ] Modal shows current salaries as minimum
- [ ] Warning if reducing budget
- [ ] Button disabled when budget < salaries
- [ ] Error message appears

---

### Task 4.3: Test RN-3 (Club Exclusivity)

**Priority**: Critical

**Test Cases**:

| Test | Setup | Action | Expected |
|------|-------|--------|----------|
| 4.3.1 | Player assigned to Club A | Assign same player to Club B | Error 409: "Player is already associated with another club" |
| 4.3.2 | Coach assigned to Club A | Assign same coach to Club B | Error 409 |
| 4.3.3 | Free player | Assign to Club | Success |

**UI Verification**:
- [ ] Only free players shown in assign dropdown
- [ ] Only free coaches shown in assign dropdown
- [ ] Hired players/coaches don't appear as options

---

### Task 4.4: Test RN-4 (Notifications)

**Priority**: High

**Test Cases**:

| Event | Check |
|-------|-------|
| Create player | Email log entry |
| Create coach | Email log entry |
| Assign player | Email log entry |
| Assign coach | Email log entry |
| Release player | Email log entry |
| Release coach | Email log entry |

**Verification**:
```bash
# Check backend logs
docker-compose exec php cat var/log/dev.log | grep -i email
```

---

## Phase 5: Documentation Review

### Task 5.1: Review Backend README

**Priority**: High

**File**: `backend/README.md`

**Checklist**:
- [ ] Project description present
- [ ] Requirements listed
- [ ] Installation steps work
- [ ] Docker commands documented
- [ ] Database setup commands
- [ ] Fixture loading commands
- [ ] Test commands
- [ ] API examples included

---

### Task 5.2: Review Frontend README

**Priority**: High

**File**: `frontend/README.md`

**Checklist**:
- [ ] Installation steps
- [ ] Environment configuration
- [ ] Development server command
- [ ] Build command
- [ ] Test command

---

### Task 5.3: Review Postman Collection

**Priority**: Medium

**If exists**: `docs/postman/Sportian.postman_collection.json`

**Checklist**:
- [ ] All endpoints included
- [ ] Examples for each endpoint
- [ ] Variables configured (base URL)

---

## QA Report Template

```markdown
# QA Report - Sportian Club Management

**Date**: 2026-01-XX
**QA Engineer**: [Name]
**Status**: APPROVED / REJECTED

## Summary

| Category | Status | Notes |
|----------|--------|-------|
| Backend Tests | PASS/FAIL | Coverage: XX% |
| Frontend Tests | PASS/FAIL | Coverage: XX% |
| API Contract | PASS/FAIL | |
| Business Rules | PASS/FAIL | |
| Integration | PASS/FAIL | |
| Documentation | PASS/FAIL | |

## Issues Found

### Critical (blocks approval)
- (none / list issues)

### Major (should fix)
- (none / list issues)

### Minor (nice to fix)
- (none / list issues)

## Business Rules Validation

| Rule | Status | Notes |
|------|--------|-------|
| RN-1 Budget on hiring | PASS/FAIL | |
| RN-2 Budget on modification | PASS/FAIL | |
| RN-3 Club exclusivity | PASS/FAIL | |
| RN-4 Notifications | PASS/FAIL | |

## Recommendation

**APPROVED** - Ready for merge
OR
**REJECTED** - Issues must be fixed

## Notes
(Additional observations)
```

---

## Final QA Checklist

Before setting status to `APPROVED`:

### Backend
- [ ] All tests passing
- [ ] Coverage >= 70%
- [ ] All API endpoints functional
- [ ] All business rules validated
- [ ] Docker setup works
- [ ] Fixtures loaded
- [ ] Code quality acceptable

### Frontend
- [ ] All tests passing
- [ ] Coverage >= 60%
- [ ] All pages functional
- [ ] All modals work
- [ ] Validations work
- [ ] Loading states present
- [ ] Error handling works
- [ ] Responsive design works
- [ ] Build succeeds

### Integration
- [ ] Frontend-backend integration works
- [ ] CORS configured
- [ ] All flows tested end-to-end
- [ ] No console errors

### Business Rules
- [ ] RN-1 tested and passing
- [ ] RN-2 tested and passing
- [ ] RN-3 tested and passing
- [ ] RN-4 tested and passing

### Documentation
- [ ] README complete
- [ ] Postman collection (if exists)

---

**Document Status**: COMPLETE
**Ready for**: Dependencies Map (35_dependencies.md)
