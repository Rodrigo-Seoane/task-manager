/**
 * Board Master - Narrative System Constants
 * Phase 6 - Wizard Character Messaging
 *
 * Based on docs/NARRATIVE_SYSTEM.md
 * All messages follow the Tony Stark wizard character voice:
 * - Warm, encouraging, never critical
 * - Simple, clear language (1st-2nd grade reading level)
 * - 1-2 sentences per message
 * - Second-person, present tense, active voice
 */

// ============================================================================
// WIZARD POSES - Matches SVG files in /public/wizard/
// ============================================================================
export type WizardPose =
  | "waving"
  | "excited"
  | "celebration"
  | "encouraging"
  | "supportive";

// ============================================================================
// MESSAGE KEYS - For type safety
// ============================================================================
export type NarrativeMessageKey =
  | "tutorWelcome"
  | "learnerCreated"
  | "learnerFirstLogin"
  | "bossTaskUnlocked"
  | "weeklyResetSuccess"
  | "weeklyResetEncouragement"
  | "midWeekEncouragement"
  | "weekReviewComplete80Plus"
  | "weekReviewComplete80PlusNoBoss"
  | "weekReviewCompleteBelow80"
  | "noActiveWeek";

// ============================================================================
// MESSAGE STRUCTURE
// ============================================================================
export interface NarrativeMessage {
  messages: string[];
  buttonText: string;
  wizardPose: WizardPose;
}

// ============================================================================
// NARRATIVE MESSAGES
// All messages from NARRATIVE_SYSTEM.md
// Variables use {variable_name} format for interpolation
// ============================================================================
export const narrativeMessages: Record<NarrativeMessageKey, NarrativeMessage> =
  {
    // -------------------------------------------------------------------------
    // 1. TUTOR WELCOME - First login after account creation
    // -------------------------------------------------------------------------
    tutorWelcome: {
      messages: [
        "Welcome to Board Master! I'm Tony, the Game Wizard. I help kids build great habits through fun challenges.",
        "Let's create your first Learner profile. Give them a name and a secret 4-digit PIN to log in.",
      ],
      buttonText: "Add Learner",
      wizardPose: "waving",
    },

    // -------------------------------------------------------------------------
    // 2. LEARNER CREATED - After tutor creates learner with PIN
    // -------------------------------------------------------------------------
    learnerCreated: {
      messages: [
        "Great! {learner_name} is all set. Now let's create their first week of tasks!",
      ],
      buttonText: "Create Weekly Tasks",
      wizardPose: "encouraging",
    },

    // -------------------------------------------------------------------------
    // 3. LEARNER FIRST LOGIN - First time learner sees their task board
    // -------------------------------------------------------------------------
    learnerFirstLogin: {
      messages: [
        "Hi {learner_name}! I'm Tony the Game Wizard. Welcome to your task board!",
        "See these cards? Each one is a task. Tap a task when you finish it, and you'll earn points!",
        "Complete 8 of your 10 tasks this week to unlock special Boss Tasks!",
      ],
      buttonText: "Let's Go!",
      wizardPose: "excited",
    },

    // -------------------------------------------------------------------------
    // 4. BOSS TASK UNLOCKED - When learner reaches 80% completion
    // -------------------------------------------------------------------------
    bossTaskUnlocked: {
      messages: [
        "WOW! You hit 80%! You unlocked the Boss Tasks!",
        "Boss Tasks are special rewards. Tap them to claim—but you can only choose {max_boss_tasks} this week, so pick your favorites!",
      ],
      buttonText: "Awesome!",
      wizardPose: "celebration",
    },

    // -------------------------------------------------------------------------
    // 5. WEEKLY RESET - New week starts (previous week >= 80%)
    // -------------------------------------------------------------------------
    weeklyResetSuccess: {
      messages: [
        "Amazing work last week! You earned {points} points and completed {completed} of {total} tasks.",
        "Ready for a fresh week? New tasks are waiting!",
      ],
      buttonText: "Let's Go!",
      wizardPose: "encouraging",
    },

    // -------------------------------------------------------------------------
    // 6. WEEKLY RESET - New week starts (previous week < 80%)
    // -------------------------------------------------------------------------
    weeklyResetEncouragement: {
      messages: [
        "New week, new chances! You earned {points} points last week—great effort!",
        "This week, try to hit 80% to unlock Boss Tasks. I know you can do it!",
      ],
      buttonText: "I'm Ready!",
      wizardPose: "encouraging",
    },

    // -------------------------------------------------------------------------
    // 7. MID-WEEK ENCOURAGEMENT - Thursday/Friday if 50-70% complete
    // -------------------------------------------------------------------------
    midWeekEncouragement: {
      messages: [
        "You're doing great! You're at {completed} of {total} tasks this week. Just a few more to unlock Boss Tasks!",
      ],
      buttonText: "Thanks, Tony!",
      wizardPose: "encouraging",
    },

    // -------------------------------------------------------------------------
    // 8. WEEK REVIEW COMPLETE - After tutor review (>= 80% with boss tasks)
    // -------------------------------------------------------------------------
    weekReviewComplete80Plus: {
      messages: [
        "Your tutor reviewed your week! You earned {points} points total!",
        "You unlocked AND completed Boss Tasks! You're a true champion!",
      ],
      buttonText: "Yay!",
      wizardPose: "celebration",
    },

    // -------------------------------------------------------------------------
    // 9. WEEK REVIEW COMPLETE - After tutor review (>= 80% but no boss tasks)
    // -------------------------------------------------------------------------
    weekReviewComplete80PlusNoBoss: {
      messages: [
        "Great week! You earned {points} points and unlocked Boss Tasks!",
        "Next time, try claiming a Boss Task—they're super fun!",
      ],
      buttonText: "Okay!",
      wizardPose: "supportive",
    },

    // -------------------------------------------------------------------------
    // 10. WEEK REVIEW COMPLETE - After tutor review (< 80%)
    // -------------------------------------------------------------------------
    weekReviewCompleteBelow80: {
      messages: [
        "Your tutor reviewed your week! You earned {points} points!",
        "This week, let's try to reach 80% together. You've got this!",
      ],
      buttonText: "Let's Do It!",
      wizardPose: "supportive",
    },

    // -------------------------------------------------------------------------
    // 11. NO ACTIVE WEEK - Waiting for tutor to create tasks
    // -------------------------------------------------------------------------
    noActiveWeek: {
      messages: [
        "Your tutor is setting up your new week. Check back soon!",
        "While you wait, remember: every task you complete helps you grow stronger!",
      ],
      buttonText: "Okay!",
      wizardPose: "supportive",
    },
  };

// ============================================================================
// HELPER FUNCTION - Interpolate variables into messages
// ============================================================================
export function interpolateMessage(
  message: string,
  variables: Record<string, string | number>
): string {
  let result = message;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }
  return result;
}

// ============================================================================
// HELPER FUNCTION - Get narrative message with interpolation
// ============================================================================
export function getNarrativeMessage(
  key: NarrativeMessageKey,
  variables?: Record<string, string | number>
): {
  messages: string[];
  buttonText: string;
  wizardPose: WizardPose;
} {
  const narrative = narrativeMessages[key];

  if (!variables) {
    return narrative;
  }

  return {
    ...narrative,
    messages: narrative.messages.map((msg) =>
      interpolateMessage(msg, variables)
    ),
  };
}

// ============================================================================
// WIZARD IMAGE PATHS
// ============================================================================
export const wizardImages: Record<WizardPose, string> = {
  waving: "/wizard/waving.svg",
  excited: "/wizard/excited.svg",
  celebration: "/wizard/celebration.svg",
  encouraging: "/wizard/encouraging.svg",
  supportive: "/wizard/supportive.svg",
};
