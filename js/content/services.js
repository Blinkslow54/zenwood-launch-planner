/**
 * ZENWOOD LAUNCH PLANNER — SERVICE CONTENT
 * ------------------------------------------------------------
 * All service names, descriptions, hierarchy, and conditional
 * question wording live here. Edit this file to change copy,
 * add/remove services, or reorder categories. No layout code
 * needs to change.
 *
 * Service fields:
 *   id        unique, stable key (used for saved selections — avoid renaming)
 *   name      display name
 *   short     one-line description shown in the list
 *   goal      the purpose of the service
 *   included  bullet list of what Blinkslow provides
 *   note      optional clarifying note shown in the detail panel
 *   perCabin  true if produced per cabin (summary shows cabin count)
 *   preview   'brandKit' shows the "View Example Brand Kit" button
 *   followUp  'influencerType' shows the optional influencer sub-question
 */

export const CATEGORIES = [
  {
    id: 'brand-foundation',
    group: 'foundation',
    number: '01',
    eyebrow: 'The Foundation',
    title: 'Brand Foundation',
    roadmapBlurb: 'Who Zenwood is, who it speaks to, and how it should look and feel.',
    intro:
      "Before creating content, it's important to establish a clear understanding of who Zenwood is, who we're speaking to, and how the brand should look and feel. This foundation helps keep every marketing touchpoint consistent.",
    services: [
      {
        id: 'brand-kit',
        name: 'Brand Kit',
        short: "A documented guide to Zenwood's identity, voice, and visual direction.",
        goal: "Establish a cohesive identity and creative direction that guides Zenwood's marketing across every platform.",
        included: [
          'Brand positioning and values',
          'Target audience identification',
          'Brand personality and tone of voice',
          'Core messaging and communication style',
          'Brand color palette and typography',
          'Visual mood boards',
          'Photography style and creative direction',
          'Video style, pacing, and aesthetic',
          'Social media visual direction',
          'Brand consistency and usage guidelines',
        ],
        note:
          "We'll build on Zenwood's existing logo and identity elements — refining and documenting what's already working rather than redesigning everything.",
        preview: 'brandKit',
      },
      {
        id: 'influencer-brief',
        name: 'Influencer Creative Brief',
        short: 'A polished, reusable guide showing creators how to capture and talk about Zenwood.',
        goal: 'Provide influencers and content creators with a clear guide for representing Zenwood consistently and authentically.',
        included: [
          'Overview of the Zenwood brand',
          'Target audience',
          'Key messaging and talking points',
          'Desired content styles and formats',
          'Creative examples and inspiration',
          'Content expectations and deliverables',
          "Brand do's and don'ts",
          'Guidelines for maintaining the Zenwood aesthetic',
        ],
        note:
          'Delivered as a reusable, PDF-style guide. Finding and managing influencers is a separate service under Social Media Launch.',
      },
    ],
  },
  {
    id: 'website-content',
    group: 'launch',
    number: '02',
    eyebrow: 'Launch Marketing',
    title: 'Website Content',
    roadmapBlurb: "Imagery and video for Zenwood's main website.",
    intro:
      "Your website is often a guest's first experience with Zenwood. Professional imagery and video help communicate the atmosphere, quality, and experience before someone ever arrives.",
    services: [
      {
        id: 'homepage-video',
        name: 'Homepage Header Video',
        short: 'A short, cinematic piece that sets the mood the moment someone arrives on the site.',
        goal: 'Create a memorable first impression that immediately communicates the Zenwood experience.',
        included: [
          'Cinematic video production',
          'Property, landscape, and atmosphere footage',
          'Professional editing and color grading',
          'A short, website-optimized final video',
        ],
        note: 'The emphasis is on mood, atmosphere, and the feeling of staying at Zenwood.',
      },
      {
        id: 'supporting-videos',
        name: 'Supporting Website Videos',
        short: 'Short clips that bring key website sections, amenities, and experiences to life.',
        goal: 'Bring additional website sections to life and help visitors better understand the Zenwood experience.',
        included: [
          'Short videos for relevant website sections',
          'Amenity and experience highlights',
          'Lifestyle and environmental footage',
          'Professional editing and delivery',
        ],
        note: 'These are supplementary videos, not full-length property walkthroughs.',
      },
      {
        id: 'website-photography',
        name: 'Website Photography',
        short: 'A cohesive image library capturing the property, landscape, and guest experience.',
        goal: "Create a cohesive library of professional imagery for Zenwood's main website.",
        included: [
          'Lifestyle photography',
          'Landscape and environmental photography',
          'Amenities and shared spaces',
          'Architectural and design details',
          'Images communicating the atmosphere and guest experience',
        ],
        note:
          'Focused on the overall Zenwood brand and experience. Individual cabin listing photography is covered under Cabin Booking Pages.',
      },
    ],
  },
  {
    id: 'cabin-booking',
    group: 'launch',
    number: '03',
    eyebrow: 'Launch Marketing',
    title: 'Cabin Booking Pages',
    badge: 'Produced per cabin',
    roadmapBlurb: 'Photography and video that help each cabin stand on its own.',
    intro:
      'Each cabin needs to stand on its own. Professional photos and video help potential guests understand the property, imagine their stay, and feel confident making a booking.',
    extras: ['cabinCount'],
    services: [
      {
        id: 'cabin-photography',
        name: 'Cabin Photography',
        short: "Polished interior and exterior imagery for each cabin's booking page.",
        goal: "Showcase each cabin's design, layout, amenities, and unique features to help convert visitors into bookings.",
        included: [
          'Professional interior photography',
          'Exterior photography',
          'Amenities and property features',
          'Architectural and design details',
          'Professionally edited images',
        ],
        perCabin: true,
      },
      {
        id: 'cabin-video',
        name: 'Cabin Marketing Video',
        short: 'An immersive, cinematic walkthrough of each cabin — one video for listings and marketing.',
        goal: 'Give potential guests an immersive walkthrough of the cabin while communicating its atmosphere and experience.',
        included: [
          'Professional video walkthrough',
          'Interior and exterior footage',
          'Important amenities and features',
          'Cinematic editing and color grading',
          'Finished marketing video',
        ],
        note: 'One video serves both purposes — a listing walkthrough and a marketing piece.',
        perCabin: true,
      },
    ],
  },
  {
    id: 'social-launch',
    group: 'launch',
    number: '04',
    eyebrow: 'Launch Marketing',
    title: 'Social Media Launch',
    roadmapBlurb: 'Introducing Zenwood to the right audience and building excitement.',
    intro:
      "A successful social media launch is about more than simply posting content. It's about introducing Zenwood with a clear message, reaching the right audience, and building excitement around the experience.",
    extras: ['socialPairing'],
    services: [
      {
        id: 'social-strategy',
        name: 'Launch Strategy & Management',
        short: 'A planned and fully managed social launch — from strategy through publishing and optimization.',
        goal: 'Develop and execute a coordinated social media launch that introduces Zenwood to its target audience and builds awareness.',
        included: [
          'Target audience and platform strategy',
          'Content pillars and messaging',
          'Launch campaign planning',
          'Content calendar development',
          'Creative direction and production planning',
          'Caption writing',
          'Content scheduling and publishing',
          'Performance monitoring',
          'Adjustments and optimization throughout the launch',
        ],
        note: 'Strategy and execution together, as a defined launch project — not an automatic ongoing retainer.',
      },
      {
        id: 'social-content',
        name: 'Launch Content Creation',
        short: 'Reels, short-form video, and photography produced specifically for social.',
        goal: 'Produce professional photography and video content that introduces Zenwood and communicates the experience across social media.',
        included: [
          'Short-form video and Reels',
          'Social media photography',
          'Content production planning',
          'Professional editing',
          'Final content delivery',
        ],
      },
      {
        id: 'influencer-management',
        name: 'Influencer Partnership Management',
        short: 'Finding, coordinating, and managing creators who introduce Zenwood to new audiences.',
        goal: 'Build and coordinate influencer partnerships that introduce Zenwood to relevant audiences and generate authentic content around the guest experience.',
        included: [
          'Influencer research and discovery',
          'Influencer outreach',
          'Coordination with existing influencer relationships',
          'Partnership communication',
          'Scheduling cabin stays and content visits',
          'Deliverable coordination',
          'Content review and brand alignment',
          'Campaign timelines and organization',
        ],
        note: 'The Influencer Creative Brief is a separate deliverable under Brand Foundation.',
        followUp: 'influencerType',
      },
    ],
  },
];

/* ---------- Conditional questions ---------- */

export const CABIN_COUNT = {
  question: 'How many cabins would you like us to capture?',
  hint: "Optional. Not every cabin needs both photography and video — we'll sort out the details together.",
  notSureLabel: 'Not sure yet',
  min: 1,
  max: 99,
};

export const INFLUENCER_SUPPORT = {
  question: 'What type of influencer support would be helpful?',
  hint: 'Optional',
  options: [
    { value: 'new', label: 'Finding and connecting with new influencers', summary: 'Finding new influencers' },
    { value: 'existing', label: "Managing influencers we've already identified", summary: 'Managing identified influencers' },
    { value: 'both', label: 'Both', summary: 'Both sourcing and management' },
    { value: 'unsure', label: 'Not sure yet', summary: 'Type of support not sure yet' },
  ],
};

export const SOCIAL_PAIRING = {
  strategyId: 'social-strategy',
  contentId: 'social-content',
  contentOnly:
    "If Zenwood already has a social media strategy in place, we're happy to focus on content production. We'll just need your existing strategy, content goals, and creative direction so we know what to capture and how to approach production.",
  both:
    'With both selected, Blinkslow can coordinate the strategy, content creation, and launch execution together — one plan, one team, and a consistent voice from first post to last.',
};

/* ---------- Post-launch support (intentionally simple) ---------- */

export const POST_LAUNCH = {
  id: 'post-launch',
  title: 'Post-Launch Support',
  eyebrow: 'After Launch',
  heading: 'Keep the Momentum Going.',
  body: [
    'Once Zenwood is launched, Blinkslow can continue supporting your social media efforts through ongoing strategy and management, content creation, or both.',
    'The level of support can carry over from whichever services you select for your launch.',
  ],
  question: 'Would you be interested in exploring ongoing support after launch?',
  options: [
    { value: 'yes', label: "Yes, let's explore ongoing support", summary: 'Interested in exploring ongoing support' },
    { value: 'possibly', label: "Possibly, let's discuss it", summary: 'Possibly interested' },
    { value: 'no', label: 'No, launch support only', summary: 'Launch support only' },
  ],
};

/* ---------- Helpers ---------- */

export const ALL_SERVICES = CATEGORIES.flatMap((c) => c.services.map((s) => ({ ...s, categoryId: c.id })));
export const SERVICE_IDS = ALL_SERVICES.map((s) => s.id);
export const findService = (id) => ALL_SERVICES.find((s) => s.id === id);
