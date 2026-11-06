/**
 * Page-level copy (hero, section headings, summary, submission messages).
 * Service wording lives in services.js.
 */

export const BRAND = {
  // Logo files are set in js/content/media.js. This text is the fallback
  // wordmark if they can't load.
  name: 'Zenwood',
  location: 'Hocking Hills',
  preparedBy: 'Prepared by Blinkslow MKTG',
};

/** Short lines shown over the parallax image bands between stages. */
export const INTERLUDES = {
  beforeFoundation: {
    quote: 'Before a guest ever arrives, they meet Zenwood on a screen.',
    caption: 'It starts with the brand',
  },
  beforePostLaunch: {
    quote: 'Opening day is only the beginning.',
    caption: 'After launch',
  },
};

export const HERO = {
  eyebrow: 'A Launch Roadmap for Zenwood',
  heading: "Let's Get Zenwood Ready for Launch.",
  body: [
    'Launching a new brand comes with a lot of moving pieces.',
    'From establishing a consistent brand identity to creating content for your website, cabins, and social media, each piece helps build the foundation for a successful launch.',
    "We've outlined the areas where Blinkslow can help bring Zenwood to life. Explore the options, select where you'd like support, and we'll put together a customized proposal based on your needs.",
  ],
  cta: 'Explore Launch Services',
  reassurance: 'Explore at your own pace. No pricing or commitments required.',
};

export const ROADMAP = {
  eyebrow: 'The Launch Roadmap',
  heading: 'Everything builds from a clear foundation.',
  body: 'Brand direction shapes every piece that follows — the website, each cabin, and how Zenwood shows up on social. Explore each section below and add the services you’d like quoted. Your selections build your launch plan at the end.',
  foundationCaption: 'Guides everything below',
};

/** Optional note field at the bottom of each section. */
export const SECTION_NOTE = {
  add: 'Add a note about this section',
  edit: 'Your note',
  label: (title) => `Anything you'd like to add about ${title}?`,
  placeholder: 'Optional — priorities, timing, existing assets, questions…',
};

/** Short guide shown where the selections begin (top of Stage One). */
export const HOW_IT_WORKS = {
  label: 'How this works',
  steps: [
    { title: 'Open a section', body: 'Each section lists the services available for that part of the launch.' },
    { title: 'Read the details', body: 'See the goal of each service and what’s included.' },
    { title: 'Add to your plan', body: 'Tap “Add to plan” on anything you’d like us to quote. Tap again to remove it.' },
  ],
  note: 'Nothing is committed — your selections simply tell us what to include in your proposal.',
};

export const STAGES = {
  foundation: {
    eyebrow: 'Stage One',
    heading: 'Start with the foundation.',
  },
  launch: {
    eyebrow: 'Stage Two',
    heading: 'Launch marketing services.',
    body: 'Three branches, each shaped by the brand foundation. Select only what you need — every service stands on its own.',
  },
};

export const SUMMARY = {
  eyebrow: 'Your Selections',
  heading: 'Your Zenwood Launch Plan',
  body: "Here's what you've chosen so far. You can return to any section to make changes — everything is saved as you go.",
  empty: "You haven't added any services yet. Explore the sections above and choose “Add to My Launch Plan” on anything you'd like quoted.",
  notesLabel: 'Anything else we should know about your launch, timeline, or marketing needs?',
  notesPlaceholder: 'Optional',
  dateLabel: 'Target launch date',
  datePlaceholder: 'e.g. Spring 2027, or a specific date',
};

export const SUBMIT = {
  cta: 'Send My Selections to Blinkslow',
  sending: 'Sending…',
  reassurance: "We'll review your selections and follow up with a customized proposal. No account or payment needed.",
  success: {
    heading: 'Thank you — your selections are on their way.',
    body: "Blinkslow has received your launch plan and will be in touch with a customized proposal.",
  },
  error: {
    heading: "We couldn't send your selections just now.",
    body: 'Please try again in a moment, or use one of the options below so nothing gets lost.',
  },
  emailFallback: {
    heading: 'Your email draft is ready.',
    body: "Your email app should have opened with your launch plan filled in — just press send. If nothing opened, copy your plan below and email it to your Blinkslow contact.",
  },
  manualFallback: {
    heading: 'Copy your plan to send it over.',
    body: 'Copy your formatted launch plan and send it to your Blinkslow contact by email or text.',
  },
  needsSelection: 'Add at least one service, a post-launch preference, or a note before sending.',
  copy: 'Copy My Plan',
  copied: 'Copied to clipboard',
  email: 'Open Email Draft',
  retry: 'Try Again',
};
