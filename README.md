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

## Private details (team pack)

These files contain no coworker names, emails or internal links. They have placeholders such as `{{mgr_manila_email:Manila manager's email}}` instead. Each agent loads the private team pack once (header → **Team pack** → Load team pack file). It is kept in that browser only.

The team pack file (`meinote-team-pack.json`) is shared with the team directly. **Never upload it here or to any website.**

## Editing

Edit with `MeiNote_Editor.html`, an offline tool kept outside this repository:

1. Open the editor, then open a shift file (and your team pack, so the preview shows real details).
2. Edit templates, requests, call notes, articles, scripts or shift settings, and click **Apply change**.
3. Click **Save this file** or **Save all 3 shifts**. The editor checks for private details first and can move them into the team pack.
4. Upload the saved file(s) here with **Add file → Upload files**.

The files can also be edited by hand: each shift file starts with a guide to its numbered sections.
