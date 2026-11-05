# MeiNote

Note and request templates for the Openers, Midshift and Closers shifts.
Everything runs from these files. No internet connection is needed, except for the
US map drawing inside the time zone tool (its clocks and converter still work offline).

## Pages

| File | What it is |
|---|---|
| `index.html` | Landing page (castelmei.com) |
| `index_openers.html` | MeiNote Openers |
| `index_midshift.html` | MeiNote Midshift |
| `index_closers.html` | MeiNote Closers |
| `MeiScript_V.0.1.0.html` | KB Navigator (compass button) |
| `ccast-calculator.html` | CSAT Recovery Calculator (chart button) |
| `ccast-us-tz.html` | US Time Zone Map (map button) |
| `missed-interaction-tracker.html` | Missed Interaction Tracker (! button) |
| `legacy/` | Classic V.5 pages and tools, kept for reference |

## Where to edit things

All three shifts share the same files in `assets/`, so one change updates every shift.

| To change... | Edit |
|---|---|
| Shift start/end time, page title | the `MEINOTE` settings at the top of `index_openers.html` / `index_midshift.html` / `index_closers.html` |
| The template list in the dropdown, header buttons, pop-ups | `assets/js/layout.js` |
| The fields shown for a template | `assets/js/templates.js` (find `if(t==="Template Name")`) |
| The note text a template produces | `assets/js/notes.js` (find `if(currentTemplate==="Template Name")`) |
| KB articles and disclosures (DCID, ISD, ATD ...) | `assets/js/articles.js` |
| Timers, calendar, calculator, search, copy/clear | `assets/js/app.js` |
| Live output, note history, callback alarms, shortcuts | `assets/js/features.js` (settings at the top) |
| Colors and look | `assets/css/meinote.css` |

### Adding a template

1. `layout.js`: add `<option>My Template</option>` inside the right `<optgroup>`.
2. `templates.js`: add a block `if(t==="My Template"){ f.innerHTML=` ...fields... `; }`.
   Give every input an `id`.
3. `notes.js`: add a block `if(currentTemplate==="My Template"){ ... }` that reads the
   fields with `val("id")` or `line("Label","id")`.

The template name must be spelled the same in all three places.

### Editing text inside backticks

`layout.js`, `templates.js` and `articles.js` keep HTML between backticks (`` ` ``).
Edit the HTML normally. If the text itself needs a backtick, write `` \` ``.

## Tailwind

`assets/css/tailwind.css` is generated. Classes already used in MeiNote work as they are.
If you add a Tailwind class that isn't used anywhere yet, either style it in `meinote.css`
or regenerate the file with the Tailwind 3 CLI:

    npx tailwindcss@3.4.17 -i input.css -o assets/css/tailwind.css --minify

with `input.css` containing the three `@tailwind base; @tailwind components; @tailwind utilities;`
lines and `darkMode: 'class'`, scanning `assets/js/*.js`, `index_*.html` and `legacy/index_*.html`.

## Classic V.5

`legacy/` holds the V.5 pages exactly as they were, with today's shift hours and links to the
V.5 copies of the tools. Each V.6 page links to its classic page ("Classic V.5" in the header),
and each classic page links back ("Back to V.6").

To restore V.5 completely, copy `legacy/index_openers.html` (and the others) over the
files with the same name in the main folder, and change the tool links in them from
`MeiScript_V.0.1.0.html` etc. to `legacy/MeiScript_V.0.1.0.html`, or keep the new tools.

## Saved data

Note history, alarms, recent templates and settings are saved in each browser on each
computer (localStorage). Account and routing numbers are saved as the last 4 digits only.
Clearing the browser's site data removes them.
