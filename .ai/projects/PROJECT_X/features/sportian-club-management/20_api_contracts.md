# API Contracts - Sportian Club Management

**Feature ID**: sportian-club-management
**Document Version**: 1.0
**Created**: 2026-01-16
**Author**: Planner

---

## 1. API Overview

**Base URL**: `http://localhost:8080/api`
**Content-Type**: `application/json`
**Authentication**: None (public API for this project)

---

## 2. Club Endpoints

### 2.1 Create Club

**Endpoint**: `POST /api/clubs`

**Purpose**: Create a new club with initial budget.

**Request Body**:
```json
{
  "name": "FC Barcelona",
  "budget": 5000000
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | 3-100 characters |
| budget | integer | Yes | > 0 |

**Success Response (201 Created)**:
```json
{
  "id": 1,
  "name": "FC Barcelona",
  "budget": 5000000,
  "totalSalaries": 0,
  "availableBudget": 5000000,
  "createdAt": "2026-01-16T10:00:00+00:00"
}
```

**Error Responses**:

*400 Bad Request* (validation failed):
```json
{
  "error": "Validation failed",
  "details": [
    {"field": "name", "message": "Name must be between 3 and 100 characters"},
    {"field": "budget", "message": "Budget must be greater than 0"}
  ]
}
```

---

### 2.2 Get Club by ID

**Endpoint**: `GET /api/clubs/{id}`

**Purpose**: Get club details including players and coaches.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Club ID |

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "name": "FC Barcelona",
  "budget": 5000000,
  "totalSalaries": 2440000,
  "availableBudget": 2560000,
  "players": [
    {
      "id": 1,
      "name": "Lionel Messi",
      "salary": 1500000
    },
    {
      "id": 2,
      "name": "Pedri",
      "salary": 500000
    }
  ],
  "coaches": [
    {
      "id": 1,
      "name": "Pep Guardiola",
      "salary": 500000
    }
  ],
  "createdAt": "2026-01-16T10:00:00+00:00"
}
```

**Error Responses**:

*404 Not Found*:
```json
{
  "error": "Club not found"
}
```

---

### 2.3 List All Clubs

**Endpoint**: `GET /api/clubs`

**Purpose**: Get list of all clubs with basic stats.

**Success Response (200 OK)**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "FC Barcelona",
      "budget": 5000000,
      "totalSalaries": 2440000,
      "availableBudget": 2560000
    },
    {
      "id": 2,
      "name": "Real Madrid",
      "budget": 6000000,
      "totalSalaries": 3480000,
      "availableBudget": 2520000
    }
  ]
}
```

---

### 2.4 Update Club Budget

**Endpoint**: `PATCH /api/clubs/{id}/budget`

**Purpose**: Modify the budget of an existing club.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Club ID |

**Request Body**:
```json
{
  "budget": 6000000
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| budget | integer | Yes | > 0, >= current total salaries (RN-2) |

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "name": "FC Barcelona",
  "budget": 6000000,
  "totalSalaries": 2440000,
  "availableBudget": 3560000,
  "createdAt": "2026-01-16T10:00:00+00:00"
}
```

**Error Responses**:

*404 Not Found*:
```json
{
  "error": "Club not found"
}
```

*422 Unprocessable Entity* (RN-2 violation):
```json
{
  "error": "Budget cannot be lower than current salaries. Current: 2440000"
}
```

---

### 2.5 Assign Player to Club

**Endpoint**: `POST /api/clubs/{clubId}/players/{playerId}`

**Purpose**: Hire a free player to a club with specified salary.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| clubId | integer | Club ID |
| playerId | integer | Player ID |

**Request Body**:
```json
{
  "salary": 1500000
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| salary | integer | Yes | >= 0, must not exceed available budget (RN-1) |

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "name": "Lionel Messi",
  "salary": 1500000,
  "club": {
    "id": 1,
    "name": "FC Barcelona"
  },
  "createdAt": "2026-01-16T10:00:00+00:00"
}
```

**Error Responses**:

*404 Not Found* (club):
```json
{
  "error": "Club not found"
}
```

*404 Not Found* (player):
```json
{
  "error": "Player not found"
}
```

*409 Conflict* (RN-3 violation):
```json
{
  "error": "Player is already associated with another club"
}
```

*422 Unprocessable Entity* (RN-1 violation):
```json
{
  "error": "Budget exceeded. Available: 560000, Required: 1500000"
}
```

---

### 2.6 Release Player from Club

**Endpoint**: `DELETE /api/clubs/{clubId}/players/{playerId}`

**Purpose**: Release a player from a club (player becomes free agent).

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| clubId | integer | Club ID |
| playerId | integer | Player ID |

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "name": "Lionel Messi",
  "salary": null,
  "club": null,
  "createdAt": "2026-01-16T10:00:00+00:00"
}
```

**Error Responses**:

*404 Not Found* (club):
```json
{
  "error": "Club not found"
}
```

*404 Not Found* (player):
```json
{
  "error": "Player not found"
}
```

*400 Bad Request* (player not in this club):
```json
{
  "error": "Player does not belong to this club"
}
```

---

### 2.7 Assign Coach to Club

**Endpoint**: `POST /api/clubs/{clubId}/coaches/{coachId}`

**Purpose**: Hire a free coach to a club with specified salary.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| clubId | integer | Club ID |
| coachId | integer | Coach ID |

**Request Body**:
```json
{
  "salary": 500000
}
```

*Same validation and responses as Assign Player (2.5)*

---

### 2.8 Release Coach from Club

**Endpoint**: `DELETE /api/clubs/{clubId}/coaches/{coachId}`

**Purpose**: Release a coach from a club (coach becomes free agent).

*Same structure as Release Player (2.6)*

---

### 2.9 List Club Players (with filters)

**Endpoint**: `GET /api/clubs/{clubId}/players`

**Purpose**: Get paginated list of players belonging to a club.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| clubId | integer | Club ID |

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| name | string | null | Filter by name (partial match) |
| page | integer | 1 | Page number |
| limit | integer | 10 | Items per page (max 100) |

**Example**: `GET /api/clubs/1/players?name=Mes&page=1&limit=10`

**Success Response (200 OK)**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Lionel Messi",
      "salary": 1500000,
      "club": {
        "id": 1,
        "name": "FC Barcelona"
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "pages": 1,
    "limit": 10
  }
}
```

**Error Responses**:

*404 Not Found*:
```json
{
  "error": "Club not found"
}
```

---

## 3. Player Endpoints

### 3.1 Create Player (Free Agent)

**Endpoint**: `POST /api/players`

**Purpose**: Create a new player as free agent (no club).

**Request Body**:
```json
{
  "name": "Neymar Jr"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | 3-100 characters |

**Success Response (201 Created)**:
```json
{
  "id": 10,
  "name": "Neymar Jr",
  "salary": null,
  "club": null,
  "createdAt": "2026-01-16T10:00:00+00:00"
}
```

**Side Effects**:
- Email notification sent (RN-4)

**Error Responses**:

*400 Bad Request*:
```json
{
  "error": "Validation failed",
  "details": [
    {"field": "name", "message": "Name must be between 3 and 100 characters"}
  ]
}
```

---

### 3.2 Get Player by ID

**Endpoint**: `GET /api/players/{id}`

**Purpose**: Get player details.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Player ID |

**Success Response (200 OK)** - Hired player:
```json
{
  "id": 1,
  "name": "Lionel Messi",
  "salary": 1500000,
  "club": {
    "id": 1,
    "name": "FC Barcelona"
  },
  "createdAt": "2026-01-16T10:00:00+00:00"
}
```

**Success Response (200 OK)** - Free player:
```json
{
  "id": 10,
  "name": "Neymar Jr",
  "salary": null,
  "club": null,
  "createdAt": "2026-01-16T10:00:00+00:00"
}
```

**Error Responses**:

*404 Not Found*:
```json
{
  "error": "Player not found"
}
```

---

### 3.3 List All Players

**Endpoint**: `GET /api/players`

**Purpose**: Get list of all players (free and hired).

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| name | string | null | Filter by name (partial match) |
| status | string | null | Filter by status: "free" or "hired" |
| page | integer | 1 | Page number |
| limit | integer | 10 | Items per page (max 100) |

**Example**: `GET /api/players?status=free&page=1&limit=10`

**Success Response (200 OK)**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Lionel Messi",
      "salary": 1500000,
      "club": {
        "id": 1,
        "name": "FC Barcelona"
      }
    },
    {
      "id": 10,
      "name": "Neymar Jr",
      "salary": null,
      "club": null
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "pages": 2,
    "limit": 10
  }
}
```

---

## 4. Coach Endpoints

### 4.1 Create Coach (Free Agent)

**Endpoint**: `POST /api/coaches`

**Purpose**: Create a new coach as free agent (no club).

**Request Body**:
```json
{
  "name": "Zinedine Zidane"
}
```

*Same validation and responses as Create Player (3.1)*

---

### 4.2 Get Coach by ID

**Endpoint**: `GET /api/coaches/{id}`

*Same structure as Get Player (3.2)*

---

### 4.3 List All Coaches

**Endpoint**: `GET /api/coaches`

*Same structure as List All Players (3.3)*

---

## 5. Dashboard Endpoints (Optional)

### 5.1 Get Dashboard Stats

**Endpoint**: `GET /api/dashboard/stats`

**Purpose**: Get aggregated stats for dashboard.

**Success Response (200 OK)**:
```json
{
  "totalClubs": 3,
  "totalPlayers": 15,
  "totalCoaches": 5,
  "freePlayers": 6,
  "hiredPlayers": 9,
  "freeCoaches": 2,
  "hiredCoaches": 3,
  "totalBudget": 15500000,
  "totalSalaries": 8200000
}
```

---

## 6. Error Response Format

### 6.1 Standard Error Structure

All error responses follow this format:

```json
{
  "error": "Human readable error message"
}
```

For validation errors with details:
```json
{
  "error": "Validation failed",
  "details": [
    {"field": "fieldName", "message": "Error description"}
  ]
}
```

### 6.2 HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, validation error |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Business rule conflict (e.g., player already hired) |
| 422 | Unprocessable Entity | Business rule violation (e.g., budget exceeded) |
| 500 | Internal Server Error | Unexpected server error |

---

## 7. TypeScript Types (Frontend)

```typescript
// types/club.ts
export interface Club {
  id: number;
  name: string;
  budget: number;
  totalSalaries: number;
  availableBudget: number;
  players?: Player[];
  coaches?: Coach[];
  createdAt: string;
}

export interface CreateClubDTO {
  name: string;
  budget: number;
}

export interface UpdateBudgetDTO {
  budget: number;
}

export interface AssignMemberDTO {
  salary: number;
}

// types/player.ts
export interface Player {
  id: number;
  name: string;
  salary: number | null;
  club: ClubRef | null;
  createdAt: string;
}

export interface ClubRef {
  id: number;
  name: string;
}

export interface CreatePlayerDTO {
  name: string;
}

// types/coach.ts
export interface Coach {
  id: number;
  name: string;
  salary: number | null;
  club: ClubRef | null;
  createdAt: string;
}

export interface CreateCoachDTO {
  name: string;
}

// types/api.ts
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface ApiError {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface DashboardStats {
  totalClubs: number;
  totalPlayers: number;
  totalCoaches: number;
  freePlayers: number;
  hiredPlayers: number;
  freeCoaches: number;
  hiredCoaches: number;
  totalBudget: number;
  totalSalaries: number;
}
```

---

## 8. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/clubs | Create club |
| GET | /api/clubs | List all clubs |
| GET | /api/clubs/:id | Get club details |
| PATCH | /api/clubs/:id/budget | Update club budget |
| POST | /api/clubs/:clubId/players/:playerId | Assign player to club |
| DELETE | /api/clubs/:clubId/players/:playerId | Release player from club |
| POST | /api/clubs/:clubId/coaches/:coachId | Assign coach to club |
| DELETE | /api/clubs/:clubId/coaches/:coachId | Release coach from club |
| GET | /api/clubs/:id/players | List club players (paginated) |
| POST | /api/players | Create player (free) |
| GET | /api/players | List all players (paginated) |
| GET | /api/players/:id | Get player details |
| POST | /api/coaches | Create coach (free) |
| GET | /api/coaches | List all coaches (paginated) |
| GET | /api/coaches/:id | Get coach details |
| GET | /api/dashboard/stats | Get dashboard stats |

**Total Endpoints**: 16

---

## 9. Postman Collection Structure

```
Sportian API/
├── Clubs/
│   ├── Create Club
│   ├── Get All Clubs
│   ├── Get Club by ID
│   ├── Update Club Budget
│   ├── Assign Player to Club
│   ├── Release Player from Club
│   ├── Assign Coach to Club
│   ├── Release Coach from Club
│   └── List Club Players
├── Players/
│   ├── Create Player
│   ├── Get All Players
│   └── Get Player by ID
├── Coaches/
│   ├── Create Coach
│   ├── Get All Coaches
│   └── Get Coach by ID
└── Dashboard/
    └── Get Stats
```

---

**Document Status**: COMPLETE
**Ready for**: UI Wireframes (25_ui_wireframes.md)
