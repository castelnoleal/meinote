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

## Broadcast (announcements, image / tab share, live screen share)

An admin can reach every MeiNote that is open. Messages pass through [ntfy.sh](https://ntfy.sh), a free public relay. **Only** what the admin broadcasts travels through it — the notes agents type never do.

**To broadcast, two ways:**
- Open `meibroadcast.html` (link it from the CSatS admin side), or
- In any MeiNote, type the trigger phrase into the "Search Articles…" box, then enter the password.

**The console has tabs:**
- **Announce** — pop a message on every MeiNote. Choose how long it stays (10s up to "until I clear it"), and optionally **Keep showing**: if an agent closes it, it comes back after a set delay. Sent announcements are saved so you can **re-post** them. **Clear all notifications** dismisses them everywhere at once.
- **Image** — paste an image (Ctrl+V), choose a file, or paste a picture link; it pops up on every MeiNote. Pasted images go through the relay as a resized file; very large ones may be refused by the public ntfy server, in which case use a link.
- **Web tab** — show a web page inside a panel on every MeiNote. Some sites block being embedded; those fall back to "Open in new tab".
- **Screen** — live screen share (WebRTC, team-sized, video goes straight between browsers). Keep the console open while sharing.
- **Settings** — change the password (saved on that computer) and see the channel.

The header shows how many MeiNote are open right now.

**Settings** live at the top of the `BROADCAST` section in each shift file, and in `meibroadcast.html` — they must match. The channel name is visible in these public files, so the password only guards the console, not the channel. Changing the password in Settings saves it on that computer only; to change it for every admin, update `PASS_SHA256` in the files. For a fully private channel, run your own ntfy server and set its URL in `NTFY_BASE`.

## Editing

Edit with `MeiNote_Editor.html`, an offline tool kept outside this repository:

1. Open the editor, then open a shift file.
2. Edit templates, requests, call notes, articles, scripts or shift settings, and click **Apply change**.
3. Click **Save this file** or **Save all 3 shifts**.
4. Upload the saved file(s) here with **Add file → Upload files**.

The files can also be edited by hand: each shift file starts with a guide to its numbered sections.
