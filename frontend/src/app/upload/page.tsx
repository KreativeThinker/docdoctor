'use client'

import type React from 'react'

import { useState } from 'react'
import { Upload, FileText, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDocuments } from '@/hooks/use-documents'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const router = useRouter()
  const { addDocument } = useDocuments()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Please select a PDF, TXT, or Word document')
        return
      }
      setFile(selectedFile)
      setUploaded(false)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    try {
      // Simulate file processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Read file content
      const content = await readFileContent(file)

      // Add document to localStorage
      addDocument({
        name: file.name,
        content,
        size: file.size,
        type: file.type,
      })

      setUploaded(true)
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        resolve(content)
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Document</h1>
        <p className="text-gray-600">
          Upload a document to start chatting with AI about its contents
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Select Document</h2>
          <p className="text-gray-600">Supported formats: PDF, TXT, DOC, DOCX (Max 10MB)</p>
        </div>
        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Choose file
            </label>
            <input
              id="file"
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileChange}
              disabled={uploading || uploaded}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
          </div>

          {file && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {uploaded && <CheckCircle className="h-6 w-6 text-green-500" />}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleUpload}
              disabled={!file || uploading || uploaded}
              className="flex flex-1 items-center justify-center space-x-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : uploaded ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Uploaded Successfully</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </div>

          {uploaded && (
            <div className="text-center text-sm text-gray-600">Redirecting to library...</div>
          )}
        </div>
      </div>
    </div>
  )
}
