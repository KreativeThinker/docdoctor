'use client'

import { useEffect, useState } from 'react'
import baseUrl from '@/hooks/use-api'

export interface Document {
  id: number
  title: string
  file_url: string
  uploaded_at: string
  tags: string[]
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/documents/`)
      const data = await res.json()
      setDocuments(data.documents)
    } catch (err) {
      console.error('Failed to fetch documents', err)
    } finally {
      setLoading(false)
    }
  }

  const uploadDocument = async (file: File, tags: string[] = []) => {
    const formData = new FormData()
    formData.append('document', file)
    tags.forEach((tag) => formData.append('tags', tag))

    try {
      const res = await fetch(`${baseUrl}/documents/upload/`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      await fetchDocuments()
    } catch (err) {
      console.error('Failed to upload', err)
    }
  }

  const deleteDocument = async (id: number) => {
    try {
      await fetch(`${baseUrl}/documents/${id}/`, {
        method: 'DELETE',
      })
      setDocuments((docs) => docs.filter((d) => d.id !== id))
    } catch (err) {
      console.error('Failed to delete', err)
    }
  }

  return {
    documents,
    loading,
    uploadDocument,
    deleteDocument,
    refresh: fetchDocuments,
  }
}
