'use client';

import { useState } from 'react';
import Image from "next/image";
import { Upload, Loader2, Save, FileText } from 'lucide-react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // State untuk form data
  const [formData, setFormData] = useState({
    merchantName: '',
    date: '',
    totalAmount: '',
    currency: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleExtract = async () => {
    if (!image) return alert("Pilih gambar struk terlebih dahulu!");
    
    setLoading(true);
    try {
      const dataTransfer = new FormData();
      dataTransfer.append("file", image);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: dataTransfer,
      });

      if (!response.ok) throw new Error("Gagal mengekstrak data");

      const data = await response.json();
      
      setFormData({
        merchantName: data.merchantName || "",
        date: data.date || "",
        totalAmount: data.totalAmount?.toString() || "",
        currency: data.currency || "",
      });
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan. Pastikan API Key Gemini sudah benar.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('lastReceipt', JSON.stringify(formData));
    alert("Data berhasil disimpan secara lokal!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black text-zinc-900 dark:text-zinc-100">
      <main className="flex flex-1 w-full max-w-4xl mx-auto flex-col items-center py-12 px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="bg-black dark:bg-white p-3 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-white dark:text-black" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            AI Receipt Scanner
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            TP Malaysia AI Intern Assessment • Build Challenge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Left Column: Upload */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" /> Upload Receipt
              </h2>
              
              <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-4 transition-all hover:border-zinc-500 min-h-[300px] bg-zinc-50 dark:bg-zinc-800/50">
                {preview ? (
                  <div className="relative w-full h-64">
                    <Image src={preview} alt="Preview" fill className="object-contain rounded-lg" />
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-zinc-500">Drag & drop or click to upload</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <button 
                onClick={handleExtract}
                disabled={!image || loading}
                className="w-full mt-6 h-12 flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium transition-transform active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : null}
                {loading ? "Analyzing with Gemini..." : "Extract Data"}
              </button>
            </div>
          </div>

          {/* Right Column: Form Result */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Extracted Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Merchant Name</label>
                  <input 
                    type="text"
                    value={formData.merchantName}
                    onChange={(e) => setFormData({...formData, merchantName: e.target.value})}
                    className="w-full mt-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                    placeholder="e.g. Family Mart"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Date</label>
                  <input 
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full mt-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Amount</label>
                    <input 
                      type="text"
                      value={formData.totalAmount}
                      onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                      className="w-full mt-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Currency</label>
                    <input 
                      type="text"
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      className="w-full mt-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                      placeholder="MYR"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full mt-8 h-12 flex items-center justify-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium transition-colors"
              >
                <Save className="w-4 h-4" /> Save Result
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}