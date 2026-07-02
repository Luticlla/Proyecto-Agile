'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface UploadImagenSedeProps {
  value: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

export function UploadImagenSede({ value, onChange, disabled }: UploadImagenSedeProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Formato no válido. Use JPG, PNG o WebP')
      return
    }

    if (file.size > MAX_SIZE) {
      toast.error('El archivo supera el tamaño máximo de 5MB')
      return
    }

    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/sedes/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir la imagen')
      }

      onChange(data.url)
      toast.success('Imagen subida exitosamente')
    } catch (error: any) {
      toast.error(error.message || 'Error al subir la imagen')
      setPreview(value)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-zinc-800"
          />
          {!disabled && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-white hover:bg-white/20"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-red-400 hover:bg-red-500/20"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="size-4" />
              </Button>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Loader2 className="size-6 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full h-40 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center gap-2 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="size-8 animate-spin" />
          ) : (
            <>
              <ImageIcon className="size-8" />
              <span className="text-sm">Seleccionar imagen</span>
              <span className="text-xs text-zinc-500">JPG, PNG o WebP (máx. 5MB)</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
