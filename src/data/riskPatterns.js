/**
 * Claritus Risk Pattern Registry & Rule Engine Definitions
 * Maps legal clause patterns to severity levels, WCAG accessible labels, icons,
 * plain English explanations, and actionable counter-negotiation language.
 */

export const RISK_PATTERNS = [
  {
    patternId: "UNLIMITED_INDEMNIFICATION",
    regex: /(indemnify|hold harmless|defend|unlimited liability|indemnification)/i,
    severity: "critical",
    label: "Critical Risk",
    iconName: "AlertOctagon",
    category: "Liability & Indemnity",
    explanation: "This clause forces you to pay for all legal damages, losses, or lawyer fees—even if the damage was caused by the other party's negligence.",
    suggestedLanguage: "Replace with: 'Each party shall defend and indemnify the other solely against third-party claims arising directly from such party's gross negligence or willful misconduct, with total liability capped at total fees paid under this Agreement.'"
  },
  {
    patternId: "FORCED_ARBITRATION_CLASS_WAIVER",
    regex: /(binding arbitration|forced arbitration|waives all rights to a jury|class-action waiver|class action)/i,
    severity: "critical",
    label: "Critical Risk",
    iconName: "AlertOctagon",
    category: "Dispute Resolution",
    explanation: "Strips away your constitutional right to take dispute claims to court or join class-action suits, locking you into private arbitration selected by the opposing party.",
    suggestedLanguage: "Replace with: 'Any dispute shall first be submitted to good-faith executive negotiation for 30 days. If unresolved, disputes may be brought in a court of competent jurisdiction located in [City, State].'"
  },
  {
    patternId: "AUTOMATIC_RENEWAL_TRAP",
    regex: /(automatically renew|automatic renewal|successive term|120 days|90 days prior)/i,
    severity: "high",
    label: "High Risk",
    iconName: "AlertTriangle",
    category: "Contract Term & Penalties",
    explanation: "Locks you into a long-term agreement extension automatically unless you send notice 90–120 days before the contract end date.",
    suggestedLanguage: "Replace with: 'This contract shall convert to a month-to-month agreement upon expiration, cancellable by either party upon 30 days written notice without penalty.'"
  },
  {
    patternId: "UNILATERAL_PRICE_INCREASE",
    regex: /(reserve the right to increase|increase subscription|unilateral|at landlord's discretion|without prior notice)/i,
    severity: "high",
    label: "High Risk",
    iconName: "AlertTriangle",
    category: "Financial & Pricing",
    explanation: "Allows the other party to raise fees, rent, or prices unilaterally without giving you a chance to approve or cancel.",
    suggestedLanguage: "Replace with: 'Fee adjustments shall not exceed 3% annually and require at least 60 days advance written notice, during which Customer may terminate without penalty.'"
  },
  {
    patternId: "BROAD_NON_COMPETE",
    regex: /(non-compete|compete directly|same industry|100 miles|three \(3\) years|24 months)/i,
    severity: "high",
    label: "High Risk",
    iconName: "AlertTriangle",
    category: "Career & Business Restrictions",
    explanation: "Restricts your ability to work, consult, or operate in your industry or geographic region after this contract ends.",
    suggestedLanguage: "Replace with: 'Non-compete shall be restricted strictly to direct client solicitation during the active term of this agreement and for a maximum of 6 months post-termination.'"
  },
  {
    patternId: "NET_90_PAYMENT_DELAY",
    regex: /(net-90|net 90|subjective|withhold payment)/i,
    severity: "caution",
    label: "Caution",
    iconName: "AlertCircle",
    category: "Payment Terms",
    explanation: "Delays payment for up to 90 days after invoice submission or lets the client withhold pay based on subjective satisfaction.",
    suggestedLanguage: "Replace with: 'Invoices shall be payable Net-30 days from date of receipt. Late payments shall accrue interest at 1.5% per month.'"
  },
  {
    patternId: "ALL_PRIOR_WORKS_IP_LOSS",
    regex: /(assigns to client all|prior works|pre-existing code|forfeits all rights|moonlighting ban)/i,
    severity: "critical",
    label: "Critical Risk",
    iconName: "AlertOctagon",
    category: "Intellectual Property",
    explanation: "Transfers ownership of all your pre-existing tools, libraries, or personal side-projects to the other party.",
    suggestedLanguage: "Replace with: 'Contractor retains sole ownership of all pre-existing IP and background code. Client is granted a non-exclusive license solely for the deliverables created under this Agreement.'"
  },
  {
    patternId: "NO_NOTICE_ENTRY",
    regex: /(at any time|without prior notice|24 hours a day)/i,
    severity: "high",
    label: "High Risk",
    iconName: "AlertTriangle",
    category: "Privacy & Access",
    explanation: "Permits property entry without advance notice, violating tenant privacy standards.",
    suggestedLanguage: "Replace with: 'Landlord shall provide at least 24 hours advance written notice prior to entering premises, except in emergency cases threatening life or property.'"
  }
];
