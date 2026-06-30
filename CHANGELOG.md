# Changelog

All notable changes to this project will be documented in this file.

The format is based on a simple release log tailored to this app's public evolution.

## [2.0.2] - 2026-06-30

### Fixed
- **Contextual Menu Unresponsive Items:** Resolved a fatal JavaScript runtime failure (`TypeError`) in the paragraph hover engine caused by a missing reference to the text-to-speech option button. Re-instated the button element and added protective checks to decouple element presence from execution flow.
- **Capture Phase Structural Stability:** Hardened global document-level event listeners to explicitly verify target nodes, preventing runtime crashes when keyboard navigation or empty clicks interact directly with structural layout wrappers instead of standard DOM Elements.
- **Paragraph Cross-Click State Persistence:** Resolved an issue where the contextual menu's copy link button remained stuck in a "Copied" text state when hovering or clicking across multiple separate paragraphs by forcing an immediate string reset upon menu re-initialization.
- **Navigation Loop Desynchronization:** Corrected a routing regression causing Infinite Backwards Loops when navigating between the Case Detail, Video Player, and About views; decoupled history manipulation from structural navigation by implementing explicit stateless routing based on contextual view flags.
- **Granular Paragraph Deep Linking:** Engineered a query parameter tracking solution (`&p=`) to support index-specific paragraph links; integrated visual focus animations alongside native accessibility properties (`aria-current`) to guide assistive technologies directly to the linked node upon asynchronous view transitions.
- **Internationalization Link Synced Sharing:** Synchronized both the paragraph hover share handlers and the AI Dashboard block buttons to respect active `i18n` language parameters (`&lang=`) during clipboard writes and system share sheets.

## [2.0.1] - 2026-06-29
### Fixed
- Fixed an accessibility edge case where the paragraph hover menu remained open after triggering video presentations via keyboard navigation (`Enter` key).
- Resolved an issue with event bubbling inside the case reader overlay using a Capture Phase structural event wrapper.
- Fixed a drop-down visibility bug inside the slider search autocomplete results wrapper.

## [2.0.0] - 2026-06-29
### Title
Second Flight

### Overview
Second major release of Lio Schimanko's Portfolio as an expanded open-source Single-Page Application (SPA).

This version evolves the original app into a broader and more expressive case-study platform for Product Engineers and UX Designers, with deeper storytelling, richer interaction patterns, stronger accessibility coverage, and a more ambitious presentation layer.

### Included
- Expanded interactive case-study portfolio experience.
- Native Bilingual support.
- Accessibility settings, including dark mode, high contrast, large text, dyslexia-friendly font, focus mode, and reduced motion.
- Video presentation player for selected cases.
- Case-study swipe navigation and reading-focused layouts.
- AI chat with contextual portfolio assistance inside reader.
- Richer case database structure with more detailed project narratives.
- Improved state handling across gallery, case, about, and player views.
- More advanced visual transitions, scroll behavior, and presentation logic.
- A better Information Architecture.
- Internationalization (i18n) support across case studies and client-facing labels.
- Dynamic Breadcrumbs.
- Keyboard shortcuts.

### Removed
- Gradient background pulse animation.

### Notes
This release marks the portfolio's v2 evolution and introduces a more ambitious, feature-rich experience built on top of the original public baseline.

As this version also introduces greater technical and interaction complexity, subsequent patch releases should focus on bug fixes, refinement, and stabilization.

## [1.0.0] - 2026-06-16
### Title
First Flight

### Overview
Initial stable release of Lio Schimanko's Portfolio as an open-source Single-Page Application (SPA).

### Included
- Interactive case-study portfolio experience.
- Bilingual support as a simple hyperlink.
- Accessibility settings, including dark mode, high contrast, large text, dyslexia font, and reduced motion.
- Video presentation player for selected cases.
- Case-study swipe navigation and reading-focused layouts.
- AI chat bubble with local context.
- Gradient background pulse animation.


### Notes
This release establishes the public baseline for future improvements and versioned updates.