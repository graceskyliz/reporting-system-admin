# 📡 API Endpoints - Staff Admin Panel

Base URL: `https://mzq13io4vk.execute-api.us-east-1.amazonaws.com/dev`

## 🔐 Authentication Endpoints

### 1. Register User
- **Endpoint:** `POST /auth/register`
- **Lambda:** `RegisterUser`
- **Body:**
  ```json
  {
    "user_id": "staff001",
    "password": "password123",
    "role": "staff",
    "department": "Mantenimiento"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "body": {
      "message": "Usuario registrado exitosamente",
      "user_id": "staff001"
    }
  }
  ```
- **Frontend Function:** `registerUser(user_id, password, role, department)`

### 2. Login
- **Endpoint:** `POST /auth/login`
- **Lambda:** `GenerateToken`
- **Body:**
  ```json
  {
    "user_id": "staff001",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "body": {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "role": "staff",
      "department": "Mantenimiento"
    }
  }
  ```
- **Frontend Function:** `login(user_id, password)`

---

## 📋 Staff Incident Management Endpoints

### 3. List Incidents by Department
- **Endpoint:** `GET /staff/incidents/by-department`
- **Lambda:** `listForDepartment`
- **Query Params:** `estado`, `urgencia`, `ubicacion`, `department`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "body": [
      {
        "incident_id": "INC-001",
        "reporter_id": "student123",
        "tipo": "Fuga de agua",
        "descripcion": "Fuga en el baño del edificio A",
        "ubicacion": "Edificio A - Piso 2",
        "urgencia": "alta",
        "estado": "pendiente",
        "created_at": "2025-11-16T10:30:00Z",
        "updated_at": "2025-11-16T10:30:00Z",
        "department": "Mantenimiento"
      }
    ]
  }
  ```
- **Frontend Function:** `listIncidents(token, filters?)`

### 4. Update Incident Status
- **Endpoint:** `PUT /staff/incidents/{id}/status`
- **Lambda:** `updateStatus`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "estado": "en_proceso"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "body": {
      "incident_id": "INC-001",
      "estado": "en_proceso",
      "updated_at": "2025-11-16T11:00:00Z"
    }
  }
  ```
- **Frontend Function:** `updateIncidentStatus(token, id, estado)`
- **WebSocket Event:** `notifyIncidentStatusChanged`

### 5. Add Comment
- **Endpoint:** `POST /staff/incidents/{id}/comment`
- **Lambda:** `addComment`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "content": "Se ha revisado el incidente y se procederá a reparar"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "body": {
      "id": "comment-123",
      "author": "staff001",
      "content": "Se ha revisado el incidente...",
      "createdAt": "2025-11-16T11:15:00Z"
    }
  }
  ```
- **Frontend Function:** `addComment(token, id, content)`
- **WebSocket Event:** `notifyCommentAdded`

### 6. Assign Department
- **Endpoint:** `POST /staff/incidents/{id}/assign`
- **Lambda:** `assignDepartment`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "department": "Mantenimiento"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "body": {
      "incident_id": "INC-001",
      "department": "Mantenimiento",
      "assigned_at": "2025-11-16T11:20:00Z"
    }
  }
  ```
- **Frontend Function:** `assignIncident(token, id, department)`
- **WebSocket Event:** `notifyDepartmentAssigned`

### 7. Get Incident Events (History)
- **Endpoint:** `GET /staff/incidents/{id}/events`
- **Lambda:** `getIncidentEvents`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "body": [
      {
        "event_type": "status_change",
        "old_value": "pendiente",
        "new_value": "en_proceso",
        "user": "staff001",
        "timestamp": "2025-11-16T11:00:00Z"
      },
      {
        "event_type": "comment_added",
        "content": "Se ha revisado...",
        "user": "staff001",
        "timestamp": "2025-11-16T11:15:00Z"
      }
    ]
  }
  ```
- **Frontend Function:** `getIncidentEvents(token, id)`

### 8. Get Staff Statistics
- **Endpoint:** `GET /staff/incidents/stats`
- **Lambda:** `staffStats`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "body": {
      "por_estado": {
        "pendiente": 8,
        "en_proceso": 5,
        "resuelto": 11
      },
      "por_departamento": {
        "Mantenimiento": 15,
        "Seguridad": 6,
        "TI": 3
      }
    }
  }
  ```
- **Frontend Function:** `getStaffStats(token)`

---

## 🔌 WebSocket Events

WebSocket URL: `wss://your-websocket-id.execute-api.us-east-1.amazonaws.com/dev`

### Events Emitted by Backend

#### 1. `notifyIncidentCreated`
```json
{
  "type": "notifyIncidentCreated",
  "incident": {
    "incident_id": "INC-002",
    "tipo": "Ventana rota",
    "urgencia": "alta",
    "ubicacion": "Edificio B",
    ...
  },
  "timestamp": "2025-11-16T12:00:00Z"
}
```

#### 2. `notifyIncidentStatusChanged`
```json
{
  "type": "notifyIncidentStatusChanged",
  "incident": { /* incident data */ },
  "old_status": "pendiente",
  "user": {
    "user_id": "staff001",
    "role": "staff"
  },
  "timestamp": "2025-11-16T12:05:00Z"
}
```

#### 3. `notifyCommentAdded`
```json
{
  "type": "notifyCommentAdded",
  "incident_id": "INC-001",
  "comment": "Trabajo en progreso",
  "commenter_name": "Juan Pérez",
  "timestamp": "2025-11-16T12:10:00Z"
}
```

#### 4. `notifyDepartmentAssigned`
```json
{
  "type": "notifyDepartmentAssigned",
  "incident_id": "INC-001",
  "department": "Mantenimiento",
  "incident": { /* optional incident data */ },
  "timestamp": "2025-11-16T12:15:00Z"
}
```

---

## 📁 File Structure

### Frontend API Layer
- **`lib/api.ts`** - All API functions
- **`lib/hooks/use-websocket.ts`** - WebSocket hook
- **`lib/auth-context.ts`** - Authentication context

### Components
- **`components/dashboard/realtime-updates.tsx`** - WebSocket event display
- **`app/(dashboard)/dashboard/page.tsx`** - Main dashboard with stats
- **`app/(dashboard)/dashboard/incidents/page.tsx`** - Incidents list
- **`app/(dashboard)/dashboard/test-api/page.tsx`** - API testing panel
- **`app/(auth)/login/page.tsx`** - Login page
- **`app/(auth)/register/page.tsx`** - Registration page

---

## 🔧 Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://mzq13io4vk.execute-api.us-east-1.amazonaws.com/dev
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-websocket-id.execute-api.us-east-1.amazonaws.com/dev
```

---

## 📊 Data Types

### Incident States (estado)
- `pendiente` - Pending
- `en_proceso` - In Progress
- `resuelto` - Resolved

### Urgency Levels (urgencia)
- `baja` - Low
- `media` - Medium
- `alta` - High
- `critica` - Critical

### User Roles
- `staff` - Staff member
- `admin` - Administrator

---

## ✅ Implementation Status

| Endpoint | Status | Frontend Function | Component Usage |
|----------|--------|-------------------|-----------------|
| POST /auth/register | ✅ | `registerUser()` | Register page |
| POST /auth/login | ✅ | `login()` | Login page |
| GET /staff/incidents/by-department | ✅ | `listIncidents()` | Incidents page |
| PUT /staff/incidents/:id/status | ✅ | `updateIncidentStatus()` | Test API page |
| POST /staff/incidents/:id/comment | ✅ | `addComment()` | Test API page |
| POST /staff/incidents/:id/assign | ✅ | `assignIncident()` | Test API page |
| GET /staff/incidents/:id/events | ✅ | `getIncidentEvents()` | Test API page |
| GET /staff/incidents/stats | ✅ | `getStaffStats()` | Dashboard page |
| WebSocket Connection | ✅ | `useWebSocket()` | Realtime updates |

---

## 🚀 Quick Start

1. **Login**
   ```typescript
   const auth = await login("staff001", "password123")
   // Saves token to localStorage and cookies
   ```

2. **Fetch Incidents**
   ```typescript
   const incidents = await listIncidents(auth.token, {
     estado: "pendiente",
     urgencia: "alta"
   })
   ```

3. **Update Status**
   ```typescript
   const updated = await updateIncidentStatus(
     auth.token, 
     "INC-001", 
     "en_proceso"
   )
   ```

4. **WebSocket Connection**
   ```typescript
   const { isConnected, messages } = useWebSocket({ 
     token: auth.token 
   })
   // Automatically connects and receives events
   ```

---

## 🐛 Debugging

All API calls include comprehensive console logging:
- `[API]` prefix for API calls
- `[Auth Context]` for authentication
- `[Dashboard Page]` for dashboard operations
- `[Incidents Page]` for incident list operations
- `[WebSocket]` for WebSocket events

Check browser console for detailed request/response logs.
