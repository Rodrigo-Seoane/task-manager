"use client";

/**
 * PIN Entry Client Component
 * Phase 4.1 - Learner Login
 * 80px x 80px buttons, child-friendly design
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface Learner {
  id: string;
  displayName: string;
}

interface PinEntryClientProps {
  learner: Learner;
}

export function PinEntryClient({ learner }: PinEntryClientProps) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(
    null
  );
  const [isLocked, setIsLocked] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);

  const handleDigitPress = async (digit: string) => {
    if (isLoading || isLocked || pin.length >= 4) return;

    const newPin = pin + digit;
    setPin(newPin);
    setError(null);

    // Auto-submit when 4 digits entered
    if (newPin.length === 4) {
      await handleSubmit(newPin);
    }
  };

  const handleDelete = () => {
    if (isLoading || isLocked) return;
    setPin(pin.slice(0, -1));
    setError(null);
  };

  const handleSubmit = async (pinToSubmit: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Sign in with NextAuth - the learner Credentials provider validates the PIN
      const result = await signIn("learner", {
        learnerId: learner.id,
        pin: pinToSubmit,
        userType: "learner",
        redirect: false,
      });

      if (result?.error) {
        // Handle rate limiting or invalid PIN errors
        if (result.error.includes("rate") || result.error.includes("locked")) {
          setIsLocked(true);
          setMinutesRemaining(30);
          setError("Too many attempts. Please try again later.");
        } else {
          setError("Wrong PIN. Please try again.");
          setRemainingAttempts((prev) => (prev !== null ? prev - 1 : 4));
        }
        setPin("");
        return;
      }

      // Success - redirect to dashboard
      router.push("/learner/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/learner/select");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-8)",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      {/* Learner Avatar */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "var(--color-peach-500)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "48px",
          color: "white",
          fontFamily: "var(--font-family-display)",
        }}
      >
        {learner.displayName.charAt(0).toUpperCase()}
      </div>

      {/* Greeting */}
      <h1
        style={{
          fontSize: "var(--font-size-h3)",
          fontFamily: "var(--font-family-body)",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--color-navy-800)",
          textAlign: "center",
          margin: 0,
        }}
      >
        Enter Your PIN, {learner.displayName}
      </h1>

      {/* PIN Dots Display */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-4)",
          marginBottom: "var(--space-4)",
        }}
      >
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor:
                index < pin.length
                  ? "var(--color-navy-500)"
                  : "var(--color-grey-300)",
              transition: "all var(--transition-fast)",
              transform: index < pin.length ? "scale(1.1)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "var(--space-4) var(--space-6)",
            backgroundColor: isLocked
              ? "var(--color-error-100)"
              : "var(--color-warning-100)",
            borderRadius: "var(--radius-md)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-size-body)",
              fontFamily: "var(--font-family-body)",
              color: isLocked
                ? "var(--color-error-400)"
                : "var(--color-warning-400)",
              margin: 0,
            }}
          >
            {error}
          </p>
          {isLocked && minutesRemaining && (
            <p
              style={{
                fontSize: "var(--font-size-small)",
                fontFamily: "var(--font-family-body)",
                color: "var(--color-error-400)",
                marginTop: "var(--space-2)",
                margin: 0,
              }}
            >
              Try again in {minutesRemaining} minutes
            </p>
          )}
          {!isLocked && remainingAttempts !== null && remainingAttempts > 0 && (
            <p
              style={{
                fontSize: "var(--font-size-small)",
                fontFamily: "var(--font-family-body)",
                color: "var(--color-grey-500)",
                marginTop: "var(--space-2)",
                margin: 0,
              }}
            >
              {remainingAttempts} {remainingAttempts === 1 ? "try" : "tries"}{" "}
              left
            </p>
          )}
        </div>
      )}

      {/* Number Pad - 80px x 80px buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 80px)",
          gap: "var(--space-3)",
          justifyContent: "center",
        }}
      >
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigitPress(digit)}
            disabled={isLoading || isLocked}
            style={{
              width: "80px",
              height: "80px",
              fontSize: "var(--font-size-h2)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              backgroundColor:
                isLoading || isLocked ? "var(--color-grey-200)" : "white",
              color:
                isLoading || isLocked
                  ? "var(--color-grey-400)"
                  : "var(--color-navy-800)",
              border: "2px solid var(--color-grey-300)",
              borderRadius: "var(--radius-lg)",
              cursor: isLoading || isLocked ? "not-allowed" : "pointer",
              transition: "all var(--transition-fast)",
              boxShadow: "var(--shadow-sm)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading && !isLocked) {
                e.currentTarget.style.backgroundColor = "var(--color-navy-50)";
                e.currentTarget.style.borderColor = "var(--color-navy-500)";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && !isLocked) {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.borderColor = "var(--color-grey-300)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {digit}
          </button>
        ))}

        {/* Empty space */}
        <div style={{ width: "80px", height: "80px" }} />

        {/* Zero */}
        <button
          onClick={() => handleDigitPress("0")}
          disabled={isLoading || isLocked}
          style={{
            width: "80px",
            height: "80px",
            fontSize: "var(--font-size-h2)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            backgroundColor:
              isLoading || isLocked ? "var(--color-grey-200)" : "white",
            color:
              isLoading || isLocked
                ? "var(--color-grey-400)"
                : "var(--color-navy-800)",
            border: "2px solid var(--color-grey-300)",
            borderRadius: "var(--radius-lg)",
            cursor: isLoading || isLocked ? "not-allowed" : "pointer",
            transition: "all var(--transition-fast)",
            boxShadow: "var(--shadow-sm)",
          }}
          onMouseEnter={(e) => {
            if (!isLoading && !isLocked) {
              e.currentTarget.style.backgroundColor = "var(--color-navy-50)";
              e.currentTarget.style.borderColor = "var(--color-navy-500)";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && !isLocked) {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.borderColor = "var(--color-grey-300)";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          0
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isLoading || isLocked || pin.length === 0}
          style={{
            width: "80px",
            height: "80px",
            fontSize: "var(--font-size-h3)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-medium)",
            backgroundColor:
              isLoading || isLocked || pin.length === 0
                ? "var(--color-grey-200)"
                : "var(--color-grey-100)",
            color:
              isLoading || isLocked || pin.length === 0
                ? "var(--color-grey-400)"
                : "var(--color-grey-600)",
            border: "2px solid var(--color-grey-300)",
            borderRadius: "var(--radius-lg)",
            cursor:
              isLoading || isLocked || pin.length === 0
                ? "not-allowed"
                : "pointer",
            transition: "all var(--transition-fast)",
            boxShadow: "var(--shadow-sm)",
          }}
          onMouseEnter={(e) => {
            if (!isLoading && !isLocked && pin.length > 0) {
              e.currentTarget.style.backgroundColor = "var(--color-grey-200)";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && !isLocked && pin.length > 0) {
              e.currentTarget.style.backgroundColor = "var(--color-grey-100)";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          ⌫
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <p
          style={{
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            color: "var(--color-grey-500)",
          }}
        >
          Checking...
        </p>
      )}

      {/* Back Button */}
      <button
        onClick={handleBack}
        disabled={isLoading}
        style={{
          marginTop: "var(--space-4)",
          padding: "var(--space-3) var(--space-6)",
          fontSize: "var(--font-size-body)",
          fontFamily: "var(--font-family-body)",
          fontWeight: "var(--font-weight-medium)",
          backgroundColor: "transparent",
          color: "var(--color-grey-500)",
          border: "1px solid var(--color-grey-300)",
          borderRadius: "var(--radius-md)",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "all var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = "var(--color-grey-100)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        ← Back
      </button>
    </div>
  );
}
