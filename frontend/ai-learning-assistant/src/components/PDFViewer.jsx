import React, { useState, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  RotateCcw, Maximize2, Loader2, AlertCircle 
} from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simplify-ai-mrrh.onrender.com";

const PDFJS_VERSION = pdfjs.version;
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ pdfPath, fileName }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔥 FIX: Cloudinary links are public URLs. 
    // We REMOVED httpHeaders because they block requests to Cloudinary.
    const fileProp = useMemo(() => {
        if (!pdfPath) return null;
        
        // 🔥 FIX: Agar Cloudinary URL hai (https://res.cloudinary...) toh direct load karo
        if (pdfPath.startsWith('http')) {
            // Kabhi-kabhi Cloudinary 'http' bhejta hai, use 'https' mein convert karna safe rehta hai
            return pdfPath.replace('http://', 'https://');
        }
        
        // ⚠️ WARNING: Agar path 'uploads/' se shuru ho raha hai, toh iska matlab ye purana data hai
        // Render par ye folder nahi hota, isliye ise null kar dena chahiye taaki error handle ho sake
        console.warn("⚠️ Purana local path detect hua, ye Render par nahi chalega:", pdfPath);
        
        // Agar aap local testing kar rahe hain tabhi localhost jodein, warna Render par ise block karein
        if (import.meta.env.MODE === 'development') {
            const baseUrl = import.meta.env.VITE_API_URL || 'https://simplify-ai-mrrh.onrender.com';
            return `${baseUrl}/${pdfPath.replace(/\\/g, '/')}`;
        }

        return null; // Production (Render) par local paths ko reject kar do
    }, [pdfPath]);

    const options = useMemo(() => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`,
        disableFontFace: true 
    }), []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
        setError(null);
    };

    const handleDocumentError = (err) => {
        console.error('❌ PDF Load Error:', err);
        setError("Unable to load PDF. Please check if the file exists on the server.");
        setLoading(false);
    };

    const openInNewTab = () => window.open(pdfPath, '_blank');

    if (!pdfPath) return <div className="text-white text-center p-10 font-black">NO PDF PATH PROVIDED</div>;
    

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* --- PREMIUM TOOLBAR --- */}
            <div className="bg-[#2d2d2d] px-6 py-4 flex items-center justify-between border-b border-white/5 z-30">
                <div className="flex items-center gap-4 max-w-[30%]">
                    <button onClick={openInNewTab} className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-all">
                        <Maximize2 className="text-red-500" size={16} />
                    </button>
                    <p className="text-white/90 font-bold text-xs truncate uppercase tracking-tighter">{fileName}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5">
                        <button 
                            disabled={pageNumber <= 1} 
                            onClick={() => setPageNumber(prev => prev - 1)}
                            className="p-2 text-white/40 hover:text-white disabled:opacity-10 transition-colors"
                        >
                            <ChevronLeft size={20}/>
                        </button>
                        <div className="px-4 text-[11px] font-black text-blue-400 min-w-[80px] text-center border-x border-white/5">
                            {pageNumber} <span className="text-white/20 mx-1">/</span> {numPages || '--'}
                        </div>
                        <button 
                            disabled={pageNumber >= numPages} 
                            onClick={() => setPageNumber(prev => prev + 1)}
                            className="p-2 text-white/40 hover:text-white disabled:opacity-10 transition-colors"
                        >
                            <ChevronRight size={20}/>
                        </button>
                    </div>

                    <div className="flex items-center gap-1 border-l border-white/10 pl-4">
                        <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2 text-white/40 hover:text-blue-400 transition-colors">
                            <ZoomOut size={18}/>
                        </button>
                        <span className="text-[10px] font-black text-white/80 w-12 text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(s + 0.2, 3.0))} className="p-2 text-white/40 hover:text-blue-400 transition-colors">
                            <ZoomIn size={18}/>
                        </button>
                        <button 
                            onClick={() => { setScale(1.0); setPageNumber(1); }}
                            className="ml-2 p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
                            title="Reset View"
                        >
                            <RotateCcw size={16}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- VIEWPORT --- */}
            <div className="flex-1 overflow-auto bg-[#121212] flex justify-center p-8 custom-scrollbar">
                {error ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <AlertCircle className="text-red-500" size={48} />
                        <p className="text-white font-bold uppercase text-xs tracking-widest">{error}</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase">Retry Connection</button>
                    </div>
                ) : (
                    <Document
                        file={fileProp}
                        options={options}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={handleDocumentError}
                        loading={
                            <div className="flex flex-col items-center gap-4 mt-20">
                                <Loader2 className="animate-spin text-blue-500" size={40} />
                                <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em]">Neural PDF Loading...</p>
                            </div>
                        }
                        className="flex flex-col items-center shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                    >
                        <Page 
                            pageNumber={pageNumber} 
                            scale={scale} 
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="bg-white border border-white/5 rounded-sm transition-all duration-300"
                        />
                    </Document>
                )}
            </div>

            <div className="bg-[#2d2d2d] px-6 py-2 border-t border-white/5 flex justify-between items-center">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Cloud Node Active</p>
                {numPages && <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Verified {numPages} Neural Pages</p>}
            </div>
        </div>
    );
};

export default PDFViewer;