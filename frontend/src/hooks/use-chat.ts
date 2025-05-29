'use client'

import { useState } from 'react'
import baseUrl from './use-api'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (message: string) => {
    const userMessage: Message = { role: 'user', content: message }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await fetch(`${baseUrl}}/ask/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message }),
      })
      const data = await res.json()

      const aiResponse: Message = {
        role: 'assistant',
        content: data.answer,
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error occurred.' }])
    } finally {
      setIsLoading(false)
    }
  }
}
