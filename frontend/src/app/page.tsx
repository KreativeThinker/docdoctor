'use client'

import { FileText, Trash2, MessageSquare, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useDocuments } from '@/hooks/use-documents'
import NavLink from '@/components/ui/link'

export default function LibraryPage() {
  const { documents, deleteDocument } = useDocuments()

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Document Library</h1>
          <p className="text-neutral-5">Manage your uploaded documents and start conversations</p>
        </div>
        <NavLink href="/upload" active>
          Upload Document
        </NavLink>
      </div>

      {documents.length === 0 ? (
        <div className="bg-neutral-1/60 flex rounded-xl shadow-sm">
          <div className="border-neutral-4 m-4 h-full w-full rounded-lg border-3 border-dashed py-36 text-center">
            <FileText className="text-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="text-neutral-6 mb-2 text-lg font-semibold">No documents yet</h3>
            <p className="text-neutral-5 mb-4">
              Upload your first document to get started with AI-powered conversations
            </p>
            <NavLink href="/upload" className="mx-auto w-fit" active>
              Upload Document
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex min-w-0 flex-1 items-center space-x-2">
                    <FileText className="h-5 w-5 flex-shrink-0 text-blue-500" />
                    <h3 className="truncate text-lg font-semibold text-gray-900">{doc.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="rounded p-1 text-red-500 transition-colors hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
                    {formatFileSize(doc.size)}
                  </span>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  href={`/chat?doc=${doc.id}`}
                  className="flex w-full items-center justify-center space-x-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
