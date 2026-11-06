# Zenwood Launch Planner

An interactive launch roadmap prepared by Blinkslow MKTG for Zenwood. The owner can explore the services, choose the ones he wants quoted, and send his selections over. No pricing, no account, and no build step.

## Run locally

It's plain HTML, CSS and JavaScript modules, so it needs a web server; ES modules won't load from `file://`. Use the included server:

```bash
python3 serve.py
```

`serve.py` supports byte-range requests, which the scroll-scrubbed hero video needs for seeking. Python's built-in `http.server` doesn't support them, so use `serve.py` locally. Production static hosts already support them.

Then open http://localhost:5178.

## Deploy (Vercel) and receive submissions (Formspree)

**1. Formspree: where submissions go**
1. Create a form at formspree.io.
2. Copy its address (for example `https://formspree.io/f/abcd1234`) into `endpoint` in `js/config.js`.
3. Each submission arrives as an email with the subject "Zenwood Launch Plan — new selections". The readable `summary` field comes first. Every submission is also kept in your Formspree dashboard.
4. In the form's settings on Formspree:
   - Leave reCAPTCHA off. This page sends in the background, and reCAPTCHA would block it.
   - Optionally, restrict submissions to your Vercel domain.

**2. Vercel: hosting**
1. Push this folder to a GitHub repository.
2. On vercel.com, go to **Add New → Project** and import the repository.
3. Use these settings:
   - Framework preset: **Other**
   - Build command: none
   - Output directory: the root (`.`)
4. Deploy. Every later push to GitHub redeploys the site automatically.

`vercel.json` adds a header that tells search engines not to index the site, and sets caching for `assets/`. `.vercelignore` keeps this README and `serve.py` off the live site.

**3. Before sharing:** open the live link, make a test submission, and confirm the email arrives. Selections are stored only in each visitor's own browser, so the owner starts with a blank plan.

## Where things live

| To change… | Edit |
|---|---|
| Service names, descriptions, goals, inclusions, order, conditional question wording | `js/content/services.js` |
| Hero, roadmap, summary and submission copy | `js/content/site-copy.js` |
| Submission endpoint / email fallback | `js/config.js` → `SUBMISSION` |
| Example Brand Kit | The image is `assets/brand-kit/zenwood-brand-kit-concept-01.webp`. Its title, caption and label are set in `BRAND_KIT_PREVIEW` in `js/config.js`. To show a different file, change `src` (an image or a PDF both work). Set `src` to `''` to go back to the built-in placeholder in `js/components/brand-kit/example-brand-kit.js`. |
| Logos, hero video, interlude imagery | `js/content/media.js` |
| Interlude quotes | `INTERLUDES` in `js/content/site-copy.js` |
| Colors, type, spacing | Tokens at the top of `css/styles.css`. Colors come from the Brand Kit palette (Forest, Sage, Stone, Ivory, Charcoal). Type matches zenwoodhockinghills.com. |

### Imagery and motion

- **Source:** the logos, the aerial video (11.7 MB) and its poster frame were copied from zenwoodhockinghills.com into `./assets/`, using the same sub-paths as their site. The planner doesn't load anything from their live site. Put new photography in `./assets/` and reference it in `js/content/media.js`.
- **Hero:** a pinned section whose aerial video follows the scroll, like Zenwood's homepage.
- **Interludes:** parallax image bands that each show a single frame of that video. You can switch any of them to a photo by adding `image: '…'` in `media.js`.
- **Fireflies:** golden particles drift in the interludes and behind the summary.
- **Fallbacks:**
  - With reduced motion turned on, the hero is a still image with the text in normal flow, and there is no parallax and no particles.
  - With Data Saver on, the hero uses the still image instead of the video.
  - If a logo fails to load, a text wordmark appears in its place.

### Components (`js/components/`)

- `Hero`: the introduction
- `LaunchRoadmap`: the hierarchy overview (Brand Foundation → three branches → Post-Launch)
- `ServiceCategory`: an expandable category
- `ExpandableService`: one service row (it expands without selecting)
- `ServiceDetailPanel`: goal, inclusions and actions
- `SelectionControl`: the round check and the "Add to My Launch Plan" toggle
- `ConditionalQuestions`: cabin count, influencer support type, and the strategy/content pairing note
- `brand-kit/BrandKitPreview`: a self-contained modal that can be replaced on its own
- `PostLaunchSupport`: one question with three answers
- `SelectionSummary`: "Your Zenwood Launch Plan", plus notes and the target date
- `ProposalSubmission`: sending, error states and fallbacks

State lives in `js/state/store.js` and is saved to `localStorage` (key `zenwood-launch-plan:v1`). `js/lib/plan.js` turns that state into the summary, the payload and the email text.

## Submission

Nothing is configured yet. Here is what the "Send" button does in each setup:

1. **`endpoint` set**: it POSTs JSON (shape below). It shows the success message **only** on a 2xx response. Otherwise it shows an error with Retry and Copy (plus Email, if configured).
2. **No endpoint, `recipientEmail` set**: it opens a prefilled email draft. This is never reported as "sent".
3. **Neither set**: it offers "Copy My Plan" and shows the formatted text.

Formspree, Basin, Getform, a Zapier/Make webhook, or a small serverless function all work as the endpoint. If the endpoint lives on a different domain, it must allow CORS.

Payload:

```json
{
  "source": "zenwood-launch-planner",
  "submittedAt": "2026-11-05T15:00:00.000Z",
  "services": [{ "category": "Cabin Booking Pages", "id": "cabin-photography", "service": "Cabin Photography", "detail": "6 cabins" }],
  "cabinCount": 6,
  "influencerSupport": "both",
  "postLaunchSupport": "Possibly interested",
  "targetLaunchDate": "Spring 2027",
  "notes": "…",
  "summary": "ZENWOOD LAUNCH PLAN\n…"
}
```

## Notes

- Service `id`s are the keys for saved selections. Rename the display `name` freely, but keep the `id` stable.
- The example Brand Kit is labeled as an example concept, not Zenwood's approved identity.
- Respects `prefers-reduced-motion`. Every control works from the keyboard. The Brand Kit modal uses the native `<dialog>` element (it traps focus and closes with Esc).
