# Navigator — UX Handoff Document
**Version:** v34 (App) + v9 (Homepage)  
**Prepared for:** UI Planning Platform  
**Audience:** UI Designers  
**Scope:** All UX features, flows, states, logic, animations, and edge cases. No styling opinions included.

---

## Table of Contents
1. [Screens & Views](#1-screens--views)
2. [User Flows & Navigation](#2-user-flows--navigation)
3. [Interactive Components & States](#3-interactive-components--states)
4. [Data Structures](#4-data-structures)
5. [Gating Logic & Conditions](#5-gating-logic--conditions)
6. [Animations & Transitions](#6-animations--transitions)
7. [Edge Cases & Empty States](#7-edge-cases--empty-states)
8. [Homepage Specifics](#8-homepage-specifics)

---

## 1. Screens & Views

### 1.1 Start Screen (`screen-start`)
**Entry condition:** App load, or user navigates home  
**Purpose:** User defines what they want to learn and how

**Sections (top to bottom):**
- **Learning type selector** — 2 cards: "Skill" (default selected), "Subject"
- **Mode selector** — 3 cards: "Full Roadmap" (default), "Sprint Blueprint", "YouTube-Based"
- **Skill/subject input** — text input with autocomplete dropdown (max 6–8 suggestions)
- **Free toggle** — labeled switch that enables preview/free mode
- **Recent roadmaps section** — conditionally visible list (hidden if no history)
- **Primary CTA button** — "Build My Roadmap"

**Exit conditions:**
- Full Roadmap mode → `screen-fingerprint`
- Sprint mode → `screen-sprint`
- YouTube mode → `screen-youtube`

---

### 1.2 Fingerprint Screen (`screen-fingerprint`)
**Entry condition:** User completes Start screen in Full Roadmap mode  
**Purpose:** 90-second diagnostic to understand how the user learns

**Sections:**
- **Progress indicators** — row of bars showing completion across all questions (9–14 total)
- **Question display area** — one question shown at a time
- **Multi-hint toggle** — visible only on certain questions
- **Answer grid** — 4 cards labeled A, B, C, D with option text
- **Back / Next buttons** — Next is disabled until an answer is selected

**Exit conditions:**
- All questions answered → `screen-gap`

---

### 1.3 Skill Gap Screen (`screen-gap`)
**Entry condition:** User completes Fingerprint  
**Purpose:** Establish user's current knowledge level

**Sections:**
- **5 level cards** (single-select):
  - 0 — Never heard of it
  - 1 — Know the basics
  - 2 — Intermediate
  - 3 — Advanced
  - 4 — Expert
- **Continue button** — disabled until a level is selected

**Exit conditions:**
- Selection made + Continue → `screen-time`

---

### 1.4 Time & Schedule Screen (`screen-time`)
**Entry condition:** User completes Skill Gap  
**Purpose:** Calibrate roadmap length to user's availability

**Sections:**
- **Hours per day slider** — real-time display label updates as user drags (default: 1.5h)
- **Days per week slider** — real-time display label updates (default: 5d)
- **Timeline estimation rows** — show estimated completion time based on current slider values, updated live
- **Build button** — triggers roadmap generation

**Exit conditions:**
- Build clicked → `screen-generating`

---

### 1.5 Sprint Blueprint Screen (`screen-sprint`)
**Entry condition:** User selects "Sprint Blueprint" mode on Start screen  
**Purpose:** Define a short-term intensive learning goal

**Sections:**
- **Days input field** — number input (how many days for the sprint)
- **Goal textarea** — free text describing what they want to achieve
- **Build button**

**Exit conditions:**
- Build clicked → `screen-generating`

---

### 1.6 YouTube-Based Screen (`screen-youtube`)
**Entry condition:** User selects "YouTube-Based" mode on Start screen  
**Purpose:** Generate a roadmap anchored to specific YouTube creators

**Sections:**
- **Source selector** — 2 cards: "One Creator" (default), "Multiple"
- **Single creator input** — text field with creator name suggestions (visible when "One Creator" selected)
- **Multi-creator field** — hidden by default, shown when "Multiple" selected
- **Creator count buttons** — 2, 3, or 4 (visible in multiple mode)
- **AI pick toggle card** — let AI choose the best creators instead of specifying manually
- **Level selector** — 3 cards: Beginner, Some knowledge, Advanced
- **Build button**

**Exit conditions:**
- Build clicked → `screen-generating`

---

### 1.7 Generating Screen (`screen-generating`)
**Entry condition:** User clicks Build on any screen  
**Purpose:** Show progress while roadmap is being generated

**Sections:**
- **Animated icon** — pulsing visual element
- **Status text** — rotates through messages every ~1.8s (e.g. "Searching videos…", "Analyzing patterns…", "Building your roadmap…")
- **Loading dots** — three animated dots
- **Error display area** — hidden by default, shown on failure with message + "Try Again" button

**Exit conditions:**
- Generation success → `screen-roadmap`
- Generation failure → stays on screen, shows error

---

### 1.8 Roadmap Display Screen (`screen-roadmap`)
**Entry condition:** Roadmap successfully generated or loaded from history  
**Purpose:** Main learning interface

**Sections (top to bottom):**
1. **Preview CTA banner** — shown only if user is not authenticated; contains sign-in action
2. **Bottleneck banner** — shown if AI detects a learning block; dismissable
3. **Toolbar** — Share, Export PDF, Toggle Layout (vertical/horizontal), other actions
4. **Progress bar + stats** — "X% complete · X/Y steps done"
5. **Legend** — step type indicators (theory, practice, project)
6. **Phases wrapper** — vertical or horizontal layout mode
   - Each phase: collapsible header + steps list
7. **Community paths section** — other users' roadmap paths for this skill
8. **Daily study planner section** — expandable day-by-day schedule
9. **Unlearn list section** — bad habits to discard with correct alternatives
10. **Salary insights section** — shown only when applicable (skill has salary data)

**Exit conditions:**
- Home link → `screen-start`
- "Build another" → `screen-start`

---

## 2. User Flows & Navigation

### 2.1 Full Roadmap Flow
```
Start Screen
  → [Skill selected, Full Roadmap mode]
  → Fingerprint Screen (9–14 questions, sequential)
  → Skill Gap Screen
  → Time & Schedule Screen
  → Generating Screen
  → Roadmap Display Screen
```

### 2.2 Sprint Blueprint Flow
```
Start Screen
  → [Skill selected, Sprint Blueprint mode]
  → Sprint Blueprint Screen
  → Generating Screen
  → Roadmap Display Screen
```

### 2.3 YouTube-Based Flow
```
Start Screen
  → [Skill selected, YouTube-Based mode]
  → YouTube-Based Screen
  → Generating Screen
  → Roadmap Display Screen
```

### 2.4 Authentication Fork
```
User clicks "Build My Roadmap"
  → If authenticated: proceeds normally
  → If not authenticated:
      → Redirected to auth page
      → After sign-in: returns to app with skill preserved in URL query param
      → Resumes from appropriate screen
```

### 2.5 Return User Flow
```
App loads with active session
  → Loads last roadmap ID from localStorage
  → Progress and settings restored
  → Roadmap Display Screen shown directly (no re-generation)
```

### 2.6 Free/Preview Flow
```
User enables Free toggle on Start Screen
  → Bypasses auth check
  → Shows placeholder roadmap (hardcoded)
  → Preview CTA banner visible throughout
  → Auth-gated features visible but non-functional
```

### 2.7 Navigation Actions
- **Back button** — returns to previous screen (not available on Start screen)
- **Home link** — always returns to Start screen
- **Profile menu** — accessible from fixed nav bar; opens profile dropdown
- **Recent roadmaps** — click any entry to load that saved roadmap

---

## 3. Interactive Components & States

### 3.1 Selection Cards (Mode / Learning Type / Level)
| State | Behavior |
|-------|----------|
| Default | Unselected, neutral appearance |
| Hover | Subtle border/background lift |
| Selected | Distinct border + background change |
| Disabled | Not applicable (all selectable) |

**Interaction:** Single-select within a group; selecting one deselects others  
**Transition:** 200ms ease

---

### 3.2 Text Input (Skill/Creator Autocomplete)
| State | Behavior |
|-------|----------|
| Default | Empty, placeholder text visible |
| Focus | Border highlights |
| Typing | Autocomplete dropdown appears below |
| Dropdown item hover | Item highlights |
| Dropdown item click | Field populated, dropdown closes |

**Autocomplete:** Max 6–8 items visible; scrollable if more matches

---

### 3.3 Primary / Build Button
| State | Behavior |
|-------|----------|
| Default | Active, clickable |
| Hover | Slight opacity reduction + upward shift |
| Disabled | Reduced opacity, cursor default |
| Loading | Disabled immediately after click |

**Disabled triggers:** Required input empty, required selection not made  
**Transition:** 150ms

---

### 3.4 Back Button
| State | Behavior |
|-------|----------|
| Default | Always active on non-Start screens |
| Hover | Subtle lift |

---

### 3.5 Toggle Switch (Free Mode)
| State | Behavior |
|-------|----------|
| Off | Thumb at left position |
| On | Thumb at right position |

**Interaction:** Click toggles state  
**Transition:** 200ms  
**Effect when on:** Enables free/preview mode for the session

---

### 3.6 Sliders (Hours/Days)
| State | Behavior |
|-------|----------|
| Default | Thumb at default position |
| Dragging | Display label updates in real-time |
| Release | Value locked, timeline rows update |

**Labels:** Always visible above/beside slider showing current value

---

### 3.7 Fingerprint Answer Cards (A/B/C/D)
| State | Behavior |
|-------|----------|
| Default | Unselected |
| Hover | Border/background lift |
| Selected | Distinct highlight |

**Interaction:** Single-select per question; enables Next button  
**Next button:** Disabled until selection made

---

### 3.8 Phase Headers (Roadmap)
| State | Behavior |
|-------|----------|
| Collapsed | Chevron pointing down; step list hidden |
| Expanded | Chevron rotated 180°; step list visible |

**Interaction:** Click header to toggle  
**Transition:** Height animates via grid-template-rows (250ms ease); chevron rotates simultaneously

---

### 3.9 Step / Node Cards
| State | Behavior |
|-------|----------|
| Upcoming | Normal appearance |
| Active | Distinct border/glow indicator |
| Completed | Reduced opacity, title has strikethrough, checkmark visible |
| Hover | Slight scale up, shadow increase (180ms) |

**Interaction:** Click checkbox to toggle completion; progress bar and stats update immediately

---

### 3.10 Checkboxes (Step Completion)
| State | Behavior |
|-------|----------|
| Unchecked | Empty box with border |
| Checked | Filled with checkmark |

**Interaction:** Click to toggle  
**Effect:** Marks step done/undone, recalculates progress percentage

---

### 3.11 Toolbar Buttons (Roadmap)
| Button | Action |
|--------|--------|
| Share | Opens share menu (animated entry, positioned near button) |
| Export PDF | Triggers PDF generation (auth-gated) |
| Toggle Layout | Switches between vertical and horizontal phase layout |

---

### 3.12 Layout Toggle (Vertical / Horizontal)
| State | Behavior |
|-------|----------|
| Vertical (default) | Phases stack top-to-bottom |
| Horizontal | Phases lay side-by-side; steps scroll left-right |

**Button:** Shows active state when horizontal mode engaged

---

### 3.13 Profile Dropdown
Three internal views, navigated via back button:

**View 1 — Menu List**
- Profile details link
- System settings link  
- Sign out action

**View 2 — Profile Details**
- Editable name field
- Editable email field
- Editable password field
- Back button → View 1

**View 3 — System Settings**
- Layout preference
- Pace preference
- Other app preferences
- Back button → View 1

**Trigger:** Click profile icon in nav  
**Dismiss:** Click outside dropdown

---

### 3.14 Share Menu
| State | Behavior |
|-------|----------|
| Hidden | Not visible |
| Open | Animated entry (200ms); positioned near Share button |

**Contents:** Share options (copy link, platform shares)  
**Dismiss:** Click outside or press Escape

---

### 3.15 Bottleneck Banner
| State | Behavior |
|-------|----------|
| Hidden | Not shown |
| Visible | Appears at top of roadmap area |

**Trigger condition:** AI detects user has avoided or revisited same phase/step repeatedly  
**Contents:** Title describing the block + 3 alternative learning methods  
**Dismiss:** Close button; removed for current session

---

### 3.16 Preview CTA Banner
| State | Behavior |
|-------|----------|
| Hidden | User is authenticated |
| Visible | User is not authenticated |

**Contents:** Prompt to sign in + Sign In button  
**Position:** Top of roadmap screen  
**Effect of signing in:** Banner disappears, real roadmap generates

---

### 3.17 Skill Crossover Modal
**Trigger:** Crossover feature button (advanced feature)  
**Contents:**
- Skill input A (with autocomplete)
- Skill input B (with autocomplete)
- "Find the Multiplier" button
- Result area: shows calculated crossover effect or "No significant crossover found"

**States:**
| State | Behavior |
|-------|----------|
| Hidden | Not shown |
| Open | Overlay + centered modal |
| Loading | After button click, calculating |
| Result shown | Multiplier or no-match message displayed |

**Close:** X button or click overlay

---

### 3.18 Recent Roadmaps Widget (Start Screen)
| State | Behavior |
|-------|----------|
| Hidden | No history exists |
| Visible | List of saved roadmaps |

**Per-item contents:** Skill name, date created, progress percentage  
**Per-item actions:**
- Click item → loads that roadmap
- X button → removes from history (no confirmation)

---

### 3.19 Toast Notifications
**Trigger:** Various actions (share success, error, etc.)  
**Position:** Fixed top-center, backdrop blur  
**Entry:** Animated in (200ms)  
**Auto-dismiss:** After a few seconds

---

### 3.20 Resource Chips (Step Cards)
**Display:** Inline badges inside step cards  
**Contents per chip:** Icon + resource title + source label + quality rating + duration  
**Interaction:** Click → opens resource URL

---

### 3.21 Daily Study Planner (Roadmap)
| State | Behavior |
|-------|----------|
| Collapsed (default) | Summary visible |
| Expanded | Full day-by-day breakdown visible |

**Toggle:** Button or click to expand/collapse

---

## 4. Data Structures

### 4.1 App State Object
```
state = {
  learningType: 'skill' | 'subject',
  skill: string,
  mode: 'full' | 'sprint' | 'youtube',
  fingerprint: { [question_key]: answer_letter },
  level: 0 | 1 | 2 | 3 | 4,
  hoursPerDay: number,          // default 1.5
  daysPerWeek: number,          // default 5
  sprintDays: number | null,
  sprintGoal: string,
  ytSource: 'single' | 'multi',
  ytCreators: string[],
  ytCount: 1 | 2 | 3 | 4,
  ytAiPick: boolean,
  ytLevel: 'beginner' | 'some' | 'advanced',
  free: boolean,
  roadmap: RoadmapObject | null,
  roadmapId: string | null,     // UUID
  progress: { [step_id]: boolean },
  horizontal: boolean,
  showDailyFull: boolean,
  session: AuthSession | null
}
```

---

### 4.2 Roadmap Object
```
RoadmapObject = {
  id: string,                   // UUID
  skill: string,
  total_duration: string,       // e.g. "8–12 weeks"
  learning_type: 'skill' | 'subject',
  learner_fingerprint: { [key]: letter },
  learner_level: 0–4,
  phases: Phase[],
  daily_plan: DayPlan[],
  unlearn_list: UnlearnItem[],
  community_insights: { paths: CommunityPath[] },
  salary_data: SalaryData | null
}

Phase = {
  id: string,
  order: number,
  title: string,
  duration: string,
  milestone: string,
  steps: Step[]
}

Step = {
  id: string,
  title: string,
  type: 'theory' | 'practice' | 'project',
  duration: string,
  note: string,
  resources: Resource[]
}

Resource = {
  title: string,
  type: 'video' | 'article' | 'course',
  url: string,
  source: string,
  quality_rating: 0–5,
  duration_mins: number
}

DayPlan = {
  day: string,
  task: string,
  phase: number
}

UnlearnItem = {
  bad_habit: string,
  correct_approach: string
}

CommunityPath = {
  author: string,
  upvotes: number,
  description: string
}

SalaryData = {
  junior: string,
  mid: string,
  senior: string
}
```

---

### 4.3 Fingerprint Question Structure
```
Question = {
  key: string,
  q: string,                    // Question text
  hint: string,                 // Optional hint text
  multi: boolean,               // Whether multi-hint toggle is available
  opts: [
    { l: 'A', t: string },
    { l: 'B', t: string },
    { l: 'C', t: string },
    { l: 'D', t: string }
  ]
}
```
Total questions: 9–14 depending on mode

---

## 5. Gating Logic & Conditions

### 5.1 Feature Access Matrix

| Feature | Unauthenticated (Free Mode) | Authenticated |
|---------|----------------------------|---------------|
| View placeholder roadmap | Yes | Yes |
| Generate real roadmap | No | Yes |
| Toggle step completion | Yes | Yes |
| PDF export | No | Yes |
| Share roadmap | No | Yes |
| Crossover modal | Visible, non-functional | Functional |
| Bottleneck detection | Visible, non-functional | Functional |
| Save to history | No | Yes |

---

### 5.2 Authentication Flow Detail
1. User clicks "Build My Roadmap"
2. App calls `supabase.auth.getSession()`
3. **If no session:**
   - Skill value stored to URL query param
   - Redirect to auth/sign-in page
   - After successful auth: return to app, skill restored from URL, flow continues
4. **If session exists:** Flow continues immediately
5. Session broadcast to Navigator browser extension via `window.postMessage` (if extension installed)
6. `onAuthStateChange` listener keeps session state synced throughout session

**Failsafe:** If Supabase check takes >5s, app continues without blocking the user

---

### 5.3 Conditional Visibility Rules

| Element | Show when |
|---------|-----------|
| Recent roadmaps widget | History contains ≥1 item |
| Preview CTA banner | User not authenticated |
| Bottleneck banner | `roadmap.bottleneck_detected === true` |
| Profile menu icon | User is authenticated |
| Salary insights section | Skill has salary data in response |
| Multi-creator fields | YouTube mode + "Multiple" source selected |
| Creator count buttons (2/3/4) | YouTube mode + "Multiple" source selected |
| AI pick toggle | YouTube mode |
| Sprint fields | Sprint mode selected |

---

### 5.4 Button Disabled Rules

| Button | Disabled when |
|--------|---------------|
| Next (Fingerprint) | No answer selected for current question |
| Continue (Gap) | No level selected |
| Build (any screen) | Required fields empty or invalid |
| Build (after click) | Immediately disabled to prevent double-submit |

---

## 6. Animations & Transitions

### 6.1 Summary Table

| Animation | Trigger | Duration | Easing | Notes |
|-----------|---------|----------|--------|-------|
| Screen transition | Screen change | 200ms | ease | Fade in/out via hidden class |
| Phase expand/collapse | Click phase header | 250ms | ease | grid-template-rows: 0fr → 1fr |
| Phase chevron rotation | Click phase header | 250ms | cubic-bezier(0.65,0,0.35,1) | 0° → 180° |
| Step card hover | Mouse enter | 180ms | — | Scale up, shadow increase |
| Primary button hover | Mouse enter | 150ms | — | Opacity reduction + translateY(-1px) |
| Feature card hover (homepage) | Mouse enter | 500ms | cubic-bezier(0.22,1,0.36,1) | Scale 1.02, translateY(-6px), shadow increase |
| Toggle switch | Click | 200ms | — | Thumb slides left/right |
| Autocomplete dropdown | Input focus/typing | instant | — | Appears below input |
| Share menu open | Click Share | 200ms | ease | Fade in + translateY(-4px → 0) |
| Toast entry | Action trigger | 200ms | ease | Fade in + translateY(-8px → 0) |
| Loading dots | Generating screen | 1.2s infinite | — | Pulse scale, 200ms stagger between dots |
| Pulse badge | Always on | 2s infinite | ease-in-out | Opacity 1 → 0.3 → 1 |
| Homepage preloader | Page load | ~2–3s | — | SVG stroke-dashoffset per letter, then fill fade-in |
| Scroll reveal (homepage) | Scroll into view | 700ms | ease | fadeUp: translateY(24px→0) + opacity 0→1 |
| Scroll reveal stagger | Feature cards | 0–560ms delay | ease | Per-card delay offset |
| 3D roadmap scroll (homepage) | Scroll position | continuous | — | See 6.2 |
| Notification fall | Stack interaction | 1s | linear | rnFallOff keyframe, accelerating downward + rotation |

---

### 6.2 3D Scroll Roadmap (Homepage "How It Works")

A sequence of cards that animate through a 3D tunnel as the user scrolls through a dedicated section.

**Container:** Fixed perspective (1600px) on stage element  
**Scroll binding:** Scroll position within the section height drives card state  

**Card states:**
| State | Position | Transforms |
|-------|----------|-----------|
| Incoming | Below/behind | translateZ(-700px), tilted forward, small scale, opacity 0→1 |
| Active | Center stage | translateZ(0), no tilt, full scale, full opacity |
| Outgoing | Above/behind | translateZ(-900px), slight upward drift, tilted away, opacity 1→0 |

**Effect:** Cards cycle through incoming → active → outgoing as user scrolls

---

### 6.3 Homepage Preloader

- **Duration:** ~2–3 seconds
- **Sequence:**
  1. SVG path strokes animate using stroke-dashoffset (each letter/element sequentially)
  2. Once strokes complete, solid fill fades in
  3. Entire preloader fades out with blur, revealing main content

---

### 6.4 Notification Stack (Rare / Advanced Feature)

**Stack display:** 3–4 cards peek behind the front card, slightly scaled and faded  
**Interaction:** Click or scroll cycles to next card  
**Fall animation (`rnFallOff`):**
- Keyframe: quadratic displacement (accelerates downward)
- Includes rotation component (gravity-like tumble)
- Duration: 1s linear

---

## 7. Edge Cases & Empty States

### 7.1 Authentication & Session

| Scenario | Behavior |
|----------|----------|
| App loads, no session | All UX accessible; auth-gated features disabled silently |
| Supabase CDN fails | Failsafe: page reveals anyway after 5s timeout |
| Session expires mid-session | Supabase auto-refreshes token transparently; if hard expiry, auth modal appears |
| User opens in multiple tabs | Each tab independent; localStorage is last-write-wins for progress |

---

### 7.2 Empty States

| Screen/Component | Empty state behavior |
|------------------|---------------------|
| Recent roadmaps widget | Widget hidden entirely |
| Crossover modal — no match | Shows "No significant crossover found" message |
| Crossover modal — insufficient skills | Feature disabled |
| Autocomplete — no matches | Dropdown closes or shows nothing |

---

### 7.3 Input Validation

| Field | Validation rule |
|-------|----------------|
| Skill/subject input | Cannot submit empty; field receives focus on attempt |
| Sprint days | Must be valid positive number |
| Creator name | Cannot proceed with empty field |
| All answer screens | Continue/Next disabled until selection made |

---

### 7.4 Network & Generation Errors

| Scenario | Behavior |
|----------|----------|
| Generation fails | Error message shown in generating screen: "Generation failed: [error]" |
| Recovery action | "Try Again" button re-triggers generation |
| Slow generation | Status text rotates through messages every 1.8s |
| Generation timeout | Hard timeout at 30s; error state shown |

---

### 7.5 UI Overflow & Scale

| Scenario | Behavior |
|----------|----------|
| Very long skill name | Text truncated with ellipsis in display; full value preserved in state |
| Extremely large roadmap (50+ phases) | All phases rendered; native scroll handles overflow |
| Long autocomplete list | Max 6–8 items shown; scrollable |

---

### 7.6 Mobile Layout (< 900px breakpoint)

| Element | Mobile behavior |
|---------|----------------|
| Nav links | Vertical nav links hidden |
| Mode cards | Stack vertically |
| Feature cards (homepage) | Grid reduces from 4-col to 2-col |
| Modals | Full-screen |
| Horizontal roadmap | Scrolls horizontally |

---

### 7.7 Rapid Interaction Prevention

| Interaction | Prevention mechanism |
|-------------|---------------------|
| Double-clicking Build | Button disabled immediately on first click |
| Double-clicking step toggle | Debounced; state locked during update |

---

### 7.8 Bottleneck Detection

**Trigger conditions:** User revisits the same phase 5+ times, or avoids the same step 3+ times  
**Banner contents:**
- Title: identifies the specific bottleneck
- Body: "You've avoided X four times. Here are three ways…"
- 3 alternative learning methods listed

**Dismiss:** Close button; banner suppressed for remainder of session (does not persist across reloads)

---

### 7.9 Free Mode vs Authenticated Mode Transition

- User in free mode sees a complete UI with placeholder content
- All interactive elements present but non-functional where auth is required
- User clicks "Sign In" in preview CTA banner
- After auth: banner disappears, real roadmap generates in place
- Skill value preserved throughout; no screen resets

---

## 8. Homepage Specifics

The homepage (`navigator-homepage-v9-1.html`) is a separate marketing/landing page with its own interaction patterns.

### 8.1 Sections (top to bottom)
1. **Preloader** — animated SVG logo sequence on initial load
2. **Hero** — headline, subheadline, primary CTA ("Start Learning"), secondary CTA
3. **How It Works** — 3D scroll roadmap demonstrating the flow (see 6.2)
4. **Features** — grid of feature cards with scroll-reveal and hover effects
5. **Notification Stack** — showcases a UI pattern with animated card cycling (see 6.4)
6. **Social proof / testimonials** (if present)
7. **Footer** — links

### 8.2 Homepage Interactions

| Interaction | Behavior |
|-------------|----------|
| Hero CTA click | Navigates to app (Start screen) |
| Feature card hover | Scale + shadow animation (500ms cubic-bezier) |
| Scroll into view | fadeUp reveal animation per section/card (Intersection Observer at 12% threshold) |
| Feature card stagger | Each card has 0–560ms reveal delay |
| 3D roadmap section | Scroll-driven card animation (see 6.2) |
| Notification stack | Click/scroll cycles cards with fall animation (see 6.4) |

### 8.3 Homepage → App Handoff
- Primary CTA routes to app
- Skill input may exist on homepage (passes value to app via URL param)
- No auth state managed on homepage; handled entirely by app

---

## Appendix: Key UX Principles Observed

1. **Progressive disclosure** — Complex options hidden until relevant mode is selected
2. **Real-time feedback** — Sliders, progress bars, and status messages update immediately
3. **Graceful degradation** — Free mode shows the full UI surface; premium features visible but locked
4. **Persistent state** — Progress and history survive page reloads via localStorage
5. **Authentication as a speed bump, not a wall** — Users can explore before being asked to sign in
6. **Single selection enforced in groups** — Selecting a card in a group always deselects others
7. **Disabled states are explicit** — Buttons communicate unavailability through visual state, not disappearance
8. **Mobile-aware from the start** — Responsive breakpoint at 900px changes layout meaningfully
9. **Generation is a moment** — Rotating status messages + animated loading treat generation as an event, not just a wait
10. **Roadmap is the core product** — Most interaction complexity lives in the roadmap screen (phase collapse, step toggle, layout switch, share, export)
