'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export type WebSocketEvent = 
  | 'notifyIncidentCreated'
  | 'notifyIncidentStatusChanged'
  | 'notifyCommentAdded'
  | 'notifyDepartmentAssigned'

export interface IncidentCreatedEvent {
  type: 'notifyIncidentCreated'
  incident: any
  timestamp: string
}

export interface IncidentStatusChangedEvent {
  type: 'notifyIncidentStatusChanged'
  incident: any
  old_status: string
  user: any
  timestamp: string
}

export interface CommentAddedEvent {
  type: 'notifyCommentAdded'
  incident_id: string
  comment: string
  commenter_name: string
  timestamp: string
}

export interface DepartmentAssignedEvent {
  type: 'notifyDepartmentAssigned'
  incident_id: string
  department: string
  incident?: any
  timestamp: string
}

export type WebSocketMessage = 
  | IncidentCreatedEvent
  | IncidentStatusChangedEvent
  | CommentAddedEvent
  | DepartmentAssignedEvent

interface UseWebSocketOptions {
  url?: string
  token?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://your-websocket-url.com',
    token,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (!token) {
      console.log('[WebSocket] No token provided, skipping connection')
      return
    }

    try {
      console.log('[WebSocket] Connecting to:', url)
      const ws = new WebSocket(`${url}?token=${token}`)
      
      ws.onopen = () => {
        console.log('[WebSocket] Connected')
        setIsConnected(true)
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage
          console.log('[WebSocket] Message received:', data)
          
          const messageWithTimestamp = {
            ...data,
            timestamp: data.timestamp || new Date().toISOString()
          }
          
          setLastMessage(messageWithTimestamp)
          setMessages(prev => [messageWithTimestamp, ...prev].slice(0, 50)) // Keep last 50 messages
        } catch (err) {
          console.error('[WebSocket] Error parsing message:', err)
        }
      }

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error)
      }

      ws.onclose = () => {
        console.log('[WebSocket] Disconnected')
        setIsConnected(false)
        wsRef.current = null

        // Attempt reconnection
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          console.log(`[WebSocket] Reconnecting... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        } else {
          console.log('[WebSocket] Max reconnection attempts reached')
        }
      }

      wsRef.current = ws
    } catch (err) {
      console.error('[WebSocket] Connection error:', err)
    }
  }, [url, token, reconnectInterval, maxReconnectAttempts])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      console.log('[WebSocket] Disconnecting')
      wsRef.current.close()
      wsRef.current = null
    }
    
    setIsConnected(false)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setLastMessage(null)
  }, [])

  useEffect(() => {
    if (token) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [token, connect, disconnect])

  return {
    isConnected,
    lastMessage,
    messages,
    connect,
    disconnect,
    clearMessages
  }
}
