import OpenAI from 'openai';
import { NPC, PlayerProfile, MemoryEntry, RelationshipStatus } from '@hallpass/game-engine';

// OpenAI client configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Conversation context
export interface ConversationContext {
  npc: NPC;
  player: PlayerProfile;
  currentLocation: string;
  recentEvents: MemoryEntry[];
  timeOfDay: 'morning' | 'lunch' | 'afternoon' | 'evening';
  currentStoryBeat?: string;
  playerInput?: string;
}

// Generate NPC personality prompt
function generateNPCPrompt(npc: NPC): string {
  const traitDescriptions = [];
  if (npc.traits.loyal) traitDescriptions.push('loyal to friends');
  if (npc.traits.jealous) traitDescriptions.push('easily jealous');
  if (npc.traits.ambitious) traitDescriptions.push('ambitious and driven');
  if (npc.traits.romantic) traitDescriptions.push('romantically inclined');
  if (npc.traits.gossip) traitDescriptions.push('loves gossip');
  if (npc.traits.protective) traitDescriptions.push('protective of friends');

  return `You are ${npc.name}, a ${npc.archetype} student in high school.
Backstory: ${npc.backstory}
Personality traits: ${traitDescriptions.join(', ') || 'normal high school student'}.
Current mood: ${npc.relationship.currentMood}.
Relationship with player: ${npc.relationship.status} (level: ${npc.relationship.level}).`;
}

// Generate memories context
function generateMemoriesContext(memories: MemoryEntry[]): string {
  if (memories.length === 0) return '';
  
  const recentMemories = memories.slice(0, 5);
  return `Recent memories with player:\n${recentMemories.map(m => 
    `- ${m.description} (${m.sentiment}, impact: ${m.impact > 0 ? '+' : ''}${m.impact})`
  ).join('\n')}`;
}

// Main dialogue generation function
export async function generateNPCDialogue(context: ConversationContext): Promise<{
  response: string;
  emotion: string;
  relationshipImpact: number;
  suggestedResponses?: string[];
}> {
  const { npc, player, currentLocation, recentEvents, timeOfDay, playerInput } = context;

  const systemPrompt = `${generateNPCPrompt(npc)}

${generateMemoriesContext(npc.relationship.memories)}

Current situation:
- Location: ${currentLocation}
- Time: ${timeOfDay}
- Player archetype: ${player.archetype}
- Player reputation: ${player.stats.reputation > 0 ? 'positive' : player.stats.reputation < 0 ? 'negative' : 'neutral'}

You should respond in character as ${npc.name}. Keep responses natural and conversational, 1-3 sentences. Show personality through your words.

Respond in JSON format:
{
  "response": "your dialogue here",
  "emotion": "emotion tag (happy, sad, angry, excited, nervous, cool, etc.)",
  "relationshipImpact": number between -5 and 5,
  "suggestedResponses": ["2-3 options for player to respond"]
}`;

  const userPrompt = playerInput 
    ? `Player says: "${playerInput}"`
    : `The player approaches you at ${currentLocation} during ${timeOfDay}.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    
    return {
      response: parsed.response,
      emotion: parsed.emotion || 'neutral',
      relationshipImpact: parsed.relationshipImpact || 0,
      suggestedResponses: parsed.suggestedResponses || [],
    };
  } catch (error) {
    console.error('Error generating NPC dialogue:', error);
    
    // Fallback response
    return {
      response: generateFallbackResponse(npc, playerInput),
      emotion: 'neutral',
      relationshipImpact: 0,
      suggestedResponses: [
        'Hey, what\'s up?',
        'I gotta go...',
        'Tell me more about that.',
      ],
    };
  }
}

// Fallback responses when AI fails
function generateFallbackResponse(npc: NPC, playerInput?: string): string {
  const fallbacks: Record<RelationshipStatus, string[]> = {
    stranger: [
      "Hey, I don't think we've met properly. I'm ${npc.name}.",
      "Oh, hi. Can I help you with something?",
      "Um, do I know you?",
    ],
    acquaintance: [
      "Oh hey, what's up?",
      "Hey there! How's it going?",
      "Hi! Did you need something?",
    ],
    friend: [
      "Hey! Good to see you!",
      "What's up? Tell me everything!",
      "Dude, you won't believe what just happened...",
    ],
    close_friend: [
      "There you are! I've been looking for you.",
      "Bestie! I have so much to tell you.",
      "Finally, someone who gets me. What's up?",
    ],
    best_friend: [
      "My ride or die! What's the tea?",
      "You know you can tell me anything, right?",
      "If it weren't for you, I'd lose my mind.",
    ],
    dating: [
      "Hey babe, I've been thinking about you...",
      "You look amazing today.",
      "I missed you. Tell me everything.",
    ],
    rival: [
      "Oh, it's you.",
      "What do you want?",
      "I'm busy. Make it quick.",
    ],
    enemy: [
      "Get away from me.",
      "We have nothing to talk about.",
      "Don't even look at me.",
    ],
  };

  const responses = fallbacks[npc.relationship.status] || fallbacks.stranger;
  return responses[Math.floor(Math.random() * responses.length)];
}

// Generate conversation options based on context
export function generateConversationOptions(
  npc: NPC,
  player: PlayerProfile,
  currentLocation: string
): string[] {
  const options = [];

  // Archetype-specific options
  if (player.archetype === npc.archetype || player.secondaryArchetype === npc.archetype) {
    options.push(`Talk about ${npc.archetype} stuff`);
  }

  // Location-specific options
  if (currentLocation === 'cafeteria') {
    options.push('Ask to sit together', 'Share food');
  } else if (currentLocation === 'classroom') {
    options.push('Ask for help with homework', 'Study together');
  } else if (currentLocation === 'gym') {
    options.push('Challenge to a game', 'Work out together');
  }

  // Relationship-specific options
  if (npc.relationship.status === 'stranger') {
    options.push('Introduce yourself', 'Give a compliment');
  } else if (npc.relationship.status === 'friend') {
    options.push('Ask about their day', 'Make plans', 'Share a secret');
  } else if (npc.relationship.status === 'dating') {
    options.push('Flirt', 'Plan a date', 'Give a gift');
  }

  // Always available
  options.push('Small talk', 'Ask for advice', 'Say goodbye');

  return options.slice(0, 4); // Return top 4 options
}

// Analyze player choice impact
export function analyzeChoiceImpact(
  choice: string,
  npc: NPC,
  context: ConversationContext
): {
  impact: number;
  memory: Omit<MemoryEntry, 'id' | 'timestamp'>;
} {
  // Simple keyword-based analysis (can be enhanced with AI)
  const positiveKeywords = ['help', 'compliment', 'gift', 'agree', 'support', 'flirt'];
  const negativeKeywords = ['insult', 'ignore', 'reject', 'betray', 'lie', 'fight'];
  
  const lowerChoice = choice.toLowerCase();
  
  let impact = 0;
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  
  for (const keyword of positiveKeywords) {
    if (lowerChoice.includes(keyword)) {
      impact += 5;
      sentiment = 'positive';
    }
  }
  
  for (const keyword of negativeKeywords) {
    if (lowerChoice.includes(keyword)) {
      impact -= 5;
      sentiment = 'negative';
    }
  }

  // Archetype alignment bonus
  if (npc.archetype === context.player.archetype) {
    impact += 2;
  }

  return {
    impact,
    memory: {
      type: 'conversation',
      description: `Player chose to: ${choice}`,
      sentiment,
      impact,
    },
  };
}
