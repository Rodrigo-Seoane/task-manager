"use client";

/**
 * Icon Picker Component
 * Grid of icons for task selection
 * Phase 3.1 - Task Creation UI
 */

import { useState } from "react";

// ============================================================================
// ICON SET (Child-appropriate emojis - simple, universal)
// ============================================================================

const TASK_ICONS = [
  { name: "toothbrush", emoji: "🪥", label: "Brush Teeth" },
  { name: "bed", emoji: "🛏️", label: "Make Bed" },
  { name: "book", emoji: "📖", label: "Read" },
  { name: "backpack", emoji: "🎒", label: "Pack Bag" },
  { name: "apple", emoji: "🍎", label: "Healthy Snack" },
  { name: "shower", emoji: "🚿", label: "Shower" },
  { name: "clothes", emoji: "👕", label: "Get Dressed" },
  { name: "dishes", emoji: "🍽️", label: "Dishes" },
  { name: "broom", emoji: "🧹", label: "Clean" },
  { name: "homework", emoji: "✏️", label: "Homework" },
  { name: "music", emoji: "🎵", label: "Music Practice" },
  { name: "sports", emoji: "⚽", label: "Exercise" },
  { name: "plant", emoji: "🪴", label: "Water Plants" },
  { name: "pet", emoji: "🐕", label: "Pet Care" },
  { name: "trash", emoji: "🗑️", label: "Take Out Trash" },
  { name: "cooking", emoji: "🍳", label: "Help Cook" },
  { name: "laundry", emoji: "🧺", label: "Laundry" },
  { name: "star", emoji: "⭐", label: "Special Task" },
  { name: "bike", emoji: "🚲", label: "Bike Ride" },
  { name: "art", emoji: "🎨", label: "Art Time" },
  { name: "game", emoji: "🎮", label: "Game Time" },
  { name: "movie", emoji: "🎬", label: "Movie Time" },
  { name: "pizza", emoji: "🍕", label: "Choose Dinner" },
  { name: "ice-cream", emoji: "🍦", label: "Treat" },
  { name: "park", emoji: "🏞️", label: "Park Visit" },
  { name: "trophy", emoji: "🏆", label: "Big Reward" },
  { name: "gift", emoji: "🎁", label: "Special Prize" },
  { name: "party", emoji: "🎉", label: "Celebration" },
];

// ============================================================================
// COMPONENT
// ============================================================================

interface IconPickerProps {
  selectedIcon: string | null;
  onSelectIcon: (iconName: string) => void;
}

export function IconPicker({ selectedIcon, onSelectIcon }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter icons based on search
  const filteredIcons = searchTerm
    ? TASK_ICONS.filter(
        (icon) =>
          icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : TASK_ICONS;

  return (
    <div>
      {/* Search Input */}
      <div style={{ marginBottom: "var(--space-4)" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search icons..."
          style={{
            width: "100%",
            padding: "var(--space-3) var(--space-4)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            border: "1px solid var(--color-grey-300)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-grey-50)",
            outline: "none",
            transition: "all var(--transition-fast)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-navy-500)";
            e.currentTarget.style.backgroundColor = "white";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-grey-300)";
            e.currentTarget.style.backgroundColor = "var(--color-grey-50)";
          }}
        />
      </div>

      {/* Icon Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: "var(--space-2)",
          maxHeight: "400px",
          overflowY: "auto",
          padding: "var(--space-2)",
        }}
      >
        {filteredIcons.map((icon) => {
          const isSelected = selectedIcon === icon.name;

          return (
            <button
              key={icon.name}
              type="button"
              onClick={() => onSelectIcon(icon.name)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--space-3)",
                border: `2px solid ${
                  isSelected ? "var(--color-navy-500)" : "var(--color-grey-200)"
                }`,
                borderRadius: "var(--radius-md)",
                backgroundColor: isSelected
                  ? "var(--color-navy-50)"
                  : "white",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                minHeight: "80px",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "var(--color-navy-300)";
                  e.currentTarget.style.backgroundColor =
                    "var(--color-grey-50)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "var(--color-grey-200)";
                  e.currentTarget.style.backgroundColor = "white";
                }
              }}
            >
              <span
                style={{
                  fontSize: "32px",
                  marginBottom: "var(--space-1)",
                }}
              >
                {icon.emoji}
              </span>
              <span
                style={{
                  fontSize: "var(--font-size-caption)",
                  fontFamily: "var(--font-family-body)",
                  color: isSelected
                    ? "var(--color-navy-700)"
                    : "var(--color-grey-600)",
                  textAlign: "center",
                  lineHeight: "1.2",
                }}
              >
                {icon.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* No Results */}
      {filteredIcons.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "var(--space-8)",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-size-body)",
              fontFamily: "var(--font-family-body)",
              color: "var(--color-grey-500)",
            }}
          >
            No icons found for "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
}
