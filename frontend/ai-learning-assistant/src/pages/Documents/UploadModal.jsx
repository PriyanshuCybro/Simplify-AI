import React, { useState, useRef } from 'react';
import { X, Upload, File, Loader2 } from 'lucide-react';
import { uploadDocument } from '../../services/api';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null); // Reference to the hidden input field

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const resetModal = () => {
    setFile(null);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Physically clear the input
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file); 

    try {
      await uploadDocument(formData);
      alert("Document uploaded successfully.");
      
      // CRITICAL FIX: Reset state so next upload starts fresh
      resetModal(); 
      
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please check your connection or file size.");
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Upload PDF</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center flex flex-col items-center bg-blue-50/30 transition-all">
          <Upload className="text-blue-500 mb-4" size={40} />
          
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange} 
            className="hidden" 
            id="modalFileInput" 
            ref={fileInputRef} // Attached ref to clear input later
          />
          
          <label 
            htmlFor="modalFileInput" 
            className="cursor-pointer text-blue-600 font-medium hover:text-blue-700 break-all px-4"
          >
            {file ? file.name : "Click to choose a PDF file"}
          </label>
          
          {file && (
            <button 
              onClick={resetModal} 
              className="mt-2 text-xs text-red-500 hover:underline"
            >
              Remove file
            </button>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={handleClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={uploading || !file}
            className="flex-[2] bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <File size={18} />
                <span>Upload & Analyze</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;