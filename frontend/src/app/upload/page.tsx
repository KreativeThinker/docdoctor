'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { Upload, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDocuments } from '@/hooks/use-documents'
import { Button } from '@/components/ui/button'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [previewURL, setPreviewURL] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const router = useRouter()
  const { addDocument } = useDocuments()

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const trimmed = tagInput.trim()
      if (!tags.includes(trimmed)) {
        setTags([...tags, trimmed])
      }
      setTagInput('')
    }
  }

  const handleCancel = () => {
    setFile(null)
    setFileName('')
    setTagInput('')
    setTags([])
    setUploaded(false)
    setPreviewURL('')
  }

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
      setFileName(selectedFile.name)
      setUploaded(false)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)

    try {
      await new Promise((r) => setTimeout(r, 2000))
      const content = await readFileContent(file)
      addDocument({
        name: fileName || file.name,
        content,
        size: file.size,
        type: file.type,
      })
      setUploaded(true)
      setTimeout(() => router.push('/'), 1500)
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewURL(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-foreground text-3xl font-bold">Document Upload</h1>
        <p className="text-neutral-5">
          Upload a document to start chatting with AI about its contents
        </p>
      </div>

      {!file ? (
        <label className="hover:border-primary border-neutral-4 bg-neutral-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-36 shadow-md transition">
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileChange}
            disabled={uploading || uploaded}
            className="hidden"
          />
          <span className="text-foreground text-2xl">📂 Click to upload</span>
          <span className="text-neutral-5 mt-2 text-lg">
            Supported Formats: PDF, TXT, DOC, DOCX, (Max 10MB)
          </span>
        </label>
      ) : (
        <div className="border-neutral-4 bg-neutral-1 m-4 flex h-full w-full flex-col rounded-lg border-2 border-dashed md:flex-row">
          <div className="flex flex-1 items-center justify-center border-b-2 border-dashed p-6 md:border-r-2 md:border-b-0">
            {file.type.includes('pdf') ? (
              <iframe src={previewURL} className="h-full w-full" />
            ) : (
              <p>No preview available</p>
            )}
          </div>

          <div className="flex-1 space-y-4 p-6">
            <div>
              <label className="text-neutral-6 block text-sm font-medium">File Name</label>
              <input
                type="text"
                className="border-neutral-4 bg-neutral-2 mt-1 block w-full rounded-md border p-2"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
              <p className="text-neutral-4 mt-1 text-xs">
                Original: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>

            <div>
              <label className="text-neutral-6 block text-sm font-medium">Tags</label>
              <input
                type="text"
                className="border-neutral-4 bg-neutral-2 mt-1 block w-full rounded-md border p-2"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-neutral-3 text-neutral-7 rounded-full px-2 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={handleCancel} variant="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading || uploaded}
                className="flex items-center space-x-2"
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
              </Button>
            </div>
          </div>
        </div>
      )}

      {uploaded && (
        <div className="text-netrual-3 text-center text-sm">Redirecting to library...</div>
      )}
    </div>
  )
}
