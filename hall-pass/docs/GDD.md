# Hall Pass — Game Design Document

**Version:** 1.0  
**Genre:** Life Simulation / Visual Novel / Casual  
**Platform:** iOS, Android, Web  
**Monetization:** IAP + Ads

---

## 🎯 Core Concept

**Hall Pass** is a high school life simulator where players create their ideal student persona, navigate social dynamics, customize their personal space, and experience branching storylines. The game blends The Sims' customization with visual novel choice-making and idle/mini-game progression.

**Key Hook:** Your bedroom is your sanctuary — fully customizable and a reflection of your in-game identity. What you hang on your walls affects how NPCs perceive you.

---

## 🎨 Art Direction

**Visual Style:** Stylized 3D (low-poly) with cel-shading influences  
**Color Palette:** Vibrant but grounded — think *Life is Strange* meets *The Sims*  
**UI Style:** Minimalist, neon accents, high school aesthetic (lockers, notebooks, polaroids)

---

## 👤 Character System

### Archetypes (Primary)

Players choose a primary archetype at character creation, but can hybridize through gameplay:

| Archetype | Core Stats | Vibe | Room Aesthetic |
|-----------|------------|------|----------------|
| **Jock** | Athletic +2, Social +1 | Sports teams, competition | Trophies, jerseys, team photos |
| **Nerd** | Knowledge +2, Creative +1 | Academics, gaming, tech | Books, PC setup, science posters |
| **Popular** | Social +2, Athletic +1 | Social hierarchy, events | Vanity, fashion, selfie wall |
| **Goth** | Creative +2, Knowledge +1 | Art, music, subculture | Dark colors, band posters, candles |
| **Artist** | Creative +2, Social +1 | Visual arts, expression | Canvases, supplies, gallery wall |
| **Rebel** | Social +1, Athletic +1, Creative +1 | Breaking rules, pranks | Skateboards, graffiti, band stickers |

### Character Stats

```typescript
interface CharacterStats {
  athletic: number;      // 0-100
  knowledge: number;     // 0-100
  social: number;        // 0-100
  creative: number;      // 0-100
  cool: number;          // 0-100 (general currency for purchases)
  reputation: number;    // School-wide standing (-100 to +100)
}
```

### Hybrid System

Players aren't locked into one archetype. Actions build secondary stats:
- Jock who studies becomes "Scholar Athlete"
- Goth who parties becomes "Dark Socialite"
- Nerd who works out becomes "Buff Geek"

**Benefits:** Hybrid characters unlock unique dialogue options and furniture sets.

---

## 🏠 Room Customization System

### Room Zones

```
┌─────────────────────────────────────┐
│  [WALL 1]    [WALL 2]    [WALL 3]  │
│                                     │
│       [BED]        [DESK]          │
│                                     │
│   [WARDROBE]      [FLOOR DECOR]    │
│                                     │
│         [WINDOW]  [DOOR]           │
└─────────────────────────────────────┘
```

### Furniture Categories

| Category | Items | Unlock Method |
|----------|-------|---------------|
| **Bed** | Basic, Loft, Canopy, Futon, Gaming | Starter + Purchase |
| **Desk** | Basic, Gaming Setup, Art Station, Vanity | Archetype + Purchase |
| **Walls** | Paint, Posters, Tapestries, Shelves | Earn/Purchase |
| **Flooring** | Carpet, Wood, Tiles, Rugs | Purchase |
| **Lighting** | Lamp, LED Strips, Fairy Lights, Neon | Purchase |
| **Decor** | Plants, Trophies, Photos, Collectibles | Achievements + Purchase |

### Room Impact

Your room affects gameplay:
- **Gaming Setup** → Unlock e-sports mini-game
- **Art Station** → Faster creative skill gain
- **Trophies** → Jock NPCs respect you more
- **Book Collection** → Nerd NPCs befriend easier

---

## 🤖 AI NPC System

### NPC Archetypes

Every NPC has a primary archetype + hidden traits:

```typescript
interface NPC {
  id: string;
  name: string;
  archetype: Archetype;
  hiddenTraits: {
    loyal: boolean;
    jealous: boolean;
    ambitious: boolean;
    romantic: boolean;
  };
  relationship: {
    level: number;        // -100 (enemy) to 100 (best friend)
    status: 'stranger' | 'acquaintance' | 'friend' | 'close_friend' | 'dating' | 'enemy';
    memory: MemoryEntry[];  // NPC remembers your choices
  };
  schedule: DailySchedule;
}
```

### Memory System

NPCs remember everything:
```typescript
interface MemoryEntry {
  id: string;
  type: 'conversation' | 'gift' | 'betrayal' | 'help' | 'shared_activity';
  description: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
  impact: number;  // -10 to +10
}
```

**Example:** If you promised to help Jake study and bailed, he'll remember and trust you less next time.

### Dynamic Dialogue

NPCs generate context-aware responses using AI:

```typescript
// Dialogue context passed to AI
dialogueContext = {
  npc: NPC,
  player: Player,
  currentLocation: 'cafeteria' | 'classroom' | 'gym' | 'hallway',
  recentEvents: MemoryEntry[],
  timeOfDay: 'morning' | 'lunch' | 'afternoon',
  currentStoryBeat: string
}
```

### Relationship Web

NPCs have relationships with EACH OTHER:
- If you're friends with the popular girl, her enemies might dislike you
- Dating someone creates ripple effects through their friend group
- Gossip spreads — actions in one scene affect unrelated NPCs later

---

## 🎮 Mini-Game System

### Academic Games

| Game | Archetype | Mechanics | Reward |
|------|-----------|-----------|--------|
| **Quiz Bowl** | Nerd | Timed trivia, categories vary | Knowledge Points |
| **Chem Lab** | Nerd | Mixing compounds puzzle | Knowledge + Items |
| **Code Break** | Nerd | Logic puzzles, hacking minigame | Knowledge + Unlockables |

### Athletic Games

| Game | Archetype | Mechanics | Reward |
|------|-----------|-----------|--------|
| **Basketball Shootout** | Jock | Timing-based shooting | Athletic Points |
| **Track Sprint** | Jock | Rhythm tapping | Athletic Points |
| **Weight Room** | Jock | Tap-tap progression | Athletic Points |

### Social Games

| Game | Archetype | Mechanics | Reward |
|------|-----------|-----------|--------|
| **Cafeteria Dash** | All | Diner Dash style serving | Cool Points |
| **Party Planner** | Popular | Resource management | Social Points |
| **Gossip Chain** | Popular | Memory game — pass message correctly | Social Points |

### Creative Games

| Game | Archetype | Mechanics | Reward |
|------|-----------|-----------|--------|
| **Art Studio** | Artist/Goth | Drawing/painting physics | Creative Points |
| **Band Practice** | Goth/Artist | Rhythm game (guitar hero style) | Creative Points |
| **Photo Shoot** | All | Framing/composition game | Creative Points |

### Universal Games

| Game | Mechanics | Reward |
|------|-----------|--------|
| **Locker Organization** | Tetris-style packing | Cool Points |
| **Hallway Navigation** | Avoid bullies, find friends | Cool Points |
| **Social Media** | Photo editing, hashtag game | Social Points |

---

## 📖 Story System

### Year Structure

```
Freshman Year (Tutorial + Freedom)
  ↓
Sophomore Year (First Major Choice)
  ↓
Junior Year (Relationships Deepen)
  ↓
Senior Year (Climax + Multiple Endings)
```

### Story Beats

**Daily Structure:**
1. **Morning** — Bedroom (customize, check phone)
2. **Classes** — Passive skill gain + random events
3. **Lunch** — Social time (choose who to sit with)
4. **Afternoon** — Club/Activity choice
5. **Evening** — Mini-games, room customization, phone/social

### Major Story Arcs

**Arc 1: The Freshman**
- Choose your first friends
- First mini-game unlocks
- Room customization tutorial
- First "big choice" (save someone from bullying?)

**Arc 2: Sophomore Slump**
- Academic pressure increases
- Romance options open up
- Clique rivalries emerge
- Club leadership opportunity

**Arc 3: Junior Year Drama**
- Relationships tested
- College prep stress
- Major school event (prom prep? talent show?)
- Betrayal or loyalty moment

**Arc 4: Senior Legacy**
- Final choices matter most
- Multiple ending paths:
  - **Valedictorian** (max knowledge)
  - **Prom King/Queen** (max social)
  - **Sports Scholarship** (max athletic)
  - **Art School Bound** (max creative)
  - **Social Outcast** (low reputation)
  - **Balanced Graduate** (well-rounded)

### Choice Consequences

**Example Choice Tree:**
```
[Bully confrontation in hallway]
    ↓
┌───────────┬───────────┬───────────┐
↓           ↓           ↓           ↓
Intervene   Ignore      Record it   Join in
    ↓           ↓           ↓           ↓
+Rep,       No change,  +Nerd       -Rep,
+Jock       -Hidden     friends,    +Bully
friends     progress    unlock      friends,
                            evidence    dark ending
```

---

## 💰 Monetization System

### Currency Types

| Currency | Earned By | Spent On | IAP? |
|----------|-----------|----------|------|
| **Cool Points** | Mini-games, daily login | Basic furniture, outfits | No |
| **Archetype Points** | Archetype activities | Archetype upgrades | No |
| **Hall Passes** | Rare achievements, IAP | Premium items | Yes ($) |

### IAP Offerings

**Furniture Packs ($2.99 - $4.99):**
- Gamer Paradise Pack (LED everything, triple monitor setup)
- Boho Dreams Pack (plants, tapestries, fairy lights)
- Luxury Living Pack (modern minimalist, high-end)
- Punk Rock Pack (graffiti, band posters, distressed)

**Outfit Packs ($1.99 - $3.99):**
- Limited Edition drops (seasonal)
- Collab packs (real brand partnerships)
- Exclusive sets (only available for 7 days)

**Story Expansions ($1.99):**
- Summer Vacation DLC
- Spring Break Adventure
- Winter Formal Special

**Premium Passes:**
- **VIP Status** ($9.99/mo) — 2x earnings, exclusive items
- **Ad-Free** ($4.99 one-time)
- **Infinite Energy** ($19.99 one-time)

**Gacha System (Cosmetic Only):**
- "Locker Loot Boxes" — $0.99 for random decor
- Guaranteed rare every 10 pulls
- No pay-to-win — purely cosmetic

### Rewarded Ads

- Watch ad for +50% Cool Points (1 hour)
- Watch ad to retry failed mini-game
- Watch ad for bonus daily reward

---

## 🏫 Locations

### School Map

```
┌─────────────────────────────────────────┐
│  GYM          │    CAFETERIA           │
│  - Basketball │    - Social hub         │
│  - Track      │    - Mini-game          │
├───────────────┼────────────────────────┤
│  CLASSROOMS   │    HALLWAYS            │
│  - Academic   │    - Random events      │
│  - Mini-games │    - NPC encounters     │
├───────────────┼────────────────────────┤
│  LIBRARY      │    ART ROOM            │
│  - Study      │    - Creative           │
│  - Research   │    - Mini-games         │
├───────────────┴────────────────────────┤
│           MAIN ENTRANCE                 │
└─────────────────────────────────────────┘
```

### Home (Bedroom)

The player's sanctuary:
- Customize freely
- Check phone (social media, texts from NPCs)
- Study (boost knowledge)
- Sleep (energy reset)
- Plan outfit (affects school interactions)

---

## 📱 Social Features

### In-Game Phone

**Apps:**
- **Messages** — NPCs text you; choices in replies
- **SocialFeed** — See NPC posts, like/comment
- **PhotoAlbum** — Screenshots of your room/outfits
- **Store** — IAP shop
- **Map** — Fast travel between locations

### Real Social (Optional)

- Share room designs
- Friend codes to visit others' rooms
- Leaderboards (mini-game high scores)
- Trading (future feature)

---

## 🔧 Technical Implementation

### State Management

```typescript
// Game State
interface GameState {
  player: {
    id: string;
    name: string;
    archetype: Archetype;
    stats: CharacterStats;
    year: 1 | 2 | 3 | 4;
    room: RoomState;
    inventory: Item[];
    outfits: Outfit[];
  };
  npcs: NPC[];
  story: {
    currentArc: string;
    completedArcs: string[];
    choices: ChoiceRecord[];
  };
  progress: {
    coolPoints: number;
    archetypePoints: Record<Archetype, number>;
    achievements: string[];
    miniGameHighScores: Record<string, number>;
  };
  meta: {
    lastLogin: Date;
    streakDays: number;
    vipStatus: boolean;
    vipExpiry?: Date;
  };
}
```

### Data Persistence

- **Local:** AsyncStorage (offline play)
- **Cloud:** Supabase (cross-device sync)
- **Conflict Resolution:** Server-wins for currency, local-wins for room layout

---

## 📊 Success Metrics

### KPIs

| Metric | Target |
|--------|--------|
| D1 Retention | 40% |
| D7 Retention | 20% |
| D30 Retention | 10% |
| ARPDAU | $0.05 |
| Conversion Rate | 3% |
| Avg. Session Length | 12 min |
| Sessions per day | 3.5 |

---

## 🗓️ Roadmap

### MVP (Month 1-2)
- [x] Character creation
- [x] 3 mini-games
- [x] Basic room customization
- [x] 10 NPCs with static dialogue
- [x] Freshman year story

### Beta (Month 3-4)
- [ ] AI-powered NPC dialogue
- [ ] 10+ mini-games
- [ ] All 4 years of story
- [ ] Full room customization
- [ ] IAP implementation

### Launch (Month 5)
- [ ] Polish & balance
- [ ] Seasonal content
- [ ] Social features
- [ ] Marketing push

### Post-Launch
- [ ] Monthly content updates
- [ ] Brand collaborations
- [ ] User-generated content
- [ ] Expansion: College Years DLC
