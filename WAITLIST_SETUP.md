# Waitlist setup (Brevo)

The waitlist form posts to `POST /api/waitlist`, which adds the email to your
**Brevo** contact list. The instant confirmation email is sent by a Brevo
**Automation**, and the launch announcement is sent later as a Brevo **Campaign**.

## Why Brevo

Brevo's **free plan allows unlimited contacts** — so you can collect any number
of signups for free. The only free-tier limit is **300 emails/day of sending**,
which only matters when you blast the launch email to a very large list (you can
stagger the send over a few days, or upgrade for the launch month). Collecting
signups is always unlimited and free.

Re-submitting an email that's already on the list succeeds quietly and does
**not** re-trigger the confirmation.

---

## 1. Create the list + API key

1. Sign up at [brevo.com](https://www.brevo.com).
2. **Contacts → Lists → Create a list** (e.g. "Waitlist"). Note its **numeric id**
   (visible in the list's URL / settings).
3. **Settings → SMTP & API → API keys → Generate a new API key.**
4. Copy the env file and fill both values:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   BREVO_API_KEY=your_real_key_here
   BREVO_LIST_ID=3   # your list's numeric id
   ```

5. Restart `npm run dev`. (No key in dev = the form succeeds as a harmless no-op
   so you can test the UI; the real send only happens once the key is set.)

## 2. Set up the instant confirmation email

In Brevo:

1. **Automations → Create an automation → start from scratch** (or use the
   "Welcome message" template).
2. **Entry point / trigger:** _A contact is added to a list_ → choose your
   **Waitlist** list.
3. Add an **email** step → design your “You’re on the Morph waitlist 🎉”
   confirmation (you’ll need a verified sender — Brevo walks you through it under
   **Senders & IP**).
4. **Activate** the automation.

That’s the email everyone gets the moment they sign up.

## 3. Send the launch announcement (when you’re ready)

1. **Campaigns → Email → Create a campaign.**
2. **Recipients:** your **Waitlist** list.
3. Write the “Morph is live” email and **Send / Schedule**.
   (On the free plan you can send 300/day — if your list is larger, schedule it
   to send in batches over a few days, or upgrade for that month.)

## 4. Deploy

Add the same env vars wherever you host (e.g. Vercel → **Project → Settings →
Environment Variables**):

```
BREVO_API_KEY = your_real_key_here
BREVO_LIST_ID = 3
```

Redeploy. The route runs on the Node.js serverless runtime — no extra config.

---

### Viewing / exporting signups

All signups live in Brevo under **Contacts** (filter by your Waitlist list). Export
to CSV anytime.

### Switching providers later

Only `app/api/waitlist/route.ts` knows about Brevo. To swap providers, change the
`fetch` in that file — the front-end form and everything else stays the same.
