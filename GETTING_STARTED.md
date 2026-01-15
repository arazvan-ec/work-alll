# 🚀 Guía de Inicio Rápido - Claude Code Workflow

## ¡Sistema instalado correctamente! ✅

Tu repositorio ahora tiene el sistema completo de workflow modular para trabajar con múltiples instancias de Claude Code en paralelo.

## 📋 Estructura Instalada

```
work-alll/
├── .ai/                          # Sistema de workflow
│   ├── roles/                    # 4 roles especializados
│   │   ├── planner.md           # Arquitecto/Planificador
│   │   ├── backend.md           # Ingeniero Backend
│   │   ├── frontend.md          # Ingeniero Frontend
│   │   └── qa.md                # QA/Revisor
│   ├── projects/PROJECT_X/
│   │   ├── rules/               # Reglas del proyecto
│   │   ├── workflows/           # Workflows YAML
│   │   └── features/            # Features en desarrollo
│   ├── scripts/                 # Herramientas de automatización
│   └── hooks/                   # Git hooks instalados ✓
├── backend/                     # Tu código backend
├── frontend/                    # Tu código frontend
├── workflow                     # CLI principal
└── README.md                    # Documentación completa

Git hooks: ✅ Instalados
Scripts: ✅ Ejecutables
```

## 🎯 Primeros Pasos

### 1. Entender el sistema (5 minutos)

Lee la documentación principal:
```bash
cat README.md
```

Documentos adicionales importantes:
```bash
cat .ai/GIT_WORKFLOW.md        # Git workflow para multi-instancia
cat .ai/PAIRING_PATTERNS.md    # Patrones de pairing con IA
```

### 2. Conocer los comandos disponibles

```bash
./workflow help
```

Comandos principales:
- `./workflow consult` - Consultoría interactiva (recomendado)
- `./workflow start <feature-id> <workflow>` - Inicia todos los roles en Tilix
- `./workflow role <role> <feature-id>` - Inicia un rol específico
- `./workflow validate` - Valida configuración
- `./workflow sync <feature-id>` - Sincroniza con Git
- `./workflow commit <role> <feature-id> <msg>` - Commit y push

## 🚀 Ejemplo Práctico: Crear Feature de Autenticación

### Opción A: Consultoría Interactiva (⭐ RECOMENDADO)

```bash
./workflow consult
```

El sistema te preguntará:
- ¿Qué tipo de tarea? (feature, bug fix, refactor)
- ¿Complejidad? (simple, medium, complex)
- ¿Arquitectura? (simple, DDD, clean)
- ¿Trabajo en paralelo?
- ¿Solo o en equipo?

**Y te sugerirá el workflow óptimo.**

### Opción B: Iniciar directamente

#### 1. Crear el feature "user-auth"

```bash
mkdir -p .ai/projects/PROJECT_X/features/user-auth
cp .ai/projects/PROJECT_X/features/FEATURE_X/50_state.md \\
   .ai/projects/PROJECT_X/features/user-auth/50_state.md
```

#### 2. Iniciar todos los roles en Tilix (Modo Automático)

```bash
./workflow start user-auth default --execute
```

Esto abre 4 terminales en layout 2x2:
```
┌─────────────┬─────────────┐
│  PLANNER    │  BACKEND    │
├─────────────┼─────────────┤
│  FRONTEND   │  QA         │
└─────────────┴─────────────┘
```

Cada terminal ejecuta Claude Code con su rol específico automáticamente.

#### 3. O trabajar como un rol específico

Si prefieres trabajar con un solo rol:

```bash
# Como Planner (define arquitectura y tareas)
./workflow role planner user-auth

# Como Backend Engineer (implementa API)
./workflow role backend user-auth

# Como Frontend Engineer (implementa UI)
./workflow role frontend user-auth

# Como QA (revisa y valida)
./workflow role qa user-auth
```

## 📝 Flujo de Trabajo Típico

### Escenario: Desarrollar feature solo (con múltiples roles)

```bash
# 1. Consultar qué workflow usar
./workflow consult

# 2. Iniciar todos los roles en Tilix
./workflow start user-auth default --execute

# 3. En cada pane de Tilix:
#    - Claude Code ya está ejecutándose con su rol
#    - Lee las reglas y el workflow
#    - Implementa su parte
#    - Actualiza 50_state.md

# 4. Sincronizar cambios entre roles
./workflow sync user-auth

# 5. Hacer commits frecuentes
./workflow commit backend user-auth "Add User entity with password hashing"
./workflow commit frontend user-auth "Add LoginForm component"
./workflow commit qa user-auth "QA Review: APPROVED"

# 6. Validar todo
./workflow validate user-auth
```

### Escenario: Trabajo en equipo (3 personas)

**Persona 1 (Planner + QA):**
```bash
./workflow role planner user-auth
# Define arquitectura, crea contratos, actualiza 50_state.md
./workflow commit planner user-auth "Define user-auth architecture"

# Luego como QA
./workflow role qa user-auth
# Revisa implementación cuando esté lista
```

**Persona 2 (Backend):**
```bash
./workflow sync user-auth  # Obtener plan del Planner
./workflow role backend user-auth
# Implementa API según el plan
./workflow commit backend user-auth "Implement authentication endpoints"
```

**Persona 3 (Frontend):**
```bash
./workflow sync user-auth  # Obtener plan del Planner
./workflow role frontend user-auth
# Implementa UI, mockea API si es necesario
./workflow commit frontend user-auth "Implement login and registration forms"
```

## 🎨 Workflows Disponibles

### 1. `default` - Workflow Estándar
```
Planning → Backend || Frontend → Integration → QA
```
- Backend y Frontend en paralelo
- Frontend mockea API si necesario
- Ideal para features estándar

**Usar cuando:**
- Feature bien entendida
- Equipo experimentado
- Iteración rápida

### 2. `task-breakdown` - Planning Detallado
```
Requirements → Architecture → API Contracts → Task Breakdown →
Backend → Frontend → QA
```
- Planning exhaustivo antes de implementar
- Genera documentación detallada por rol
- Tareas con acceptance criteria

**Usar cuando:**
- Proyecto complejo
- Múltiples entidades relacionadas
- Equipo distribuido necesita claridad
- Onboarding de nuevos devs

## 💡 Tips y Mejores Prácticas

### 1. Estado Centralizado (`50_state.md`)
- Es la **fuente de verdad** del feature
- Todos los roles lo actualizan
- Sincroniza el progreso entre roles
- **SIEMPRE** leerlo antes de empezar

### 2. Git Workflow
- **Pull antes de empezar**: `./workflow sync user-auth`
- **Commit frecuente**: Después de cada checkpoint
- **Mensajes claros**: `[backend][user-auth] Add User entity`
- **Push frecuente**: Para que otros roles vean tus cambios

### 3. Roles y Responsabilidades

| Rol | Puede Leer | Puede Escribir | NO Puede |
|-----|-----------|---------------|----------|
| **Planner** | Todo | Contratos, decisiones, reglas | Implementar código |
| **Backend** | Reglas, workflows, backend | `backend/src/**`, tests | Modificar frontend |
| **Frontend** | Reglas, workflows, frontend | `frontend/src/**`, tests | Modificar backend |
| **QA** | Todo | Reports, 50_state.md (QA) | Implementar features |

### 4. Pairing Patterns con IA

Lee `.ai/PAIRING_PATTERNS.md` para:
- Evitar el "Speed Trap" (generar más rápido de lo que verificas)
- Usar checkpoints frecuentes
- Referenciar código existente (pattern matching)
- "Trust = Passing Test Suite"

## 🔍 Comandos Útiles

```bash
# Ver estado de un feature
cat .ai/projects/PROJECT_X/features/user-auth/50_state.md

# Monitorear estado en tiempo real
watch -n 5 'cat .ai/projects/PROJECT_X/features/user-auth/50_state.md'

# Validar todos los workflows
./workflow validate

# Ver roles disponibles
ls -la .ai/roles/

# Ver workflows disponibles
ls -la .ai/projects/PROJECT_X/workflows/
```

## 🆘 Troubleshooting

### Error: "Missing: FEATURE_X.md"
Es normal, FEATURE_X es un template. Crea tu propio feature:
```bash
mkdir -p .ai/projects/PROJECT_X/features/mi-feature
```

### Error: "Tilix not found"
Instala Tilix o usa el modo "role":
```bash
./workflow role backend mi-feature
```

### Error: "Git hooks failed"
Los hooks validan YAML y estado. Revisa:
```bash
./.ai/scripts/validate_workflow.py mi-feature
```

## 📚 Próximos Pasos

1. **Lee la documentación completa**: `cat README.md`
2. **Experimenta con consultoría**: `./workflow consult`
3. **Crea tu primer feature**: `./workflow start my-feature default -x`
4. **Lee los patrones de pairing**: `cat .ai/PAIRING_PATTERNS.md`
5. **Personaliza las reglas**: Edita `.ai/projects/PROJECT_X/rules/`

## 🎉 ¡Listo para empezar!

```bash
# Comienza con la consultoría interactiva
./workflow consult

# O salta directo a crear tu feature
./workflow start mi-primer-feature default --execute
```

**¡Disfruta trabajando con múltiples Claude Code en paralelo!** 🚀

---

**Documentación:**
- `README.md` - Documentación completa del sistema
- `.ai/GIT_WORKFLOW.md` - Git workflow para multi-instancia
- `.ai/PAIRING_PATTERNS.md` - Patrones de pairing efectivo

**Soporte:**
- Issues: https://github.com/arazvan-ec/workflow/issues
- Documentación: Ver archivos .md en `.ai/`
