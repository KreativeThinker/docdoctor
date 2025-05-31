'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { FileText, Send, Bot, User } from 'lucide-react'
import { useDocuments } from '@/hooks/use-documents'
import { useChat } from '@/hooks/use-chat'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const docId = searchParams.get('doc')
  const { getDocument } = useDocuments()
  const { messages, input, setInput, sendMessage, isLoading } = useChat()
  const [document, setDocument] = useState<any>(null)

  useEffect(() => {
    if (docId) {
      const doc = getDocument(docId)
      setDocument(doc)
    }
  }, [docId, getDocument])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && document) {
      sendMessage(input, document.content)
      setInput('')
    }
  }

  console.log(document)

  if (!document) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="bg-neutral-1 rounded-lg border border-gray-200 p-8 text-center shadow-sm">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">No document selected</h3>
          <p className="text-gray-600">
            Please select a document from the library to start chatting
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Document Panel */}
      <div className="w-1/2">
        <div className="bg-neutral-1 flex h-full flex-col rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
              <FileText className="h-5 w-5" />
              <span>{document.name}</span>
            </h2>
          </div>
          <div className="flex-1 overflow-hidden p-6">
            <div className="h-full">
              <iframe src={`http://localhost:3003${document.file}`} className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="w-1/2">
        <div className="bg-neutral-1 flex h-full flex-col rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
              <Bot className="h-5 w-5" />
              <span>Chat with Document</span>
            </h2>
          </div>
          <div className="flex flex-1 flex-col p-6">
            {/* Messages */}
            <div className="mb-4 h-full flex-1 overflow-y-scroll">
              <div className="space-y-4 overflow-y-scroll">
                {messages.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    <Bot className="mx-auto mb-2 h-8 w-8" />
                    <p>Start a conversation about your document!</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="bg-neutral-2/80 flex h-8 w-8 items-center justify-center rounded-full p-1">
                        <Bot className="text-primary h-full w-full" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.role === 'user'
                          ? 'text-neutral-1 bg-primary'
                          : 'bg-neutral-2/80 text-accent'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full p-1">
                        <User className="text-neutral-1 h-full w-full" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                      <Bot className="text-primary h-4 w-4" />
                    </div>
                    <div className="rounded-lg bg-gray-100 px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                          style={{ animationDelay: '0.1s' }}
                        />
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about the document..."
                disabled={isLoading}
                className="focus:ring-primary flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="text-neutral-1 bg-primary rounded-md px-4 py-2 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
