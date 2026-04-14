export interface QuestionOption {
  id: string
  label: string
  description?: string
}

export interface Question {
  id: string
  number: string
  section: string
  title: string
  description: string
  options: QuestionOption[]
  aiPrefilled?: string
  suggestedAnswer?: string
  clarifyExplanation?: string
  answered?: boolean
  markedForReview?: boolean
}

export interface QuestionSection {
  id: string
  title: string
  count: number
  questions: Question[]
}

export const privacyAssessmentSections: QuestionSection[] = [
  {
    id: 'residency',
    title: 'Residency information',
    count: 3,
    questions: [
      {
        id: 'q1-1',
        number: '1.1',
        section: 'Residency information',
        title: 'Where is data stored and processed?',
        description:
          'Tell us where the data involved in this initiative will be stored and processed. This helps us understand whether cross-border data transfer rules apply.',
        options: [
          { id: 'eu-only', label: 'EU only', description: 'All storage and processing occurs within the European Union' },
          { id: 'us-only', label: 'US only', description: 'All storage and processing occurs within the United States' },
          { id: 'eu-us', label: 'EU and US', description: 'Data is stored or processed across both regions' },
          { id: 'global', label: 'Global / multiple regions', description: 'Data may be handled across various international locations' },
        ],
        suggestedAnswer: 'eu-us',
        markedForReview: true,
        clarifyExplanation: "This question is asking where the actual servers storing your data are located. Since you use OpenAI (US-based) and your company operates in the EU, data crosses borders — which means EU privacy rules (GDPR) apply to how it's handled.",
      },
      {
        id: 'q1-2',
        number: '1.2',
        section: 'Residency information',
        title: 'Are users located in the EU or other regulated regions?',
        description: 'This determines which privacy regulations apply to the people whose data is processed.',
        options: [
          { id: 'eu-users', label: 'Yes, EU users are involved', description: 'GDPR and related EU regulations apply' },
          { id: 'us-users', label: 'US only', description: 'CCPA and applicable US state laws apply' },
          { id: 'both', label: 'Both EU and US users', description: 'Multiple regulatory frameworks apply' },
          { id: 'neither', label: 'Neither — other regions', description: 'Different regional laws may apply' },
        ],
        suggestedAnswer: 'both',
        markedForReview: true,
        clarifyExplanation: "This is asking where the people whose data you're using actually live. Your customers and support agents are in the EU and US, so both GDPR and CCPA apply — meaning your company has privacy obligations in both regions.",
      },
      {
        id: 'q1-3',
        number: '1.3',
        section: 'Residency information',
        title: 'Are cross-border data transfers covered by a legal mechanism?',
        description:
          'When data moves between regions (like EU to US), a legal agreement is required to make that transfer lawful.',
        options: [
          { id: 'scc', label: 'Standard Contractual Clauses (SCCs)', description: 'EU-approved legal template for cross-border transfers' },
          { id: 'bcr', label: 'Binding Corporate Rules', description: 'Internal policies approved for multinational companies' },
          { id: 'adequacy', label: 'Adequacy decision', description: 'The destination country has been approved by the EU' },
          { id: 'none', label: 'Not yet in place', description: 'A legal mechanism still needs to be established' },
        ],
        suggestedAnswer: 'scc',
        markedForReview: true,
        clarifyExplanation: "When your EU customer data goes to OpenAI's US servers, you need a legal 'permission slip' to make that transfer okay under EU law. Your DPA with OpenAI already includes Standard Contractual Clauses, which is the most common permission mechanism — so you're covered.",
      },
    ],
  },
  {
    id: 'systems',
    title: 'Systems',
    count: 7,
    questions: [
      {
        id: 'q2-1',
        number: '2.1',
        section: 'Systems',
        title: 'How are backups, system logs, and data exports encrypted?',
        description:
          'What controls are in place to prevent unauthorized access or re-identification of personal data?\n\nPlease specify encryption methods (at rest and in transit), key management practices, access controls, and any data minimization or de-identification safeguards applied to these artifacts.',
        options: [
          {
            id: 'full',
            label: 'Fully Encrypted with Strong Controls',
            description:
              'Encrypted at rest using industry-standard encryption (e.g., AES-256 or equivalent)\nEncrypted in transit (e.g., TLS 1.2+)\nKeys managed via centralized KMS/HSM with role-based access control',
          },
          {
            id: 'limited',
            label: 'Encrypted but Limited Safeguards',
            description:
              'Encrypted at rest and/or in transit\nBasic key management practices in place\nLimited documented controls over re-identification risk',
          },
          {
            id: 'partial',
            label: 'Partially Encrypted',
            description:
              'Encryption applied inconsistently (e.g., production data encrypted, but logs or exports not encrypted by default)\nManual processes required for export encryption',
          },
          {
            id: 'none',
            label: 'Not Encrypted or Not Documented',
            description:
              'No encryption applied to backups/logs/exports\nEncryption status not formally documented\nNo documented re-identification risk assessment',
          },
          { id: 'other', label: 'Other (Please Describe)', description: '' },
        ],
        clarifyExplanation: "This question asks whether your data is protected when it's stored in backups or moving between systems. Think of encryption like a lock — 'at rest' means the data is locked when sitting in storage, 'in transit' means it's locked while traveling over the internet. You want both locks in place.",
      },
      {
        id: 'q2-3',
        number: '2.3',
        section: 'Systems',
        title: 'Is there a defined process for responding to a data breach?',
        description:
          'Do you have a documented incident response plan that covers how to detect, contain, and report a breach involving this system?',
        options: [
          {
            id: 'formal',
            label: 'Yes, formal documented plan',
            description: 'Written incident response plan, tested regularly, with clear notification timelines',
          },
          {
            id: 'informal',
            label: 'Informal process exists',
            description: 'General understanding of steps, but not formally documented',
          },
          { id: 'partial2', label: 'Partially in place', description: 'Some documentation exists but not complete or tested' },
          { id: 'no', label: 'No process in place', description: 'No defined response process for this system' },
        ],
        clarifyExplanation: "A 'data breach response plan' is basically your fire drill for when something goes wrong with data. This question asks if you have written steps for: noticing a breach happened, stopping it from spreading, and letting the right people know (including regulators within 72 hours under GDPR).",
      },
      {
        id: 'q2-4',
        number: '2.4',
        section: 'Systems',
        title: 'Who has access to the personal data processed by this system?',
        description: 'Please describe the access control model — which roles or user groups can read, write, or export personal data.',
        options: [
          {
            id: 'strict',
            label: 'Strictly limited, role-based access',
            description: 'Only specific roles can access personal data; access is logged and reviewed',
          },
          {
            id: 'broad',
            label: 'Broad access within a team',
            description: 'Whole team or department can access; no fine-grained controls',
          },
          {
            id: 'mixed',
            label: 'Mixed — some controls in place',
            description: 'Some roles are restricted, others have broader access',
          },
          { id: 'unknown', label: "I'm not sure", description: 'Access controls have not been reviewed for this system' },
        ],
        clarifyExplanation: "This is asking who can see your customers' personal information in this system. Ideally, only the people who genuinely need it to do their job should have access — and there should be a record of who accessed what. Think of it like a 'need to know' policy.",
      },
    ],
  },
]

export const allQuestions: Question[] = privacyAssessmentSections.flatMap(s => s.questions)
