'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGameStore, getNPCById } from '@hallpass/game-engine';
import { generateNPCDialogue, analyzeChoiceImpact } from '@hallpass/ai-npcs';

export default function NPCPage() {
  const params = useParams();
  const npcId = params.id as string;
  
  const npc = useGameStore((state) => state.npcs.find((n) => n.id === npcId)) || getNPCById(npcId);
  const player = useGameStore((state) => state.player);
  const interactWithNPC = useGameStore((state) => state.interactWithNPC);
  const addNPCMemory = useGameStore((state) => state.addNPCMemory);
  
  const [dialogue, setDialogue] = useState<string>('');
  const [emotion, setEmotion] = useState<string>('neutral');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ speaker: string; text: string; emotion?: string }>>([]);

  const getCurrentTimeOfDay = (): 'morning' | 'lunch' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 14) return 'lunch';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  useEffect(() => {
    if (npc) {
      loadInitialGreeting();
    }
  }, [npc]);

  const loadInitialGreeting = async () => {
    if (!npc) return;
    
    setLoading(true);
    try {
      const result = await generateNPCDialogue({
        npc,
        player,
        currentLocation: 'hallway',
        recentEvents: npc.relationship.memories.slice(0, 3),
        timeOfDay: getCurrentTimeOfDay(),
      });
      
      setDialogue(result.response);
      setEmotion(result.emotion);
      setConversationHistory([{ speaker: npc.name, text: result.response, emotion: result.emotion }]);
    } catch (error) {
      setDialogue(`Hey, I'm ${npc.name}. What's up?`);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (responseType: string) => {
    if (!npc) return;
    
    setLoading(true);
    
    const playerText = getResponseText(responseType);
    setConversationHistory(prev => [...prev, { speaker: 'You', text: playerText }]);
    
    const impact = analyzeChoiceImpact(responseType, npc, {
      npc,
      player,
      currentLocation: 'hallway',
      recentEvents: [],
      timeOfDay: getCurrentTimeOfDay(),
    });
    
    interactWithNPC(npc.id, responseType, impact.impact);
    addNPCMemory(npc.id, impact.memory);
    
    try {
      const result = await generateNPCDialogue({
        npc,
        player,
        currentLocation: 'hallway',
        recentEvents: npc.relationship.memories.slice(0, 3),
        timeOfDay: getCurrentTimeOfDay(),
        playerInput: playerText,
      });
      
      setDialogue(result.response);
      setEmotion(result.emotion);
      setConversationHistory(prev => [...prev, { speaker: npc.name, text: result.response, emotion: result.emotion }]);
    } catch (error) {
      setDialogue('...');
    } finally {
      setLoading(false);
    }
  };

  const getResponseText = (type: string): string => {
    const responses: Record<string, string> = {
      friendly: 'Hey! How are you doing?',
      flirt: 'You look really nice today...',
      insult: 'What are you looking at?',
      help: 'Do you need help with anything?',
      gossip: 'Have you heard the latest?',
    };
    return responses[type] || '...';
  };

  const getRelationshipColor = (level: number): string => {
    if (level > 50) return '#4ade80';
    if (level > 20) return '#22d3ee';
    if (level > -10) return '#a1a1aa';
    if (level > -30) return '#fbbf24';
    return '#ef4444';
  };

  const getEmotionEmoji = (emotion: string): string => {
    const emojis: Record<string, string> = {
      happy: '😊', sad: '😢', angry: '😠', excited: '🤩',
      nervous: '😰', cool: '😎', mysterious: '🌙', neutral: '😐',
    };
    return emojis[emotion] || '😐';
  };

  const ArchetypeBadge = ({ archetype }: { archetype: string }) => {
    const colors: Record<string, string> = {
      jock: '#ef4444', nerd: '#3b82f6', popular: '#ec4899',
      goth: '#6366f1', artist: '#f59e0b', rebel: '#10b981', hybrid: '#a1a1aa',
    };
    const color = colors[archetype] || '#a1a1aa';
    return (
      <span className="px-2 py-1 rounded text-xs font-bold tracking-wider border" style={{ color, borderColor: color, backgroundColor: `${color}20` }}>
        {archetype.toUpperCase()}
      </span>
    );
  };

  if (!npc) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white p-6">
        <p className="text-red-400">NPC not found</p>
        <Link href="/school"><button className="mt-4 text-indigo-400">← Back</button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6">
      {/* Header */}
      <div className="bg-[#16162a] p-6 rounded-xl mb-6">
        <div className="flex items-center gap-4">
          <div className="text-6xl">👤</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{npc.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <ArchetypeBadge archetype={npc.archetype} />
            </div>
            <div className="mt-3">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all" 
                  style={{ width: `${Math.max(0, Math.min(100, (npc.relationship.level + 100) / 2))}%`, backgroundColor: getRelationshipColor(npc.relationship.level) }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: getRelationshipColor(npc.relationship.level) }}>
                {npc.relationship.status.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 mb-6 max-h-96 overflow-y-auto">
        {conversationHistory.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.speaker === 'You' ? 'text-right' : ''}`}>
            <div className={`inline-block max-w-[80%] p-4 rounded-xl ${msg.speaker === 'You' ? 'bg-indigo-500' : 'bg-[#16162a]'}`}>
              <p className="text-xs text-gray-400 mb-1">{msg.speaker}</p>
              {msg.emotion && <span className="text-lg mr-2">{getEmotionEmoji(msg.emotion)}</span>}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-400 italic">Typing...</p>}
      </div>

      {/* Response Options */}
      <div className="bg-[#16162a] p-4 rounded-xl">
        <p className="font-bold mb-4">How do you respond?</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleResponse('friendly')} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">👋 Friendly</button>
          <button onClick={() => handleResponse('flirt')} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">💕 Flirt</button>
          <button onClick={() => handleResponse('insult')} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">😤 Insult</button>
          <button onClick={() => handleResponse('help')} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">🤝 Help</button>
          <button onClick={() => handleResponse('gossip')} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">📢 Gossip</button>
          <Link href="/school"><button className="px-4 py-2 text-gray-400 hover:text-white">👋 Leave</button></Link>
        </div>
      </div>
    </div>
  );
}
