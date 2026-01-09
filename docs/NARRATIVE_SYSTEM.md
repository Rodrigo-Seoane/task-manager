# Board Master - Narrative System: Tony Stark, the Game Wizard

## Character Profile

**Name**: Tony Stark (original character, wizard-themed)

**Visual**: Friendly wizard with magical staff, robes with star patterns, warm smile. Not connected to Marvel IP—reimagined as a kind, encouraging magical mentor for children.

**Personality**:
- Warm, encouraging, never critical
- Uses simple, clear language
- Celebrates effort, not just success
- Explains rules clearly without overwhelming
- Appears at key moments (not constantly)

**Voice**:
- Second-person ("You did it!")
- Present tense
- Active voice
- 1–2 sentences per message
- Reading level: 1st–2nd grade

---

## Narrative Touchpoints

### 1. Welcome (Tutor)
**Context**: First login after account creation

**Messages**:
```
Message 1:
"Welcome to Board Master! I'm Tony, the Game Wizard. I help kids build great habits through fun challenges."

Message 2:
"Let's create your first Learner profile. Give them a name and a secret 4-digit PIN to log in."

Button: "Add Learner"
```

**Wizard Visual**: Waving, friendly pose

**REMOVED**: Profile type selection messaging (no Sentinel/Explorer/Diplomat/Analyst in MVP)

---

### 2. Learner Profile Created
**Context**: After tutor creates learner with PIN

**Messages**:
```
"Great! [Learner name] is all set. Now let's create their first week of tasks!"

Button: "Create Weekly Tasks"
```

**Wizard Visual**: Thumbs up pose

**REMOVED**: Profile type confirmation (replaced with simple success message)

---

### 3. First Task Week Explanation
**Context**: Learner's first login after tutor creates first weekly cycle

**Messages**:
```
Message 1:
"Hi [Learner name]! I'm Tony the Game Wizard. Welcome to your task board!"

Message 2:
"See these cards? Each one is a task. Tap a task when you finish it, and you'll earn points!"

Message 3:
"Complete 8 of your 10 tasks this week to unlock special Boss Tasks—big rewards like extra playtime or choosing dinner!"

Button: "Let's Go!"
```

**CHANGED**: "8 of your 10 tasks" instead of "8 out of 10 tasks" (more personal, clearer)

**Wizard Visual**: Excited, pointing to tasks

**Tutorial Overlay** (optional, dismissible):
- Highlight first incomplete task with pulsing circle
- Text: "Try tapping this task to mark it complete!"

---

### 4. Boss Task Unlocked
**Context**: Learner reaches 80% completion for first time in a week

**Messages**:
```
Message 1:
"WOW! You hit 80%! You unlocked the Boss Tasks!"

Message 2:
"Boss Tasks are special rewards. Tap them to claim—but you can only choose [X] this week, so pick your favorites!"

Button: "Awesome!"
```

**Wizard Visual**: Celebration pose, magical sparkles

**Animation**:
- Boss task cards "unlock" with shimmer effect
- Golden glow around boss task section
- Confetti burst (brief, not overwhelming)

---

### 5. Weekly Reset (Start of New Week)
**Context**: New weekly cycle activated (learner logs in Monday morning)

**Messages**:

#### If previous week >= 80%:
```
Message 1:
"Amazing work last week! You earned [X] points and completed [Y]% of your tasks."

Message 2:
"Ready for a fresh week? New tasks are waiting!"

Button: "Let's Go!"
```

#### If previous week < 80%:
```
Message 1:
"New week, new chances! You earned [X] points last week—great effort!"

Message 2:
"This week, try to hit 80% to unlock Boss Tasks. I know you can do it!"

Button: "I'm Ready!"
```

**Wizard Visual**: Encouraging pose, holding magical staff

---

### 6. Mid-Week Encouragement
**Context**: Learner at 50–70% completion by Thursday

**Messages** (shown once per week, randomly on Thursday/Friday login):
```
"You're doing great! You're at [X]% this week. Just a few more tasks to unlock Boss Tasks!"

Button: "Thanks, Tony!"
```

**Wizard Visual**: Thumbs up pose

**Frequency**: Maximum once per week, only if between 50–79% completion

---

### 7. Week Review Complete (Learner View)
**Context**: Tutor finishes review, learner logs in after completion

**Messages**:

#### If >= 80% and boss tasks completed:
```
Message 1:
"Your tutor reviewed your week! You earned [X] points total!"

Message 2:
"You unlocked AND completed Boss Tasks! You're a true champion!"

Button: "Yay!"
```

#### If >= 80% but no boss tasks completed:
```
Message 1:
"Great week! You earned [X] points and unlocked Boss Tasks!"

Message 2:
"Next time, try claiming a Boss Task—they're super fun!"

Button: "Okay!"
```

#### If < 80%:
```
Message 1:
"Your tutor reviewed your week! You earned [X] points!"

Message 2:
"This week, let's try to reach 80% together. You've got this!"

Button: "Let's Do It!"
```

**Wizard Visual**: Friendly, supportive pose

---

### 8. No Active Week (Waiting for Tutor)
**Context**: No weekly cycle exists for learner (between weeks)

**Messages**:
```
Message 1:
"Your tutor is setting up your new week. Check back soon!"

Message 2 (optional):
"While you wait, remember: every task you complete helps you grow stronger!"

Button: "Okay!"
```

**Wizard Visual**: Relaxed, seated pose with book

---

## Narrative Design Principles

### Frequency
- **Onboarding**: 3 interactions (tutor welcome, profile selection, learner first login)
- **Weekly**: 2–3 interactions (weekly reset, optional mid-week, review complete)
- **Event-driven**: 1 interaction (boss task unlock)
- **Total**: Maximum 5–6 wizard appearances per week per learner

### Tone Guidelines
- **Positive**: "You did great!" not "You only got 60%"
- **Specific**: "You earned 45 points!" not "Good job!"
- **Actionable**: "Try to reach 80%" not "Work harder"
- **Age-appropriate**: Avoid metaphors, idioms, sarcasm
- **Encouraging**: Focus on progress, not perfection

### Visual Consistency
- Wizard always appears in consistent style across all messages
- Background color matches learner profile type (blue for Sentinel, green for Explorer, etc.)
- Text size: minimum 20px, bold for emphasis
- Maximum 3 lines per message card
- Always include dismiss button (no auto-dismiss for important messages)

### Localization Readiness
- All messages stored as string constants (not hardcoded)
- Variables clearly marked (e.g., `{learner_name}`, `{points}`)
- Cultural neutrality (no culture-specific references)
- Gender-neutral language

### Anti-Manipulation Safeguards
- No guilt messaging ("Tony is sad you didn't finish")
- No artificial urgency ("Only 2 days left!")
- No social pressure ("Other kids finished more tasks")
- No variable reward language ("Maybe you'll get a bonus!")
- No parasocial dependency (wizard is helpful, not a "best friend")

---

## Message Storage Format (for implementation)

```json
{
  "narrative_messages": {
    "tutor_welcome": {
      "messages": [
        "Welcome to Board Master! I'm Tony, the Game Wizard. I help kids build great habits through fun challenges.",
        "Let's create your first Learner profile. Pick a personality type that matches your child—it helps me show tasks in a way they'll love!"
      ],
      "button_text": "Let's Go!",
      "wizard_pose": "waving"
    },
    "learner_first_login": {
      "messages": [
        "Hi {learner_name}! I'm Tony the Game Wizard. Welcome to your task board!",
        "See these cards? Each one is a task. Tap a task when you finish it, and you'll earn points!",
        "Complete 8 out of 10 tasks this week to unlock special Boss Tasks—big rewards like extra playtime or choosing dinner!"
      ],
      "button_text": "Let's Go!",
      "wizard_pose": "excited"
    },
    "boss_task_unlocked": {
      "messages": [
        "WOW! You hit 80%! You unlocked the Boss Tasks!",
        "Boss Tasks are special rewards. Tap them to claim—but you can only choose {max_boss_tasks} this week, so pick your favorites!"
      ],
      "button_text": "Awesome!",
      "wizard_pose": "celebration"
    }
    // ... additional messages
  }
}
```

---

## Future Enhancements (Post-MVP)

- **Multi-level narratives**: Wizard messages change as learner progresses to Level 2, 3, etc.
- **Personalized encouragement**: AI-generated messages based on learner's task history
- **Voice narration**: Optional audio of wizard messages (accessibility + engagement)
- **Customizable wizard**: Allow learners to choose wizard appearance (still same character, different visual style)
- **Seasonal events**: Special wizard messages for holidays, back-to-school, summer
- **Achievement unlocks**: Wizard delivers special badges/titles for milestones

**NOT in MVP**:
- Chatbot functionality (no free-form conversation)
- Story mode or quest chains
- Wizard evolution or leveling
- Multiple wizard characters
- Profile type-specific messaging (all learners see same messages)

---

## MVP Simplifications Summary

1. ✅ **Removed profile selection narrative**: No Sentinel/Explorer/Diplomat/Analyst messages
2. ✅ **Task count language**: "8 of your 10 tasks" instead of percentages
3. ✅ **De-emphasized points**: Focus on task completion, not point accumulation
4. ✅ **Concrete countdowns**: "Complete 2 more tasks" not "reach 80%"
5. ✅ **Simplified onboarding**: Fewer wizard interruptions, faster to first task

**Messaging Frequency** (MVP):
- Tutor: 2 messages (welcome, learner created)
- Learner: 4–5 messages per week (tutorial, boss unlock, weekly reset, review complete)
- Total wizard appearances: ~6-7 per week max (not overwhelming)

**All messages emphasize**:
- Concrete actions ("Complete 2 more tasks")
- Effort over outcome ("You worked hard!")
- Task completion over points ("8 of 10 tasks done!")
- Natural consequences (unlock rewards by being consistent, not by gaming system)
