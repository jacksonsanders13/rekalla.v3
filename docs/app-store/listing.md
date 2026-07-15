# App Store listing — copy-paste reference

Everything App Store Connect asks for, ready to paste. Character limits noted
where Apple enforces them.

---

## App name (30 chars max)

```
Rekalla
```

## Subtitle (30 chars max)

```
Memory support, made simple
```

## Category

- Primary: **Medical** *(or **Lifestyle** if you'd rather avoid the extra
  scrutiny Medical sometimes gets — both are defensible; Lifestyle is the
  safer first submission)*
- Secondary: **Health & Fitness**

## Description (4000 chars max)

```
Rekalla helps older adults stay on top of their day — and gives the people who
love them a simple way to help from anywhere.

FOR LOVED ONES
• See today at a glance: reminders, routine, and progress rings that fill as
  the day goes on
• Check off medications, meals, appointments, and calls as you complete them
• Follow a simple morning / afternoon / evening routine
• Look up the people and details that matter — family, doctors, medications,
  important dates — in your Memory Bank, with one-tap calling
• Do a short daily wellness check-in: mood, sleep, and energy

FOR CAREGIVERS
• Connect to a family member's account in seconds with their 6-letter
  connect code — no shared passwords
• Set up and manage their reminders, daily routine, and Memory Bank from
  your own phone
• See how their day is going

DESIGNED FOR OLDER EYES AND HANDS
Large text, big touch targets, high contrast, and plain language throughout.
No clutter, no ads, no jargon.

PRIVATE BY DESIGN
Your information is only visible to you and the caregivers you choose to
connect with. No ads, no tracking, no selling data. You can permanently
delete your account at any time from Settings.

Rekalla is a memory and coordination aid. It is not a medical device and does
not provide medical advice, diagnosis, or treatment.
```

## Keywords (100 chars max, comma-separated, no spaces after commas)

```
memory,reminder,caregiver,elderly,senior,dementia,routine,medication,aging,family,care,daily
```

*(98 characters. Don't repeat "Rekalla" — the app name is already searchable.)*

## Promotional text (170 chars max — editable without a new build)

```
Reminders, routines, and a memory bank for older adults — with a simple
connect code that lets family help from anywhere.
```

## Support URL

```
https://github.com/jacksonsanders13/rekalla
```

## Privacy Policy URL

```
https://jacksonsanders13.github.io/rekalla/privacy/
```

*(Requires GitHub Pages enabled on the repo — Settings → Pages → Deploy from
branch → `main` / `/docs`.)*

## Copyright

```
© 2026 Jackson Sanders
```

---

## App Privacy questionnaire (App Store Connect → App Privacy)

Answer **"Yes, we collect data from this app."** Then declare:

| Data type | Collected? | Linked to identity? | Used for tracking? | Purpose |
|---|---|---|---|---|
| Contact Info → Name | Yes | Yes | No | App Functionality |
| Contact Info → Email Address | Yes | Yes | No | App Functionality |
| Health & Fitness → Health | Yes (wellness check-ins: mood/sleep/energy) | Yes | No | App Functionality |
| User Content → Other User Content | Yes (reminders, routine, memory bank) | Yes | No | App Functionality |
| Contacts | **No** (memory-bank entries are typed in manually; the app never reads the phone's contacts) | — | — | — |
| Identifiers, Location, Browsing History, Purchases, Diagnostics | No | — | — | — |

- "Do you or your third-party partners use data for tracking?" → **No**

## Age rating questionnaire

All content questions → **None**. Result: **4+**.

- Unrestricted web access → No
- Gambling → No
- Medical/treatment information → **No** (the app stores user-entered
  reminders; it does not provide medical information or advice)

## Export compliance

Already handled in the build: `ITSAppUsesNonExemptEncryption = false` is set
in app.json, so App Store Connect won't ask about encryption on each upload.

---

## TestFlight — "What to Test" notes (for testers)

```
Welcome to the Rekalla beta!

Try both sides of the app:

1. LOVED ONE: Create an account, pick "Loved One". Look at the Summary rings,
   check off a reminder, follow the Routine tab, browse the Memory Bank, and
   do a wellness check-in.

2. CAREGIVER: Create a second account (different email), pick "Caregiver".
   On the Loved One's phone, open the heart icon to find their connect code.
   Enter it in the caregiver app, then try adding a reminder, a routine step,
   and a Memory Bank entry for them.

Things we'd love feedback on:
• Is any text too small or any button hard to tap?
• Is the wording clear everywhere?
• Anything confusing about connecting the two accounts?

Known limitation: push notifications aren't in this build yet.
```

## Beta App Review notes (TestFlight → Test Information)

Apple needs a demo login to review the app. Create a test account first
(e.g. review@yourdomain.com / a strong password), then paste:

```
Demo account (Loved One role):
Email: <fill in>
Password: <fill in>

Rekalla has two account types. The demo account is a "Loved One" (care
recipient). To see the caregiver side, sign up in-app as a Caregiver and
connect using the code shown on the demo account's "My caregivers" screen
(heart icon, top right of the Summary screen).

Account deletion: Settings (gear icon) → Delete my account.
```
