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
| `meibroadcast.html` | Admin broadcast console (announcements + screen share) — link it from CSatS |
| `assets/` | Styles and icons for the classic pages and tools |

Each shift page is one self-contained file. It works offline, and everything an agent types stays in their own browser (localStorage). The one exception is the broadcast feature below.

## Broadcast (announcements + live screen share)

An admin can pop a notification on every MeiNote that is open, and share their screen live into it. Messages pass through [ntfy.sh](https://ntfy.sh), a free public relay. **Only** the announcement text and, during a share, the screen video travel through it — the notes agents type never do.

**To broadcast, two ways:**
- Open `meibroadcast.html` (link it from the CSatS admin side), or
- In any MeiNote, type the trigger phrase into the "Search Articles…" box, then enter the password.

The console sends an announcement to everyone, or shares your screen (WebRTC — suited to a team-sized group, since the video goes straight between browsers). Keep the console open while sharing.

**Settings** live at the top of the `BROADCAST` section in each shift file, and in `meibroadcast.html` — they must match. Change the channel name and password before relying on it: the channel name is visible in these public files, so the password only guards the console, not the channel. For a fully private channel, run your own ntfy server and set its URL in `NTFY_BASE`.

## Editing

Edit with `MeiNote_Editor.html`, an offline tool kept outside this repository:

1. Open the editor, then open a shift file.
2. Edit templates, requests, call notes, articles, scripts or shift settings, and click **Apply change**.
3. Click **Save this file** or **Save all 3 shifts**.
4. Upload the saved file(s) here with **Add file → Upload files**.

The files can also be edited by hand: each shift file starts with a guide to its numbered sections.
