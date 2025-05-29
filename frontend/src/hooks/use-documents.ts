'use client'
import { useState, useEffect } from 'react'
import baseUrl from '@/hooks/use-api'

export interface Document {
  id: string
  title: string
  file: File
  size: number
  uploadedAt: string
  tags: string[]
}

// Helper function to transform backend document to frontend format
const transformBackendDocument = (backendDoc: any): Document => {
  return {
    id: backendDoc.id.toString(),
    title: backendDoc.title,
    file: backendDoc.file,
    size: backendDoc.size,
    uploadedAt: backendDoc.uploaded_at,
    tags: backendDoc.tags || [],
  }
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])

  // Load documents from backend on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${baseUrl}/documents/`)
        if (response.ok) {
          const data = await response.json()
          console.log(data)
          const transformedDocs = data.documents.map(transformBackendDocument)
          setDocuments(transformedDocs)
        }
      } catch (error) {
        console.error('Error fetching documents:', error)
      }
    }

    fetchDocuments()
  }, [])

  const addDocument = async (doc: Omit<Document, 'id' | 'uploadedAt'>) => {
    try {
      const formData = new FormData()

      // Create a File object from the document data
      formData.append('title', doc.title)
      formData.append('document', doc.file)
      formData.append('tags', JSON.stringify(doc.tags || []))

      // Add tags if they exist in your document structure
      // formData.append('tags', JSON.stringify(doc.tags || []))

      const response = await fetch(`${baseUrl}/documents/upload/`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Document added:', data)

      // Fetch updated documents list
      const documentsResponse = await fetch(`${baseUrl}/documents/`)
      if (documentsResponse.ok) {
        const documentsData = await documentsResponse.json()
        const transformedDocs = documentsData.documents.map(transformBackendDocument)
        setDocuments(transformedDocs)
      }
    } catch (error) {
      console.error('Error adding document:', error)
      throw error
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/documents/${id}/`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Update local state
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  const getDocument = (id: string) => {
    return documents.find((doc) => doc.id === id)
  }

  // Additional helper function to search documents
  const searchDocuments = async (query: string, tags: string[] = []) => {
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      tags.forEach((tag) => params.append('tag', tag))

      const response = await fetch(`${baseUrl}/search_documents/?${params}`)
      if (response.ok) {
        const data = await response.json()
        return data.documents.map(transformBackendDocument)
      }
      return []
    } catch (error) {
      console.error('Error searching documents:', error)
      return []
    }
  }

  return {
    documents,
    addDocument,
    deleteDocument,
    getDocument,
    searchDocuments, // Bonus function for search functionality
  }
}
