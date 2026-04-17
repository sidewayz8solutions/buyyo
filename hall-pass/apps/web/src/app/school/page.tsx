'use client';

import Link from 'next/link';
import { useGameStore, initialNPCs } from '@hallpass/game-engine';

export default function SchoolPage() {
  const npcs = useGameStore((state) => state.npcs.length > 0 ? state.npcs : initialNPCs);

  const locations = [
    { name: 'Cafeteria', icon: '🍽️', description: 'Lunch hangout spot' },
    { name: 'Classroom', icon: '📚', description: 'Study and learn' },
    { name: 'Gym', icon: '🏀', description: 'Sports and fitness' },
    { name: 'Library', icon: '📖', description: 'Quiet study zone' },
    { name: 'Art Room', icon: '🎨', description: 'Creative space' },
    { name: 'Hallway', icon: '🚶', description: 'Social hub' },
  ];

  const ArchetypeBadge = ({ archetype }: { archetype: string }) => {
    const colors: Record<string, string> = {
      jock: '#ef4444',
      nerd: '#3b82f6',
      popular: '#ec4899',
      goth: '#6366f1',
      artist: '#f59e0b',
      rebel: '#10b981',
      hybrid: '#a1a1aa',
    };
    const color = colors[archetype] || '#a1a1aa';
    return (
      <span 
        className="px-2 py-1 rounded text-xs font-bold tracking-wider border"
        style={{ color, borderColor: color, backgroundColor: `${color}20` }}
      >
        {archetype.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6">
      <h1 className="text-3xl font-bold mb-2">🏫 School</h1>
      <p className="text-gray-400 mb-6">Explore and meet people</p>

      {/* Locations */}
      <h2 className="text-xl font-bold mb-4">Locations</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {locations.map((location) => (
          <div key={location.name} className="bg-[#16162a] p-4 rounded-xl text-center hover:bg-[#1a1a2e] transition-colors">
            <div className="text-3xl mb-2">{location.icon}</div>
            <h3 className="font-bold">{location.name}</h3>
            <p className="text-sm text-gray-400">{location.description}</p>
          </div>
        ))}
      </div>

      {/* People */}
      <h2 className="text-xl font-bold mb-4">People at School</h2>
      <div className="space-y-3">
        {npcs.map((npc) => (
          <Link key={npc.id} href={`/npc/${npc.id}`}>
            <div className="bg-[#16162a] p-4 rounded-xl flex items-center gap-4 hover:bg-[#1a1a2e] transition-colors cursor-pointer">
              <div className="text-4xl">👤</div>
              <div className="flex-1">
                <h3 className="font-bold">{npc.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <ArchetypeBadge archetype={npc.archetype} />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {npc.relationship.status === 'stranger' ? 'Never met' : npc.relationship.status}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/">
        <button className="mt-6 px-6 py-3 text-indigo-400 hover:text-indigo-300 transition-colors">
          ← Back to Home
        </button>
      </Link>
    </div>
  );
}
