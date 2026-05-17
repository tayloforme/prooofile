# Design

A minimal pet-care dashboard. Two surfaces, light chrome, strong time hierarchy.

## Principles

- **Tasks = what to do now.** The Care plan shows only what's actionable inside a 14-day horizon. No overload.
- **Calendar = planning & overview.** Opens in a modal from the Care plan, not a separate page.
- **Categories influence UX, not just decoration.** Color stripes on cards, segmented bars on calendar days. Badges stay neutral so colors stay scannable.
- **Time hierarchy is visual.** Today is amber and emphasized; later buckets dim toward muted greys.
- **One action per row.** Checkbox to complete, hover-revealed `⋯` menu for edit/reschedule/delete. No row-level click target — reduces accidental opens.

## Layout

Single column, centered, max width 960px. Two cards stacked with 24px gap:

1. **Hero** — avatar + name + breed/age + 4-stat row + Edit profile.
2. **Care plan** — bucketed task list + calendar modal trigger.

## Tokens

```
--bg            #f5f6f8     page background
--surface       #ffffff     cards
--surface-soft  #f9fafb     hover, selected day in cal
--text          #111418     primary
--text-muted    #6b7280     secondary
--text-soft     #9aa0a8     tertiary, completed
--border        #eceef2     hairline
--border-strong #dfe2e7     buttons, inputs

--radius        16px        cards
--shadow        soft double-layer, low elevation
```

Typography: Inter, 14px base, 1.5 line-height. Card titles 20px/700. Section heads 13px/600 muted.

## Categories

Each event has a `type`; that type drives the stripe color and the calendar bar segment.

| Type        | Color   | Used for                          |
|-------------|---------|-----------------------------------|
| health      | #3b82f6 | Vet visits, dental, checkups      |
| vaccine     | #8b5cf6 | Boosters, annual vaccines         |
| medication  | #f59e0b | Flea & tick, deworming            |
| grooming    | #ec4899 | Bath, brush, salon                |
| activity    | #10b981 | Walks, playdates, training        |
| trip        | #0d9488 | Boarding, travel                  |

Subtypes (`Long walk`, `Salon`, `Dental` …) appear in the neutral badge.

## Care plan

**Buckets**, in this order, hidden when empty:
- `today` — amber bucket head, slightly larger card title, full emphasis
- `tomorrow` — normal
- `week` — Mon–Sun naming on the time line (`Wed · 11:00`)
- `later` — month + day on the time line (`Jun 22 · 14:00`), muted text

Card grid: `auto 1fr auto auto` → checkbox · body · badge · menu trigger. Left border = category color stripe.

**Limits.** 4 visible by default, "Show N more" expands. Recently completed shows last 5, collapsible.

**Undo.** Completing a task fires a 6s toast with Undo. Restoring is also available from the completed list.

## Calendar modal

Opens from the calendar icon in the Care plan header. ESC, backdrop click, and ✕ all close it.

- Title: `May 2026` only (no eyebrow).
- Weekday header: single letters, normal weight, Monday-first.
- 6×7 day grid, 40px cells. Out-of-month cells dim.
- Each day with events shows a 22×3px segmented bar under the number, one segment per category present.
- Selected day: dark fill, white number, bar hidden (avoids noise).
- Day panel below the grid: `**Today** · May 17` inline header with `+ Add event` on the right. Empty state is one quiet line, no border.

## Icons

All SVGs live in `src/icons.jsx`. Stroke icons share a base (`fill: none`, `currentColor`, round caps/joins). The `Svg` wrapper takes `size` and `stroke` props; default `14 / 1.8`.

## Files

```
src/
  App.jsx           state owner: events, complete/restore/delete
  Hero.jsx          profile card
  Upcoming.jsx      care plan: buckets, completed, menus
  CalendarModal.jsx month grid + selected-day panel
  data.js           TODAY, TYPES, INITIAL_EVENTS, parseDate, daysBetween
  icons.jsx         shared SVG icons
  styles.css        all styles, tokens at top
```

State is held in `App.jsx`; both `Upcoming` and `CalendarModal` read the same `events` array. `TODAY` is pinned to 2026-05-17 for the demo.
