/* One survey = one config. The file name is the first 20 hex characters of
   SHA-256(survey code); the code itself is never stored in this repo.
   Keep id, fields, options and the open window in sync with SURVEYS in Code.gs. */
window.SURVEY = {
  id: 'ywyl-day1',            // also the Sheet tab name; letters, digits, dashes
  version: 1,                 // bump when questions change
  open: true,                 // set false to close the survey early
  // Open window, Toronto time (EDT, UTC-4). Accepts Thu Oct 29 and Fri Oct 30, 2026.
  opensAt: '2026-10-29T00:00:00-04:00',
  closesAt: '2026-10-31T00:00:00-04:00',
  notYetText: 'This survey opens on Thursday, October 29.',
  closedText: 'This survey has closed. Thanks for your interest.',
  eyebrow: 'AI Matters 2026 · Thursday keynote',
  title: 'You Win or You Learn',
  subtitle: 'The Art of Failure in the Age of AI',
  lede: 'Thanks for being here today. Tell me what you\u2019d like me to teach you tomorrow, and I\u2019ll shape Friday\u2019s session around it.',
  meta: '6 questions · about 2 minutes · anonymous',
  submitLabel: 'Send my answers',
  thanksTitle: 'Thank you',
  thanksBody: 'Your answers are in. See you tomorrow.',
  privacy: [
    'This survey is anonymous. It doesn\u2019t ask for your name, email or school, and it doesn\u2019t use cookies, trackers or analytics. Please don\u2019t type anything that identifies you or anyone else.',
    'Your answers go to a private Google Sheet held by The Digital Citadel. They\u2019re used only to plan tomorrow\u2019s session and improve future talks, and they\u2019re reported only as totals or short unattributed quotes.',
    'Questions: support@thedigitalcitadel.com'
  ],
  fields: [
    { key: 'occupation', type: 'text', required: true, max: 120,
      label: 'What\u2019s your occupation or job title?',
      placeholder: 'e.g. principal, teacher, superintendent, IT lead' },
    { key: 'workplace', type: 'radio', required: false,
      label: 'Where do you work?',
      options: ['Elementary school', 'Secondary school', 'Board / district office', 'College or university', 'Other'] },
    { key: 'teach_tomorrow', type: 'textarea', required: true, max: 1500,
      label: 'After today\u2019s talk, what would you like me to teach you tomorrow?' },
    { key: 'topics', type: 'checkbox', required: false, maxPick: 3,
      label: 'Which of these would you most want covered?', hint: 'Pick up to 3.',
      // PLACEHOLDER topics: edit freely (keep Code.gs in sync)
      options: ['Designing for productive failure', 'Using AI in assessment', 'Game-based learning',
                'Leading staff through AI change', 'AI policy and guardrails', 'Hands-on with AI tools', 'Other'],
      otherKey: 'topics_other', otherMax: 120, otherPlaceholder: 'Other topic' },
    { key: 'ai_comfort', type: 'scale', required: false, min: 1, max: 5,
      label: 'How comfortable are you using AI in your work right now?',
      minLabel: '1 · Not at all', maxLabel: '5 · Very' },
    { key: 'will_try', type: 'textarea', required: false, max: 800,
      label: 'One thing from today you\u2019ll try or think about', hint: 'Optional.' }
  ]
};
