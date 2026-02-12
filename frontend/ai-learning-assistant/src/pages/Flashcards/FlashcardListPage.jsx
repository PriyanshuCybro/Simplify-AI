import React from 'react';
import { Brain } from 'lucide-react';

const FlashcardListPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Flashcards</h1>
      <p className="text-gray-500 mb-8">Test your knowledge with AI-generated flashcards.</p>
      
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border-2 border-dashed">
        <Brain size={48} className="text-gray-200 mb-4" />
        <p className="text-gray-400">Generate flashcards from a document to see them here.</p>
      </div>
    </div>
  );
};

export default FlashcardListPage;