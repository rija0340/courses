/**
 * Shared helpers for vocab mini-examples + scenario dialogues.
 * Used by ExampleCollapse, ScenarioCard, VocabForm.
 */
import React from 'react';

/**
 * Highlight the first occurrence of a collocation/term inside a sentence.
 * @param {string} text
 * @param {string} term
 * @returns {import('react').ReactNode}
 */
export function highlightCollocation(text, term) {
  if (!text) return null;
  if (!term?.trim()) return text;

  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'i');
  const match = text.match(regex);
  if (!match || match.index == null) return text;

  const start = match.index;
  const end = start + match[0].length;
  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-[#dbeafe] text-[#1e40af] font-semibold px-0.5 rounded-sm not-italic">
        {text.slice(start, end)}
      </mark>
      {text.slice(end)}
    </>
  );
}

/** True if a localized line has content (mg can be empty → hidden). */
export function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Mini-example present if patient or doctor has at least one line.
 * @param {object|null|undefined} example
 */
export function hasExample(example) {
  if (!example || typeof example !== 'object') return false;
  const sides = [example.patient, example.doctor];
  return sides.some(
    (side) => side && (hasText(side.en) || hasText(side.fr) || hasText(side.mg))
  );
}

/** Scenario item: tab scenarios OR non-empty dialogue array. */
export function isScenarioItem(item) {
  return item?.tab === 'scenarios' || (Array.isArray(item?.dialogue) && item.dialogue.length > 0);
}

export function emptySpeakerLine() {
  return { en: '', fr: '', mg: '' };
}

export function emptyExample() {
  return {
    patient: emptySpeakerLine(),
    doctor: emptySpeakerLine(),
  };
}

export function emptyDialogueTurn(role = 'patient') {
  return { role, en: '', fr: '', mg: '' };
}
