'use strict';

// Set this to a user-approved email address to enable the email-draft action.
const contactEmail = '';

const projectStories = {
  mechanic: {
    category: 'WEB PLATFORM / PROJECT CONTRIBUTION',
    title: 'MobileMechanicBids',
    summary: 'A service marketplace connecting customers and professionals, with booking, invoicing, and payment workflows.',
    contributions: [
      'Refined Stripe onboarding and payment interfaces, including the move to Stripe Payment Elements.',
      'Implemented invoice closing, a review guard, and removal of offline invoices in a dedicated payment-flow branch.',
      'Worked on Google Calendar booking behavior, reauthentication handling, event creation, and time-slot availability.',
      'Improved vehicle forms, mobile input behavior, onboarding, profiles, bid cards, and dispute history presentation.',
      'Tested invoice and payment scenarios and kept experimental wallet-button work on a separate branch.'
    ],
    focus: 'Payments and bookings have many states. My work focused on clear user feedback, appropriate guards, mobile usability, and checking the conditions around each action.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Apollo Client', 'GraphQL', 'Stripe', 'Google Calendar']
  },
  tenant: {
    category: 'PROPTECH / PROJECT CONTRIBUTION',
    title: 'Tenant Access',
    summary: 'Property access and tenant-management workflows that bring memberships, smart locks, and communication into one product.',
    contributions: [
      'Worked on property listing criteria, intake flows, and tenant-facing dashboard experiences.',
      'Contributed to Stripe membership and trial workflows for owners and managers.',
      'Implemented time-bound access-code behavior for tenants and authorized users, including email delivery.',
      'Worked with Igloohome and Schlage access workflows through smart-lock integrations.',
      'Contributed to Telnyx IVR, showing-calendar workflows, and tenant portal navigation and branding.'
    ],
    focus: 'The central challenge was aligning access permissions and code expiry with the right person, membership, and lease context while keeping the interface clear.',
    technologies: ['React', 'Node.js', 'Stripe', 'Seam', 'Telnyx', 'Google Calendar']
  },
  echo: {
    category: 'MOBILE APPLICATION / PROJECT CONTRIBUTION',
    title: 'EchoMate',
    summary: 'A React Native and Expo app with authentication, profiles, contacts, and audio-focused experiences.',
    contributions: [
      'Worked on OTP sign-in and authentication navigation, including return-to behavior.',
      'Implemented profile updates and avatar-upload workflows.',
      'Handled contact permissions and contact-invitation experiences.',
      'Built and refined the audio-player interface, loading skeletons, and tab navigation.',
      'Integrated Supabase authentication and storage with the mobile experience.'
    ],
    focus: 'Mobile experiences need to account for permissions, loading states, media behavior, and interrupted navigation. My work brought these details into a coherent flow.',
    technologies: ['React Native', 'Expo', 'Expo Router', 'Expo AV', 'Supabase Auth', 'Supabase Storage']
  },
  chat: {
    category: 'BACKEND & INTERFACE / PROJECT WORK',
    title: 'FastAPI Chat',
    summary: 'A chat service and client experience with users, conversations, messages, and streamed AI responses.',
    contributions: [
      'Worked on users, conversations, and messages within a FastAPI and PostgreSQL service.',
      'Migrated the AI-response integration from Cohere to OpenAI.',
      'Connected streamed responses to the frontend using Server-Sent Events.',
      'Implemented optimistic interface behavior so outgoing messages appear immediately.',
      'Handled message decoding and related data-processing requirements.'
    ],
    focus: 'I explored the full path from an API response to a useful interface: progressive output, conversation state, and feedback while a response is still being generated.',
    technologies: ['FastAPI', 'Python', 'PostgreSQL', 'OpenAI', 'SSE', 'React']
  }
};

