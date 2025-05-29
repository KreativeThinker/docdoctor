'use client'

import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (message: string, documentContent: string) => {
    const userMessage: Message = { role: 'user', content: message }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Simulate AI response - replace with actual AI API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const aiResponse: Message = {
        role: 'assistant',
        content: `I understand you're asking about: "${message}". Based on the document content, here's my response. (This is a simulated response - integrate with your preferred AI service like OpenAI, Anthropic, etc.)`,
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
  }
}
