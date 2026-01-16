# Requirements Analysis - Sportian Club Management

**Feature ID**: sportian-club-management
**Document Version**: 1.0
**Created**: 2026-01-16
**Author**: Planner

---

## 1. Executive Summary

Sportian es una aplicación full-stack para la gestión de clubes deportivos que permite:
- Gestionar clubes con presupuestos
- Gestionar jugadores y entrenadores (libres o contratados)
- Asociar/desasociar jugadores y entrenadores a clubes con control de salarios
- Control estricto de presupuestos (reglas de negocio críticas)
- Sistema de notificaciones extensible (email + preparado para SMS/WhatsApp)

---

## 2. Stakeholders Analysis

### 2.1 Primary Users
- **Administradores de clubes**: Gestionan clubes, presupuestos, contrataciones
- **Sistema**: Procesos automatizados (notificaciones)

### 2.2 Technical Team
- **Backend Developer**: Implementa API REST con DDD
- **Frontend Developer**: Implementa UI React
- **QA Engineer**: Valida implementación completa

---

## 3. Domain Analysis

### 3.1 Core Entities

#### Entity: Club
**Purpose**: Representa un club deportivo con presupuesto para contrataciones.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID/Integer | Yes (auto) | Identificador único |
| name | String(3-100) | Yes | Nombre del club |
| budget | Money (>0) | Yes | Presupuesto total para salarios |

**Derived Attributes**:
- `totalSalaries`: Suma de salarios de jugadores + entrenadores
- `availableBudget`: `budget - totalSalaries`

**Relationships**:
- 1:N con Player (un club tiene muchos jugadores)
- 1:N con Coach (un club tiene muchos entrenadores)

#### Entity: Player (Jugador)
**Purpose**: Representa un jugador que puede estar libre o contratado por un club.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID/Integer | Yes (auto) | Identificador único |
| name | String(3-100) | Yes | Nombre del jugador |
| club_id | Integer | No (nullable) | FK al club (null = libre) |
| salary | Money (>=0) | Conditional | Requerido si tiene club |

**States**:
1. **FREE (Libre)**: `club_id = NULL`, `salary = NULL`
2. **HIRED (Contratado)**: `club_id != NULL`, `salary > 0`

**Invariants**:
- Si `club_id != NULL` entonces `salary` DEBE tener valor >= 0
- Si `club_id = NULL` entonces `salary` DEBE ser NULL
- Un jugador solo puede pertenecer a UN club a la vez

#### Entity: Coach (Entrenador)
**Purpose**: Representa un entrenador que puede estar libre o contratado por un club.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID/Integer | Yes (auto) | Identificador único |
| name | String(3-100) | Yes | Nombre del entrenador |
| club_id | Integer | No (nullable) | FK al club (null = libre) |
| salary | Money (>=0) | Conditional | Requerido si tiene club |

**States**: Idénticos a Player (FREE / HIRED)

**Invariants**: Idénticos a Player

---

### 3.2 Value Objects

#### Money (Salario/Presupuesto)
**Purpose**: Representa valores monetarios con validación.

| Property | Type | Validation |
|----------|------|------------|
| amount | Integer/Float | >= 0 |
| currency | String | Default: EUR (no requerido para MVP) |

**Behavior**:
- Inmutable
- Comparación por valor (`equals()`)
- Operaciones: `add()`, `subtract()`, `isGreaterThan()`, `isLessThan()`

---

## 4. Business Rules (Critical)

### RN-1: Budget Control on Hiring
**Rule**: La suma total de salarios (jugadores + entrenadores) no puede superar el presupuesto del club.

**Trigger**: Al asociar un jugador o entrenador a un club.

**Validation Formula**:
```
currentTotalSalaries + newSalary <= club.budget

where:
  currentTotalSalaries = SUM(players.salary) + SUM(coaches.salary)
```

**Error Response**:
- HTTP Status: `422 Unprocessable Entity`
- Message: `"Budget exceeded. Available: {available}, Required: {newSalary}"`

**Edge Cases**:
- Contratar con salario 0: PERMITIDO
- Contratar cuando presupuesto disponible = salario exacto: PERMITIDO

### RN-2: Budget Control on Modification
**Rule**: No se puede reducir el presupuesto del club por debajo de la suma actual de salarios.

**Trigger**: Al modificar el presupuesto de un club.

**Validation Formula**:
```
newBudget >= currentTotalSalaries

where:
  currentTotalSalaries = SUM(players.salary) + SUM(coaches.salary)
```

**Error Response**:
- HTTP Status: `422 Unprocessable Entity`
- Message: `"Budget cannot be lower than current salaries. Current: {currentTotalSalaries}"`

**Edge Cases**:
- Aumentar presupuesto: SIEMPRE PERMITIDO
- Reducir a exactamente la suma de salarios: PERMITIDO
- Reducir por debajo de la suma: RECHAZADO

### RN-3: Club Exclusivity
**Rule**: Un jugador o entrenador no puede pertenecer a más de un club al mismo tiempo.

**Trigger**: Al intentar asociar a un club.

**Validation**:
```
player.club_id MUST BE NULL before assignment
coach.club_id MUST BE NULL before assignment
```

**Error Response**:
- HTTP Status: `409 Conflict`
- Message: `"Player/Coach is already associated with another club"`

### RN-4: Mandatory Notifications
**Rule**: Enviar notificaciones por email en operaciones específicas.

**Trigger Events**:
| Event | Notification Type |
|-------|------------------|
| Player created (free) | Email: "New player registered" |
| Coach created (free) | Email: "New coach registered" |
| Player assigned to club | Email: "Player hired by {clubName}" |
| Coach assigned to club | Email: "Coach hired by {clubName}" |
| Player released from club | Email: "Player released from {clubName}" |
| Coach released from club | Email: "Coach released from {clubName}" |

**Implementation Requirements**:
- Sistema extensible (preparado para SMS, WhatsApp en futuro)
- Patrón: Strategy o Chain of Responsibility
- Interface: `NotificationChannelInterface`
- Implementación inicial: `EmailNotificationChannel`

---

## 5. Functional Requirements

### 5.1 Club Management

#### FR-1: Create Club
**Actor**: User
**Description**: Crear un nuevo club con nombre y presupuesto inicial.

**Input**:
```json
{
  "name": "FC Barcelona",
  "budget": 1000000
}
```

**Validations**:
- `name`: Required, 3-100 characters
- `budget`: Required, > 0

**Output (201 Created)**:
```json
{
  "id": 1,
  "name": "FC Barcelona",
  "budget": 1000000
}
```

#### FR-2: Get Club Details
**Actor**: User
**Description**: Obtener detalles de un club incluyendo jugadores y entrenadores.

**Output**:
```json
{
  "id": 1,
  "name": "FC Barcelona",
  "budget": 1000000,
  "players": [...],
  "coaches": [...]
}
```

#### FR-3: Update Club Budget
**Actor**: User
**Description**: Modificar el presupuesto de un club existente.

**Input**:
```json
{
  "budget": 1200000
}
```

**Validations**:
- Apply RN-2 (budget >= currentSalaries)

---

### 5.2 Player Management

#### FR-4: Create Free Player
**Actor**: User
**Description**: Crear un nuevo jugador sin club (estado libre).

**Input**:
```json
{
  "name": "Lionel Messi"
}
```

**Validations**:
- `name`: Required, 3-100 characters

**Output (201 Created)**:
```json
{
  "id": 1,
  "name": "Lionel Messi",
  "salary": null,
  "club": null
}
```

**Side Effects**:
- Send email notification (RN-4)

#### FR-5: Assign Player to Club
**Actor**: User
**Description**: Asociar un jugador libre a un club con un salario.

**Input**:
```json
{
  "salary": 1500000
}
```

**Validations**:
- Apply RN-1 (budget control)
- Apply RN-3 (club exclusivity)

**Output (200 OK)**:
```json
{
  "id": 1,
  "name": "Lionel Messi",
  "salary": 1500000,
  "club": {
    "id": 1,
    "name": "FC Barcelona"
  }
}
```

**Side Effects**:
- Send email notification (RN-4)

#### FR-6: Release Player from Club
**Actor**: User
**Description**: Dar de baja a un jugador del club (pasa a libre).

**Output (200 OK)**:
```json
{
  "id": 1,
  "name": "Lionel Messi",
  "salary": null,
  "club": null
}
```

**Side Effects**:
- Send email notification (RN-4)

---

### 5.3 Coach Management

#### FR-7: Create Free Coach
**Description**: Idéntico a FR-4 pero para entrenadores.

#### FR-8: Assign Coach to Club
**Description**: Idéntico a FR-5 pero para entrenadores.

#### FR-9: Release Coach from Club
**Description**: Idéntico a FR-6 pero para entrenadores.

---

### 5.4 Listing and Filtering

#### FR-10: List Club Players
**Actor**: User
**Description**: Listar jugadores de un club con filtros y paginación.

**Query Parameters**:
- `name`: Filtro parcial por nombre (LIKE %name%)
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 10, max: 100)

**Output (200 OK)**:
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
    "total": 25,
    "page": 1,
    "pages": 3,
    "limit": 10
  }
}
```

---

## 6. Non-Functional Requirements

### 6.1 Performance
- API response time: < 200ms (p95)
- Database queries: Optimized with indexes
- Pagination: Max 100 items per request

### 6.2 Scalability
- Stateless API (horizontally scalable)
- Notification system: Async-ready (can be moved to queue)

### 6.3 Maintainability
- DDD Architecture (clear separation of concerns)
- Clean code (PSR-12, ESLint)
- Test coverage: Backend >= 70%, Frontend >= 60%

### 6.4 Extensibility
- Notification system: Strategy pattern for new channels
- API: REST conventions for future endpoints

### 6.5 Security
- Input validation on all endpoints
- SQL injection prevention (Doctrine ORM)
- XSS prevention (React default escaping)
- CORS configuration for frontend

---

## 7. User Interface Requirements

### 7.1 Pages Required

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/` | Overview with metrics |
| Clubs List | `/clubs` | List all clubs |
| Create Club | `/clubs/new` | Form to create club |
| Club Detail | `/clubs/:id` | Club info + players/coaches |
| Players List | `/players` | List all players with filters |
| Create Player | `/players/new` | Form to create player |
| Player Detail | `/players/:id` | Player info + actions |
| Coaches List | `/coaches` | List all coaches |
| Create Coach | `/coaches/new` | Form to create coach |
| Coach Detail | `/coaches/:id` | Coach info + actions |

### 7.2 Modals Required

| Modal | Purpose |
|-------|---------|
| EditBudgetModal | Modify club budget |
| AssignPlayerModal | Assign player to club with salary |
| AssignCoachModal | Assign coach to club with salary |
| ConfirmationModal | Confirm destructive actions |

### 7.3 UX Requirements

- **Loading States**: Spinners on buttons, skeleton loaders on lists
- **Error Handling**: Toast notifications for success/error
- **Confirmations**: Before release player/coach, before budget reduction
- **Responsive**: Mobile-first, works on all screen sizes
- **Real-time Feedback**: Budget calculations shown before submit

---

## 8. Test Scenarios

### 8.1 Critical Test Cases (Business Rules)

#### TC-1: Budget Exceeded on Hiring
```
Given: Club with budget=100000, current salaries=80000
When: Assign player with salary=30000
Then: Error 422 "Budget exceeded. Available: 20000, Required: 30000"
```

#### TC-2: Budget Reduction Below Salaries
```
Given: Club with budget=100000, current salaries=80000
When: Update budget to 70000
Then: Error 422 "Budget cannot be lower than current salaries. Current: 80000"
```

#### TC-3: Player Already Has Club
```
Given: Player assigned to Club A
When: Try to assign same player to Club B
Then: Error 409 "Player is already associated with another club"
```

#### TC-4: Successful Hiring at Budget Limit
```
Given: Club with budget=100000, current salaries=70000
When: Assign player with salary=30000 (exact limit)
Then: Success 200, player assigned
```

#### TC-5: Release Player Frees Budget
```
Given: Club with budget=100000, player with salary=30000
When: Release player
Then: Player has salary=null, club=null
And: Club available budget increases by 30000
```

---

## 9. Data Requirements (Fixtures)

### 9.1 Initial Data

#### Clubs (3)
| Name | Budget |
|------|--------|
| FC Barcelona | 5,000,000 |
| Real Madrid | 6,000,000 |
| Manchester United | 4,500,000 |

#### Players (15)
| Name | Club | Salary |
|------|------|--------|
| Lionel Messi | FC Barcelona | 1,500,000 |
| Pedri | FC Barcelona | 500,000 |
| Gavi | FC Barcelona | 400,000 |
| Cristiano Ronaldo | Real Madrid | 1,800,000 |
| Vinicius Jr | Real Madrid | 800,000 |
| Jude Bellingham | Real Madrid | 1,000,000 |
| Wayne Rooney | Manchester United | 1,200,000 |
| Marcus Rashford | Manchester United | 700,000 |
| Bruno Fernandes | Manchester United | 600,000 |
| Neymar Jr | FREE | - |
| Kylian Mbappé | FREE | - |
| Erling Haaland | FREE | - |
| Robert Lewandowski | FREE | - |
| Mohamed Salah | FREE | - |

#### Coaches (5)
| Name | Club | Salary |
|------|------|--------|
| Pep Guardiola | FC Barcelona | 500,000 |
| Carlo Ancelotti | Real Madrid | 600,000 |
| Erik ten Hag | Manchester United | 450,000 |
| Zinedine Zidane | FREE | - |
| José Mourinho | FREE | - |

---

## 10. Acceptance Criteria Summary

### Backend Complete When:
- [ ] All API endpoints functional (POST/GET/PATCH/DELETE)
- [ ] All business rules (RN-1 to RN-4) validated
- [ ] DDD architecture implemented correctly
- [ ] Email notifications sent on required operations
- [ ] Pagination and filtering working
- [ ] Tests passing with >= 70% coverage
- [ ] Docker setup working
- [ ] Fixtures loaded

### Frontend Complete When:
- [ ] All pages implemented and navigable
- [ ] All CRUD operations working from UI
- [ ] All modals functional
- [ ] Validations showing in real-time
- [ ] Loading states implemented
- [ ] Error handling with toasts
- [ ] Responsive design (mobile + desktop)
- [ ] Tests passing with >= 60% coverage
- [ ] Build successful

### Integration Complete When:
- [ ] Frontend connected to backend API
- [ ] All flows work end-to-end
- [ ] CORS configured correctly
- [ ] No console errors in browser

---

**Document Status**: COMPLETE
**Ready for**: Architecture Design (10_architecture.md)
