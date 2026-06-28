import { NextResponse } from "next/server";

/**
 * Waitlist signup endpoint → Brevo (https://brevo.com).
 *
 * Why Brevo: the free plan allows UNLIMITED contacts (you only pay once you
 * need to send more than 300 emails/day). So you can collect any number of
 * signups for free; the daily cap only affects how fast you blast the launch
 * email to a very large list.
 *
 * Flow: add (or update) the contact and place them on your "Waitlist" list.
 * The instant confirmation email is sent by a Brevo Automation triggered when a
 * contact is added to that list (set up in the Brevo dashboard). The launch
 * announcement is sent later as a Brevo Campaign to the same list.
 *
 * Required env vars:
 *   BREVO_API_KEY  — Brevo → Settings → SMTP & API → API keys
 *   BREVO_LIST_ID  — numeric id of your "Waitlist" contact list
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

type Json = Record<string, unknown>;

export async function POST(req: Request) {
  // --- Parse + validate -----------------------------------------------------
  let email = "";
  try {
    const body = (await req.json()) as Json;
    email = String(body?.email ?? "")
      .trim()
      .toLowerCase();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  // --- Config ---------------------------------------------------------------
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey) {
    // In dev, no-op so the UI flow is testable before the key is wired.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[waitlist] BREVO_API_KEY not set — returning dev no-op success. " +
          "Set BREVO_API_KEY + BREVO_LIST_ID in .env.local to go live.",
      );
      return NextResponse.json({ ok: true, status: "dev-noop" });
    }
    console.error("[waitlist] BREVO_API_KEY is not configured.");
    return NextResponse.json(
      { ok: false, error: "Waitlist is temporarily unavailable." },
      { status: 503 },
    );
  }

  // --- Add / update the contact --------------------------------------------
  try {
    const res = await fetch(BREVO_CONTACTS_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email,
        updateEnabled: true, // idempotent: update instead of erroring on dupes
        listIds: listId ? [Number(listId)] : undefined,
        attributes: { SOURCE: "Website waitlist" },
      }),
    });

    // 201 = created (new), 204 = updated (already existed).
    if (res.status === 201) {
      return NextResponse.json({ ok: true, status: "subscribed" });
    }
    if (res.status === 204) {
      return NextResponse.json({ ok: true, status: "already-subscribed" });
    }

    const data = (await res.json().catch(() => ({}))) as Json;
    if (
      res.status === 400 &&
      /already|exist|duplicate/i.test(JSON.stringify(data))
    ) {
      return NextResponse.json({ ok: true, status: "already-subscribed" });
    }

    console.error("[waitlist] Brevo error:", res.status, data);
    return NextResponse.json(
      { ok: false, error: "Couldn't add you right now. Please try again." },
      { status: 502 },
    );
  } catch (err) {
    console.error("[waitlist] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
