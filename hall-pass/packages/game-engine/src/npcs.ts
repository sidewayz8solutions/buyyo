// Sample NPCs for initial game state
import { NPC } from './types';

export const initialNPCs: NPC[] = [
  {
    id: 'npc_jake_morrison',
    name: 'Jake Morrison',
    avatar: 'jock_male_1',
    archetype: 'jock',
    traits: {
      loyal: true,
      jealous: false,
      ambitious: true,
      romantic: false,
      gossip: false,
      protective: true,
    },
    backstory: 'Star quarterback with a secret love for poetry. His dad expects him to go pro, but Jake dreams of being a writer.',
    schedule: {
      morning: 'football practice',
      lunch: 'athletes table',
      afternoon: 'gym or football field',
      evening: 'studying (reluctantly)',
    },
    relationship: {
      level: 0,
      status: 'stranger',
      memories: [],
      lastInteraction: new Date(),
      currentMood: 'confident',
    },
    npcRelationships: {
      npc_chloe_chen: 30, // Friends
      npc_alex_rivera: -20, // Rival
    },
  },
  {
    id: 'npc_chloe_chen',
    name: 'Chloe Chen',
    avatar: 'nerd_female_1',
    archetype: 'nerd',
    traits: {
      loyal: true,
      jealous: false,
      ambitious: true,
      romantic: true,
      gossip: false,
      protective: false,
    },
    backstory: 'Valedictorian candidate who runs the school robotics club. Secretly writes fanfiction about her classmates.',
    schedule: {
      morning: 'library',
      lunch: 'robotics club room',
      afternoon: 'coding competitions or study groups',
      evening: 'online gaming',
    },
    relationship: {
      level: 0,
      status: 'stranger',
      memories: [],
      lastInteraction: new Date(),
      currentMood: 'focused',
    },
    npcRelationships: {
      npc_jake_morrison: 30,
      npc_brittany_klein: -10,
    },
  },
  {
    id: 'npc_brittany_klein',
    name: 'Brittany Klein',
    avatar: 'popular_female_1',
    archetype: 'popular',
    traits: {
      loyal: false,
      jealous: true,
      ambitious: true,
      romantic: true,
      gossip: true,
      protective: false,
    },
    backstory: 'Head cheerleader and queen bee. Maintains her status through carefully curated social media and strategic friendships.',
    schedule: {
      morning: 'cheer practice',
      lunch: 'popular table',
      afternoon: 'student council or shopping',
      evening: 'parties or social media',
    },
    relationship: {
      level: 0,
      status: 'stranger',
      memories: [],
      lastInteraction: new Date(),
      currentMood: 'calculating',
    },
    npcRelationships: {
      npc_chloe_chen: -10,
      npc_alex_rivera: 40,
      npc_raven_blackwood: -50,
    },
  },
  {
    id: 'npc_raven_blackwood',
    name: 'Raven Blackwood',
    avatar: 'goth_female_1',
    archetype: 'goth',
    traits: {
      loyal: true,
      jealous: false,
      ambitious: false,
      romantic: true,
      gossip: false,
      protective: true,
    },
    backstory: 'Art student who plays bass in a local band. Acts tough but is deeply empathetic. Has a complicated family situation.',
    schedule: {
      morning: 'art room',
      lunch: 'band practice room',
      afternoon: 'art studio or music store',
      evening: 'band gigs or sketching',
    },
    relationship: {
      level: 0,
      status: 'stranger',
      memories: [],
      lastInteraction: new Date(),
      currentMood: 'mysterious',
    },
    npcRelationships: {
      npc_brittany_klein: -50,
      npc_marcus_johnson: 25,
    },
  },
  {
    id: 'npc_marcus_johnson',
    name: 'Marcus Johnson',
    avatar: 'artist_male_1',
    archetype: 'artist',
    traits: {
      loyal: true,
      jealous: false,
      ambitious: true,
      romantic: false,
      gossip: false,
      protective: false,
    },
    backstory: 'Street artist turned gallery hopeful. Balances creative passion with family expectations.',
    schedule: {
      morning: 'art room',
      lunch: 'sketching in courtyard',
      afternoon: 'art club or community center',
      evening: 'painting murals or gallery events',
    },
    relationship: {
      level: 0,
      status: 'stranger',
      memories: [],
      lastInteraction: new Date(),
      currentMood: 'inspired',
    },
    npcRelationships: {
      npc_raven_blackwood: 25,
      npc_tyreke_williams: 60,
    },
  },
  {
    id: 'npc_tyreke_williams',
    name: 'Tyreke Williams',
    avatar: 'rebel_male_1',
    archetype: 'rebel',
    traits: {
      loyal: true,
      jealous: false,
      ambitious: false,
      romantic: true,
      gossip: true,
      protective: true,
    },
    backstory: 'Skate punk with a heart of gold. Often in detention but always stands up for the underdogs.',
    schedule: {
      morning: 'skate park (skipping class)',
      lunch: 'back of cafeteria',
      afternoon: 'detention or skate park',
      evening: 'underground shows or pranks',
    },
    relationship: {
      level: 0,
      status: 'stranger',
      memories: [],
      lastInteraction: new Date(),
      currentMood: 'defiant',
    },
    npcRelationships: {
      npc_marcus_johnson: 60,
      npc_alex_rivera: -30,
    },
  },
  {
    id: 'npc_alex_rivera',
    name: 'Alex Rivera',
    avatar: 'hybrid_male_1',
    archetype: 'hybrid',
    traits: {
      loyal: false,
      jealous: true,
      ambitious: true,
      romantic: false,
      gossip: true,
      protective: false,
    },
    backstory: 'Academic decathlete who plays varsity soccer. Struggles with being too good at everything and having no real friends.',
    schedule: {
      morning: 'honors classes',
      lunch: 'varies - never consistent',
      afternoon: 'soccer practice or debate club',
      evening: 'studying alone',
    },
    relationship: {
      level: 0,
      status: 'stranger',
      memories: [],
      lastInteraction: new Date(),
      currentMood: 'competitive',
    },
    npcRelationships: {
      npc_jake_morrison: -20,
      npc_tyreke_williams: -30,
    },
  },
  {
    id: 'npc_sofia_garcia',
    name: 'Sofia Garcia',
    avatar: 'artist_female_1',
    archetype: 'artist',
    traits: {
      loyal: true,
      jealous: false,
      ambitious: true,
      romantic: true,
      gossip: false,
      protective: true,
    },
    backstory: 'Dance team captain who choreographs for school plays. Wants to be a professional choreographer but faces family pressure to become a doctor.',
    schedule: {
      morning: 'dance practice',
      lunch: 'dance studio',
      afternoon: 'theater rehearsals',
      evening: 'dance competitions or creating routines',
    },
    relationship: {
      level: 0,
      status: 'stranger',
      memories: [],
      lastInteraction: new Date(),
      currentMood: 'expressive',
    },
    npcRelationships: {
      npc_brittany_klein: 15,
      npc_chloe_chen: 20,
    },
  },
];

// NPC utilities
export function getNPCById(id: string): NPC | undefined {
  return initialNPCs.find((npc) => npc.id === id);
}

export function getNPCsByArchetype(archetype: string): NPC[] {
  return initialNPCs.filter((npc) => npc.archetype === archetype);
}

export function getNPCsByRelationshipLevel(minLevel: number): NPC[] {
  return initialNPCs.filter((npc) => npc.relationship.level >= minLevel);
}
