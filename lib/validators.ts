export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): ValidationError | null {
  if (!email) return { field: 'email', message: 'El email es requerido' }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Ingrese un email válido' }
  }
  
  return null
}

export function validatePassword(password: string): ValidationError | null {
  if (!password) return { field: 'password', message: 'La contraseña es requerida' }
  if (password.length < 6) {
    return { field: 'password', message: 'La contraseña debe tener al menos 6 caracteres' }
  }
  return null
}

export function validateIncidentStatus(status: string): ValidationError | null {
  const validStatuses = ['pending', 'in_progress', 'resolved']
  if (!validStatuses.includes(status)) {
    return { field: 'status', message: 'Estado inválido' }
  }
  return null
}

export function validateIncidentPriority(priority: string): ValidationError | null {
  const validPriorities = ['low', 'medium', 'high', 'critical']
  if (!validPriorities.includes(priority)) {
    return { field: 'priority', message: 'Prioridad inválida' }
  }
  return null
}

export function validateIncidentTitle(title: string): ValidationError | null {
  if (!title) return { field: 'title', message: 'El título es requerido' }
  if (title.length < 5) {
    return { field: 'title', message: 'El título debe tener al menos 5 caracteres' }
  }
  if (title.length > 200) {
    return { field: 'title', message: 'El título no debe exceder 200 caracteres' }
  }
  return null
}

export function validateIncidentDescription(description: string): ValidationError | null {
  if (!description) return { field: 'description', message: 'La descripción es requerida' }
  if (description.length < 10) {
    return { field: 'description', message: 'La descripción debe tener al menos 10 caracteres' }
  }
  if (description.length > 2000) {
    return { field: 'description', message: 'La descripción no debe exceder 2000 caracteres' }
  }
  return null
}
