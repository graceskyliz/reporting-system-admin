import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea el campo ubicacion que puede ser un string o un objeto {edificio, piso}
 */
export function formatUbicacion(ubicacion: string | { edificio?: string; piso?: string } | null | undefined): string {
  if (!ubicacion) return 'Sin ubicación'
  
  if (typeof ubicacion === 'string') return ubicacion
  
  const { edificio, piso } = ubicacion
  if (edificio && piso) return `${edificio}, Piso ${piso}`
  if (edificio) return edificio
  if (piso) return `Piso ${piso}`
  
  return 'Sin ubicación'
}
