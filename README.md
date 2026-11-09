# MeiNote

Note templates and tools for call center agents. Served at castelmei.com.

## Files

| File | What it is |
|---|---|
| `index.html` | Landing page |
| `index_openers.html` | MeiNote V.6.0, Openers shift (09:00–18:30) |
| `index_midshift.html` | MeiNote V.6.0, Midshift (10:00–19:30) |
| `index_closers.html` | MeiNote V.6.0, Closers (11:30–21:00) |
| `legacy/` | Classic V.5 pages, opened from the V.6 header |
| `MeiScript_V.0.1.0.html`, `ccast-calculator.html`, `ccast-us-tz.html`, `missed-interaction-tracker.html` | Tools opened from MeiNote |
| `assets/` | Styles and icons for the classic pages and tools |

Each shift page is one self-contained file. It works offline, and everything an agent types stays in their own browser (localStorage). Nothing is sent to a server.

## Editing

Edit with `MeiNote_Editor.html`, an offline tool kept outside this repository:

1. Open the editor, then open a shift file.
2. Edit templates, requests, call notes, articles, scripts or shift settings, and click **Apply change**.
3. Click **Save this file** or **Save all 3 shifts**.
4. Upload the saved file(s) here with **Add file → Upload files**.

The files can also be edited by hand: each shift file starts with a guide to its numbered sections.
