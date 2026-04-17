'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGameStore, initialNPCs } from '@hallpass/game-engine';
import { 
  Button as RNButton, 
  StatBadge as RNStatBadge, 
  Currency as RNCurrency, 
  ArchetypeBadge as RNArchetypeBadge,
  colors 
} from '@hallpass/shared-ui';

// Web-compatible wrapper components
const Button = ({ title, onPress, variant = 'primary', size = 'md', style }: any) => (
  <button
    onClick={onPress}
    className={`rounded-lg font-semibold transition-all ${
      variant === 'primary' 
        ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
        : variant === 'secondary'
        ? 'bg-gray-800 hover:bg-gray-700 text-white'
        : 'text-indigo-400 hover:text-indigo-300'
    } ${
      size === 'sm' ? 'px-3 py-2 text-sm' : size === 'lg' ? 'px-6 py-4 text-lg' : 'px-4 py-3'
    }`}
    style={style}
  >
    {title}
  </button>
);

const Card = ({ children, style }: any) => (
  <div className="bg-[#16162a] rounded-xl p-6 shadow-lg" style={style}>
    {children}
  </div>
);

const StatBadge = ({ label, value, color }: any) => {
  const percentage = Math.min(100, Math.max(0, value));
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-400 uppercase">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const Currency = ({ amount, type }: any) => {
  const config = {
    cool: { icon: '❄️', color: '#22d3ee' },
    hallpass: { icon: '🎟️', color: '#fbbf24' },
    points: { icon: '⭐', color: '#f472b6' },
  };
  const { icon, color } = config[type as keyof typeof config];
  return (
    <div className="flex items-center gap-1">
      <span>{icon}</span>
      <span className="font-bold" style={{ color }}>{amount.toLocaleString()}</span>
    </div>
  );
};

const ArchetypeBadge = ({ archetype }: any) => {
  const archetypeColors: Record<string, string> = {
    jock: '#ef4444',
    nerd: '#3b82f6',
    popular: '#ec4899',
    goth: '#6366f1',
    artist: '#f59e0b',
    rebel: '#10b981',
    hybrid: '#a1a1aa',
  };
  const color = archetypeColors[archetype] || '#a1a1aa';
  return (
    <span 
      className="px-2 py-1 rounded text-xs font-bold tracking-wider border"
      style={{ color, borderColor: color, backgroundColor: `${color}20` }}
    >
      {archetype.toUpperCase()}
    </span>
  );
};

export default function HomePage() {
  const player = useGameStore((state) => state.player);
  const currency = useGameStore((state) => state.currency);
  const meta = useGameStore((state) => state.meta);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const quickActions = [
    { title: 'My Room', icon: '🏠', href: '/room', color: '#22d3ee' },
    { title: 'School', icon: '🏫', href: '/school', color: '#f472b6' },
    { title: 'Mini Games', icon: '🎮', href: '/games', color: '#4ade80' },
    { title: 'Shop', icon: '🛍️', href: '/shop', color: '#fbbf24' },
  ];

  const archetypeColors: Record<string, string> = {
    jock: '#ef4444',
    nerd: '#3b82f6',
    popular: '#ec4899',
    goth: '#6366f1',
    artist: '#f59e0b',
    rebel: '#10b981',
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-gray-400">{greeting},</p>
          <h1 className="text-3xl font-bold">{player.name || 'Student'}</h1>
        </div>
        <ArchetypeBadge archetype={player.archetype} />
      </div>

      {/* Currency Bar */}
      <div className="flex gap-6 mb-6 bg-[#16162a] p-4 rounded-xl">
        <Currency amount={currency.coolPoints} type="cool" />
        <Currency amount={currency.hallPasses} type="hallpass" />
      </div>

      {/* Stats */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <h2 className="text-xl font-bold mb-4">Your Stats</h2>
        <StatBadge label="Athletic" value={player.stats.athletic} color={archetypeColors.jock} />
        <StatBadge label="Knowledge" value={player.stats.knowledge} color={archetypeColors.nerd} />
        <StatBadge label="Social" value={player.stats.social} color={archetypeColors.popular} />
        <StatBadge label="Creative" value={player.stats.creative} color={archetypeColors.artist} />
        <StatBadge label="Cool" value={player.stats.cool} color="#22d3ee" />
      </Card>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href}>
            <div 
              className="bg-[#16162a] p-6 rounded-xl text-center border-2 hover:scale-105 transition-transform cursor-pointer"
              style={{ borderColor: action.color }}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <span className="font-semibold" style={{ color: action.color }}>{action.title}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Year Status */}
      <Card style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 className="text-2xl font-bold mb-2">
          {player.year === 1 && '🌟 Freshman Year'}
          {player.year === 2 && '📚 Sophomore Year'}
          {player.year === 3 && '🎓 Junior Year'}
          {player.year === 4 && '🏆 Senior Year'}
        </h2>
        <p className="text-gray-400">{meta.streakDays} day streak! Keep it up!</p>
      </Card>

      {/* VIP Status */}
      {meta.vipStatus && (
        <div className="bg-[#fbbf24]/20 border border-[#fbbf24] p-4 rounded-xl text-center mb-6">
          <p className="text-[#fbbf24] font-bold text-lg">👑 VIP MEMBER</p>
          <p className="text-[#fbbf24]/80 text-sm">2x earnings active</p>
        </div>
      )}

      {/* NPCs Preview */}
      <h2 className="text-xl font-bold mb-4">People at School</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {initialNPCs.slice(0, 4).map((npc) => (
          <Link key={npc.id} href={`/npc/${npc.id}`}>
            <div className="bg-[#16162a] p-4 rounded-xl min-w-[100px] text-center cursor-pointer hover:bg-[#1a1a2e] transition-colors">
              <div className="text-4xl mb-2">👤</div>
              <p className="text-sm font-medium mb-2">{npc.name}</p>
              <ArchetypeBadge archetype={npc.archetype} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
