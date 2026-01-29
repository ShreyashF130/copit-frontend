'use client'
import { useState } from 'react'
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/app/lib/supabase-browser'

export default function BulkUploadModal({ shopId, onClose }: { shopId: number, onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  async function handleUpload() {
    if (!file) return
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
        const res = await fetch(`${apiUrl}/api/inventory/bulk-upload?shop_id=${shopId}`, {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        
        if (data.status === 'success') {
            toast.success(data.message)
            onClose() // Close modal
        } else {
            toast.error(data.message)
        }
    } catch (e) {
        toast.error("Upload failed")
    }
    setUploading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="text-emerald-600" /> Bulk Import
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* Drop Zone */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative">
                <input 
                    type="file" 
                    accept=".csv, .xlsx" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {file ? (
                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle size={24} />
                        </div>
                        <p className="font-bold text-slate-700 text-sm truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-slate-400">Ready to upload</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                            <UploadCloud size={24} />
                        </div>
                        <p className="font-bold text-slate-700 text-sm">Click to Upload CSV/Excel</p>
                        <p className="text-xs text-slate-400">Columns: name, price, description</p>
                    </div>
                )}
            </div>

            {/* Helper Text */}
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-xl text-xs font-medium flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span className="font-bold">Required Columns (Exact Spelling):</span>
                </div>
                <ul className="list-disc pl-8 space-y-1 opacity-90">
                    <li><code>name</code> (e.g. Blue Shirt)</li>
                    <li><code>price</code> (e.g. 999)</li>
                    <li><code>category</code> (e.g. Men's Wear)</li>
                    <li><code>stock</code> (Optional, defaults to 0)</li>
                </ul>
                <div className="mt-2 pl-2">
                     <a href="/sample_inventory.csv" className="underline font-black hover:text-blue-900">
                        Download Sample CSV
                     </a>
                </div>
            </div>

            <button 
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
                {uploading ? <Loader2 className="animate-spin" /> : 'Start Import'}
            </button>
        </div>
    </div>
  )
}