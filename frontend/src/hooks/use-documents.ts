'use client'

import { useState, useEffect } from 'react'

export interface Document {
  id: string
  name: string
  content: string
  size: number
  type: string
  uploadedAt: string
  tags: string[]
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('documents')
    if (stored) {
      setDocuments(JSON.parse(stored))
    }
  }, [])

  const saveDocuments = (docs: Document[]) => {
    localStorage.setItem('documents', JSON.stringify(docs))
    setDocuments(docs)
  }

  const addDocument = (doc: Omit<Document, 'id' | 'uploadedAt'>) => {
    const newDoc: Document = {
      ...doc,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString(),
    }
    const updatedDocs = [...documents, newDoc]
    saveDocuments(updatedDocs)
  }

  const deleteDocument = (id: string) => {
    const updatedDocs = documents.filter((doc) => doc.id !== id)
    saveDocuments(updatedDocs)
  }

  const getDocument = (id: string) => {
    return documents.find((doc) => doc.id === id)
  }

  return {
    documents,
    addDocument,
    deleteDocument,
    getDocument,
  }
}
