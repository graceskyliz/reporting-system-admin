import { useState } from 'react'

export interface ApiError {
  message: string
  code?: string
  details?: any
}

export function useApiError() {
  const [error, setError] = useState<ApiError | null>(null)

  const handleError = (err: unknown): ApiError => {
    let apiError: ApiError

    if (err instanceof Error) {
      apiError = {
        message: err.message,
        code: 'UNKNOWN_ERROR',
      }
    } else if (typeof err === 'object' && err !== null) {
      apiError = err as ApiError
    } else {
      apiError = {
        message: 'Error desconocido',
        code: 'UNKNOWN_ERROR',
      }
    }

    setError(apiError)
    return apiError
  }

  const clearError = () => setError(null)

  return { error, setError, handleError, clearError }
}
