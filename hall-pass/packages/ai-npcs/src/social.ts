import { NPC, MemoryEntry, RelationshipStatus } from '@hallpass/game-engine';

// Personality matrix for NPC-to-NPC relationships
interface PersonalityCompatibility {
  trait: string;
  compatibleWith: string[];
  incompatibleWith: string[];
}

const compatibilityMatrix: PersonalityCompatibility[] = [
  { trait: 'jock', compatibleWith: ['popular', 'rebel'], incompatibleWith: ['nerd', 'goth'] },
  { trait: 'nerd', compatibleWith: ['artist', 'goth'], incompatibleWith: ['jock', 'popular'] },
  { trait: 'popular', compatibleWith: ['jock', 'artist'], incompatibleWith: ['nerd', 'goth', 'rebel'] },
  { trait: 'goth', compatibleWith: ['nerd', 'artist', 'rebel'], incompatibleWith: ['jock', 'popular'] },
  { trait: 'artist', compatibleWith: ['nerd', 'goth', 'popular'], incompatibleWith: ['jock'] },
  { trait: 'rebel', compatibleWith: ['goth', 'jock'], incompatibleWith: ['popular'] },
];

// Calculate initial relationship between two NPCs
export function calculateNPCAffinity(npc1: NPC, npc2: NPC): number {
  let affinity = 0;

  // Archetype compatibility
  const npc1Compat = compatibilityMatrix.find(c => c.trait === npc1.archetype);
  if (npc1Compat) {
    if (npc1Compat.compatibleWith.includes(npc2.archetype)) {
      affinity += 20;
    } else if (npc1Compat.incompatibleWith.includes(npc2.archetype)) {
      affinity -= 20;
    }
  }

  // Same archetype bonus/penalty
  if (npc1.archetype === npc2.archetype) {
    affinity += 10; // Same clique, usually friends
  }

  // Trait interactions
  if (npc1.traits.loyal && npc2.traits.loyal) affinity += 10;
  if (npc1.traits.jealous && npc2.traits.ambitious) affinity -= 15;
  if (npc1.traits.romantic && npc2.traits.romantic) affinity += 5;
  if (npc1.traits.gossip && npc2.traits.gossip) affinity += 10;
  if (npc1.traits.protective && npc2.traits.loyal) affinity += 10;

  // Random variance for uniqueness
  affinity += (Math.random() * 20) - 10;

  return Math.max(-50, Math.min(50, affinity));
}

// Generate gossip based on NPC relationships
export function generateGossip(
  npc: NPC,
  allNPCs: NPC[],
  player: { id: string; name: string }
): string[] {
  const gossip: string[] = [];

  // Positive gossip about friends
  const friends = allNPCs.filter(n => 
    npc.npcRelationships[n.id] > 30 && n.id !== npc.id
  );
  
  for (const friend of friends.slice(0, 2)) {
    if (npc.traits.gossip || Math.random() > 0.7) {
      gossip.push(`${friend.name} has been looking good lately.`);
    }
  }

  // Negative gossip about enemies
  const enemies = allNPCs.filter(n => 
    npc.npcRelationships[n.id] < -20 && n.id !== npc.id
  );
  
  for (const enemy of enemies.slice(0, 2)) {
    if (npc.traits.gossip || npc.traits.jealous) {
      const rumors = [
        `I heard ${enemy.name} is spreading rumors.`,
        `${enemy.name} has been acting weird lately.`,
        `Don't trust ${enemy.name}, seriously.`,
      ];
      gossip.push(rumors[Math.floor(Math.random() * rumors.length)]);
    }
  }

  // Player-related gossip
  if (npc.relationship.level > 20) {
    gossip.push(`I've been hearing good things about you, ${player.name}.`);
  } else if (npc.relationship.level < -10) {
    gossip.push(`People are talking about you... not in a good way.`);
  }

  return gossip.length > 0 ? gossip : ['Nothing juicy right now.'];
}

// Simulate social event impact
export function simulateSocialEvent(
  eventType: 'party' | 'fight' | 'breakup' | 'achievement',
  participants: NPC[],
  allNPCs: NPC[]
): { npcId: string; relationshipChanges: Record<string, number> }[] {
  const results: { npcId: string; relationshipChanges: Record<string, number> }[] = [];

  for (const npc of participants) {
    const changes: Record<string, number> = {};

    switch (eventType) {
      case 'party':
        // Everyone gets closer at parties
        for (const other of participants) {
          if (other.id !== npc.id) {
            changes[other.id] = 5;
          }
        }
        break;

      case 'fight':
        // Sides form based on existing relationships
        for (const other of allNPCs) {
          if (other.id === npc.id) continue;
          
          const affinity = npc.npcRelationships[other.id] || 0;
          if (affinity > 20) {
            changes[other.id] = 5; // Support friends
          } else if (affinity < -10) {
            changes[other.id] = -5; // Distance from enemies
          }
        }
        break;

      case 'breakup':
        // Drama spreads
        if (npc.traits.gossip) {
          for (const other of allNPCs) {
            if (other.id !== npc.id && npc.npcRelationships[other.id] > 10) {
              changes[other.id] = 3; // Bond over drama
            }
          }
        }
        break;

      case 'achievement':
        // Jealousy or pride
        for (const other of allNPCs) {
          if (other.id === npc.id) continue;
          
          if (other.traits.jealous && npc.npcRelationships[other.id] < 0) {
            changes[other.id] = -5; // Jealous enemies get more bitter
          } else if (npc.npcRelationships[other.id] > 20) {
            changes[other.id] = 5; // Friends celebrate
          }
        }
        break;
    }

    results.push({ npcId: npc.id, relationshipChanges: changes });
  }

  return results;
}

// Get NPC's opinion about another character
export function getNPCOpinion(
  npc: NPC,
  targetId: string,
  targetName: string,
  targetArchetype: string
): string {
  const relationship = npc.npcRelationships[targetId] || 0;

  if (relationship > 40) {
    return `${targetName}? They're amazing. One of my favorite people.`;
  } else if (relationship > 20) {
    return `${targetName} is pretty cool. We get along.`;
  } else if (relationship > -10) {
    return `${targetName}? I don't really know them that well.`;
  } else if (relationship > -30) {
    return `${targetName}... we don't really vibe.`;
  } else {
    return `Ugh, ${targetName}. Don't even get me started.`;
  }
}
