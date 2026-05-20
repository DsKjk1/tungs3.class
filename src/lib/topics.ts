export interface TopicMeta {
  slug: string;
  code: string;
  title: string;
  short: string;
  blurb: string;
}

export const topics: TopicMeta[] = [
  { slug: "environmental-issues", code: "01", title: "Environmental Issues", short: "ENV",
    blurb: "Manufacture, energy, e-waste, recycling, replacement cycles, positive impact." },
  { slug: "personal-data", code: "02", title: "Personal Data", short: "DATA",
    blurb: "What personal data is, why it matters, who collects it, how it leaks." },
  { slug: "legislation", code: "03", title: "Legislation", short: "LAW",
    blurb: "Computer Misuse Act, Data Protection, Copyright — the rules of the net." },
  { slug: "artificial-intelligence", code: "04", title: "Artificial Intelligence", short: "AI",
    blurb: "Machine learning basics, ethics, bias, jobs, autonomous systems." },
  { slug: "intellectual-property", code: "05", title: "Protecting Intellectual Property", short: "IP",
    blurb: "Copyright, licenses, open-source, plagiarism, DRM." },
  { slug: "threats", code: "06", title: "Threats to Digital Systems", short: "THRT",
    blurb: "Malware, phishing, social engineering, brute force, DoS." },
  { slug: "protecting-systems", code: "07", title: "Protecting Digital Systems", short: "PROT",
    blurb: "Firewalls, encryption, 2FA, access control, backups." },
];
