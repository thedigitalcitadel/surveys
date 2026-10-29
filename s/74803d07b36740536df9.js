/* One survey = one config. The file name is the first 20 hex characters of
   SHA-256(survey code); the code itself is never stored in this repo.
   Keep id, fields, options and the open window in sync with SURVEYS in Code.gs. */
window.SURVEY = {
  id: 'ywyl-day1',            // also the Sheet tab name; letters, digits, dashes
  version: 2,                 // bump when questions change (v2: Friction/Function/Future questions)
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
  meta: '12 questions · about 4 minutes · anonymous',
  submitLabel: 'Send my answers',
  thanksTitle: 'Thank you',
  thanksBody: 'Thanks! Your talk resources are next. Bookmark the page, the podcast and notes land there tonight.',
  thanksLink: { url: 'https://www.drkrisalexander.com/ai-matters-2026', label: 'Talk resources: podcast & notes', redirectSeconds: 5 },
  privacy: [
    'This survey is anonymous. It doesn\u2019t ask for your name, email or school, and it doesn\u2019t use cookies, trackers or analytics. Please don\u2019t type anything that identifies you or anyone else.',
    'Your answers go to a private Google Sheet held by The Digital Citadel. They\u2019re used only to plan tomorrow\u2019s session and improve future talks, and they\u2019re reported only as totals or short unattributed quotes.',
    'Questions: support@thedigitalcitadel.com'
  ],
  fields: [
    { key: 'occupation', type: 'text', required: true, max: 120, section: 'About you',
      label: 'What\u2019s your occupation or job title?',
      placeholder: 'e.g. principal, teacher, superintendent, IT lead' },
    { key: 'workplace', type: 'radio', required: false,
      label: 'Where do you work?',
      options: ['Elementary school', 'Secondary school', 'Board / district office', 'College or university', 'Other'] },
    { key: 'story', type: 'radio', required: false, section: 'Friction',
      label: 'Which story stuck with you most?',
      options: ['Filming my daughters\u2019 volleyball', 'Vibe coding an app by voice',
                'Recruitment: 26 programs, 12 schools, 202 courses in 1 week'] },
    { key: 'ai_fail_move', type: 'radio', required: false,
      label: 'When something you try with AI fails, what\u2019s your usual first move?',
      options: ['Try again', 'Ask someone', 'Drop it', 'Haven\u2019t tried yet'] },
    { key: 'ai_comfort', type: 'scale', required: false, min: 1, max: 5,
      label: 'How comfortable are you using AI in your work right now?',
      minLabel: '1 · Not at all', maxLabel: '5 · Very' },
    { key: 'build_ready', type: 'scale', required: false, min: 1, max: 5, section: 'Function',
      label: 'How ready do you feel to build something small with AI by talking it through?',
      minLabel: '1 · Not yet', maxLabel: '5 · Ready now' },
    { key: 'tool_week', type: 'radio', required: false,
      label: 'Which tool are you most likely to try this week?',
      options: ['Coconote', 'NotebookLM', 'Gemini', 'Artcraft', 'OBS', 'Canva', 'Blackmagic Camera', 'VDO Ninja', 'None yet'] },
    { key: 'will_try', type: 'textarea', required: false, max: 800,
      label: 'One thing from today you\u2019ll try or think about', hint: 'Optional.' },
    { key: 'fear_quote', type: 'scale', required: false, min: 1, max: 5, section: 'Future',
      label: '\u201cThe future of failure is removing the fear of failure.\u201d How true does that ring for your classroom or work?',
      minLabel: '1 · Not at all', maxLabel: '5 · Completely' },
    { key: 'fail_tomorrow', type: 'textarea', required: false, max: 800,
      label: 'What\u2019s one thing you\u2019ll let your students or team try and fail at tomorrow?', hint: 'Optional.' },
    { key: 'teach_tomorrow', type: 'textarea', required: true, max: 1500,
      label: 'After today\u2019s talk, what would you like me to teach you tomorrow?' },
    { key: 'topics', type: 'checkbox', required: false, maxPick: 3,
      label: 'Which of these would you most want covered?', hint: 'Pick up to 3.',
      // keep Code.gs in sync
      options: ['Designing for productive failure', 'Using AI in assessment', 'Game-based learning',
                'Leading staff through AI change', 'Learn how to build local AI', 'Hands-on with AI tools', 'Other'],
      otherKey: 'topics_other', otherMax: 120, otherPlaceholder: 'Other topic' }
  ]
};
