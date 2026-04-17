'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useGameStore, furnitureCatalog, getFurnitureByCategory } from '@hallpass/game-engine';

export default function RoomPage() {
  const room = useGameStore((state) => state.room);
  const addFurniture = useGameStore((state) => state.addFurniture);
  const moveFurniture = useGameStore((state) => state.moveFurniture);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const roomRef = useRef<HTMLDivElement>(null);

  const categories = ['bed', 'desk', 'chair', 'storage', 'decor', 'lighting', 'wall'];

  const handleAddFurniture = (item: any) => {
    addFurniture(item, { x: 0.5, y: 0.5, rotation: 0 }, 'center');
    setShowCatalog(false);
  };

  const handleMoveFurniture = (id: string, x: number, y: number) => {
    moveFurniture(id, { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)), rotation: 0 });
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🏠 My Room</h1>

      {/* Room View */}
      <div className="flex justify-center mb-6">
        <div 
          ref={roomRef}
          className="relative bg-[#1a1a2e] rounded-xl overflow-hidden"
          style={{ width: '100%', maxWidth: '800px', height: '500px' }}
        >
          {/* Floor */}
          <div className="absolute inset-0 bg-[#2a2a4a]">
            {room.floorItems.map((item) => (
              <div
                key={item.id}
                className="absolute bg-indigo-500 rounded cursor-move hover:bg-indigo-400 transition-colors"
                style={{
                  left: `${item.position.x * 100}%`,
                  top: `${item.position.y * 100}%`,
                  width: `${(item.item?.dimensions?.width || 1) * 60}px`,
                  height: `${(item.item?.dimensions?.height || 1) * 60}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                draggable
                onDragEnd={(e) => {
                  if (roomRef.current) {
                    const rect = roomRef.current.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    handleMoveFurniture(item.id, x, y);
                  }
                }}
              >
                <span className="text-xs text-white/70 p-1 block">{item.item?.name}</span>
              </div>
            ))}
          </div>
          
          {/* Walls */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-[#16162a] flex items-center justify-center gap-2">
            {room.wallItems.map((item) => (
              <div
                key={item.id}
                className="bg-pink-500 rounded p-2"
                style={{
                  left: `${item.position.x * 100}%`,
                }}
              >
                <span className="text-xs">{item.item?.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center mb-6">
        <button 
          onClick={() => setShowCatalog(!showCatalog)}
          className="px-6 py-3 bg-indigo-500 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
        >
          Add Furniture
        </button>
        <Link href="/">
          <button className="px-6 py-3 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
            Back
          </button>
        </Link>
      </div>

      {/* Furniture Catalog */}
      {showCatalog && (
        <div className="bg-[#16162a] rounded-xl p-6 max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {selectedCategory && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {getFurnitureByCategory(selectedCategory).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddFurniture(item)}
                  className="p-3 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors"
                >
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-gray-400">
                    {item.price} {item.currency}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
