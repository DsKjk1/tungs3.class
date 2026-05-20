export type Difficulty = 1 | 2 | 3;

export interface Question {
  q: string;
  options: string[];
  answer: number; // index
  why: string;
  topic: string;
  difficulty?: Difficulty;
}

export const questions: Question[] = [
  // ============ ENVIRONMENTAL (LARGEST POOL) ============
  // -- easy --
  { topic: "env", difficulty: 1, q: "Which is the BIGGEST energy user in a data center?", options: ["Keyboards", "Servers + cooling", "WiFi router", "Coffee machine"], answer: 1, why: "Servers run 24/7 and need constant cooling — together they dominate." },
  { topic: "env", difficulty: 1, q: "What does 'e-waste' stand for?", options: ["Easy waste", "Electronic waste", "Energy waste", "Empty waste"], answer: 1, why: "Discarded electronic devices — over 60Mt produced globally each year." },
  { topic: "env", difficulty: 1, q: "Why do data centers need cooling?", options: ["Servers run hot", "To freeze data", "To save WiFi", "To make ice"], answer: 0, why: "Servers generate huge heat; cooling stops them from melting/throttling." },
  { topic: "env", difficulty: 1, q: "Which material is NOT typically recovered from e-waste?", options: ["Gold", "Copper", "Banana peels", "Aluminium"], answer: 2, why: "E-waste recycling recovers metals — not organic matter." },
  { topic: "env", difficulty: 1, q: "What is 'phantom power'?", options: ["Wireless electricity", "Energy drawn by devices when 'off'", "A type of battery", "Solar power at night"], answer: 1, why: "Devices and chargers still draw power even when not in active use." },
  { topic: "env", difficulty: 1, q: "Rare earth metals are...", options: ["Renewable", "Finite & destructive to mine", "Found in plastic", "Made in factories"], answer: 1, why: "They're finite, and mining them damages habitats heavily." },
  { topic: "env", difficulty: 1, q: "Which is greener for short messages?", options: ["4K video call", "Plain text email", "Cloud-streamed game", "HD livestream"], answer: 1, why: "Text uses a tiny fraction of bandwidth and server energy." },
  { topic: "env", difficulty: 1, q: "Charger left in a wall socket alone...", options: ["Uses zero power", "Still draws a small current", "Charges itself", "Cools the wall"], answer: 1, why: "That's standby/phantom load — small per device, huge globally." },
  // -- medium --
  { topic: "env", difficulty: 2, q: "What does 'planned obsolescence' mean?", options: ["Devices designed to last forever", "Devices designed to fail or feel slow", "Free software updates", "A type of recycling"], answer: 1, why: "Designing devices so they become outdated or unusable quickly." },
  { topic: "env", difficulty: 2, q: "Which BEST reduces a laptop's energy use today?", options: ["Buy a bigger screen", "Lower brightness + sleep mode", "Leave it on overnight", "Run more browser tabs"], answer: 1, why: "Screens are huge power draws; sleep suspends most components." },
  { topic: "env", difficulty: 2, q: "Why is illegal e-waste dumping dangerous?", options: ["It's loud", "Toxic metals leak into soil & water", "It blocks roads", "It uses too much wifi"], answer: 1, why: "Lead, mercury and cadmium poison ecosystems and groundwater." },
  { topic: "env", difficulty: 2, q: "Which has a POSITIVE environmental impact?", options: ["Mining cobalt", "Smart grids optimising renewables", "Landfilling phones", "Streaming 4K all day"], answer: 1, why: "Smart grids balance supply and demand to maximise clean energy use." },
  { topic: "env", difficulty: 2, q: "PUE (Power Usage Effectiveness) of 1.0 means...", options: ["Half the power is wasted", "All power goes to computing, none to overhead", "Servers are off", "Cooling is broken"], answer: 1, why: "PUE = total facility power / IT power. 1.0 is the perfect ideal." },
  { topic: "env", difficulty: 2, q: "Which extends a device's useful life MOST?", options: ["Throwing it out yearly", "Repair, battery swap, OS updates", "Overclocking it", "Removing the case"], answer: 1, why: "Repair + software support are the strongest anti-obsolescence levers." },
  { topic: "env", difficulty: 2, q: "Most of a smartphone's lifetime CO₂ comes from...", options: ["Charging it", "Manufacturing it", "Recycling it", "Using WiFi"], answer: 1, why: "Mining + assembly dominate; that's why keeping phones longer matters." },
  { topic: "env", difficulty: 2, q: "Which is an example of 'digital pollution'?", options: ["Old emails sitting in cloud storage", "Painting a server", "Buying a USB", "Closing a tab"], answer: 0, why: "Stored data still uses powered, cooled disks 24/7." },
  // -- scenario / hard --
  { topic: "env", difficulty: 3, q: "A school replaces all working PCs every year for 'newest specs'. Best critique?", options: ["Great — fastest is greenest", "Wasteful: embodied carbon dominates lifecycle", "Saves electricity bills", "Reduces e-waste"], answer: 1, why: "Manufacturing emissions are huge; replacing working hardware multiplies them." },
  { topic: "env", difficulty: 3, q: "A streaming service moves servers to Iceland. Why might this be greener?", options: ["Closer to users", "Cold climate cuts cooling cost; geothermal grid", "Faster WiFi", "Less data needed"], answer: 1, why: "Free cooling + clean energy slash data centre footprint." },
  { topic: "env", difficulty: 3, q: "What would happen if EVERY user kept phones 4 years instead of 2?", options: ["No change", "~Halved manufacturing emissions per user", "Emissions double", "Phones explode"], answer: 1, why: "Doubling lifespan roughly halves the per-year embodied carbon share." },
  { topic: "env", difficulty: 3, q: "Identify the issue: a cloud game streams 4K to a phone for 3 hours daily.", options: ["No environmental issue", "High data centre + network energy use", "Saves the planet", "Reduces e-waste"], answer: 1, why: "Streaming high-bitrate video constantly is one of the most energy-intense uses." },
  { topic: "env", difficulty: 3, q: "Which design choice BEST reduces e-waste?", options: ["Glued-in batteries", "Modular, repairable, standard parts", "Thinner shells", "Removing headphone jacks"], answer: 1, why: "Modularity lets users replace one part instead of the whole device." },
  { topic: "env", difficulty: 3, q: "A company says cloud is 'greener than local servers'. When is that TRUE?", options: ["Always", "When the cloud uses renewables + high utilisation", "Never", "Only at night"], answer: 1, why: "Shared, well-utilised cloud infra on clean energy beats idle local boxes." },
  { topic: "env", difficulty: 3, q: "Which mining is MOST associated with smartphone batteries?", options: ["Coal", "Lithium and cobalt", "Iron", "Salt"], answer: 1, why: "Lithium-ion batteries depend on lithium and cobalt extraction." },

  // ============ PERSONAL DATA ============
  { topic: "data", difficulty: 1, q: "Which is personal data?", options: ["Average UK rainfall", "Your home address", "The colour of grass", "A public bus timetable"], answer: 1, why: "Personal data identifies a specific living person." },
  { topic: "data", difficulty: 1, q: "What is a 'cookie' on the web?", options: ["A snack", "A small file storing user data", "A virus", "A backup"], answer: 1, why: "Cookies are small files websites store to remember you." },
  { topic: "data", difficulty: 1, q: "Best protection against data theft?", options: ["Reuse one password", "Strong unique passwords + 2FA", "Public WiFi only", "Tell friends your PIN"], answer: 1, why: "Unique passwords plus a second factor stops most attacks." },
  { topic: "data", difficulty: 2, q: "'Sensitive' personal data includes...", options: ["Favourite colour", "Health, religion, biometrics", "Browser brand", "Screen size"], answer: 1, why: "Special-category data has stricter legal protection under GDPR." },
  { topic: "data", difficulty: 2, q: "A site asks for your DOB to read an article. This violates which principle?", options: ["Encryption", "Data minimisation", "Backups", "Caching"], answer: 1, why: "Collect only what's necessary for the stated purpose." },
  { topic: "data", difficulty: 3, q: "What would happen if a hospital leaked unencrypted patient records?", options: ["Nothing — it's just data", "Identity theft, blackmail, GDPR fines", "Faster diagnoses", "Free hospital WiFi"], answer: 1, why: "Health data is highly sensitive — leaks cause real harm and large legal penalties." },
  { topic: "data", difficulty: 3, q: "Identify the issue: a free quiz app asks for camera, mic, and contacts.", options: ["Reasonable", "Excessive permissions — likely data harvesting", "Required by law", "Improves quiz score"], answer: 1, why: "Permissions should match function. A quiz needs none of those." },

  // ============ LEGISLATION ============
  { topic: "law", difficulty: 1, q: "The Computer Misuse Act makes which illegal?", options: ["Buying a laptop", "Unauthorised access to systems", "Using passwords", "Watching YouTube"], answer: 1, why: "It criminalises hacking and unauthorised access to computer material." },
  { topic: "law", difficulty: 1, q: "GDPR mainly protects...", options: ["Companies' profits", "People's personal data", "Software bugs", "Operating systems"], answer: 1, why: "GDPR is the EU framework for personal data protection." },
  { topic: "law", difficulty: 2, q: "Under GDPR, you have the 'right to be...'", options: ["Famous", "Forgotten (erasure)", "Loud", "Online forever"], answer: 1, why: "Article 17 lets you request erasure of your personal data." },
  { topic: "law", difficulty: 2, q: "The Data Protection Act requires data to be...", options: ["Public", "Accurate, secure, lawfully processed", "Sold", "Printed"], answer: 1, why: "Core principles include accuracy, security and lawful basis." },
  { topic: "law", difficulty: 2, q: "Which is illegal under the Computer Misuse Act?", options: ["Reading public news", "Guessing your friend's password to log in", "Buying software", "Using your own PC"], answer: 1, why: "Unauthorised access — even without damage — is an offence." },
  { topic: "law", difficulty: 3, q: "A student writes a virus 'just to test'. Legal?", options: ["Yes — it's research", "No — creating/distributing malware is an offence", "Only at home", "Only on weekends"], answer: 1, why: "Section 3A of the CMA covers making/supplying tools for misuse." },

  // ============ AI ============
  { topic: "ai", difficulty: 1, q: "Machine learning is...", options: ["Hand-coded rules", "Computers learning patterns from data", "A new CPU", "A type of monitor"], answer: 1, why: "ML algorithms find patterns in data without explicit rules." },
  { topic: "ai", difficulty: 1, q: "AI 'bias' usually comes from...", options: ["Faulty wires", "Biased training data", "Cold rooms", "Dim screens"], answer: 1, why: "Models reflect the biases present in their training data." },
  { topic: "ai", difficulty: 2, q: "Which is a real ETHICAL concern with AI?", options: ["Too fast WiFi", "Job displacement & opaque decisions", "Better spellcheck", "Smaller phones"], answer: 1, why: "Automation, accountability and transparency are core AI ethics issues." },
  { topic: "ai", difficulty: 2, q: "A self-driving car must choose to swerve or brake. This is mostly a...", options: ["Hardware bug", "Ethical/decision-making problem", "Battery problem", "Wifi problem"], answer: 1, why: "Autonomous moral decisions are a key debate in AI safety." },
  { topic: "ai", difficulty: 3, q: "Identify the issue: a hiring AI rejects mostly female applicants.", options: ["Working as intended", "Training data bias replicating historical discrimination", "WiFi error", "User error"], answer: 1, why: "If trained on biased hires, the AI learns and amplifies that pattern." },
  { topic: "ai", difficulty: 3, q: "What would happen if AI moderates content with NO human oversight?", options: ["Perfect fairness", "Wrongful bans, missed harm, no accountability", "Faster internet", "Cheaper phones"], answer: 1, why: "AI makes mistakes; humans are needed for appeals and edge cases." },

  // ============ INTELLECTUAL PROPERTY ============
  { topic: "ip", difficulty: 1, q: "Copyright protects...", options: ["Hardware shapes", "Original creative works", "Database servers", "Trademarks only"], answer: 1, why: "Copyright covers original works like writing, music, code." },
  { topic: "ip", difficulty: 1, q: "Open-source software is...", options: ["Always free of cost", "Source code that can be viewed/modified per licence", "Illegal to use", "Only for hackers"], answer: 1, why: "Open-source means licensed source access — terms vary." },
  { topic: "ip", difficulty: 2, q: "A patent protects...", options: ["A logo", "An invention/process for limited years", "A song", "A username"], answer: 1, why: "Patents protect novel inventions for ~20 years." },
  { topic: "ip", difficulty: 2, q: "Trademarks protect...", options: ["Inventions", "Brand names/logos identifying a source", "Songs", "Source code"], answer: 1, why: "Trademarks distinguish goods/services in the market." },
  { topic: "ip", difficulty: 2, q: "DRM is used to...", options: ["Speed up downloads", "Restrict copying/use of digital content", "Translate text", "Cool servers"], answer: 1, why: "Digital Rights Management enforces licence terms technically." },
  { topic: "ip", difficulty: 3, q: "You copy code from Stack Overflow into a paid product. The risk?", options: ["None", "Licence violation if attribution/share-alike ignored", "Slower app", "Bigger files"], answer: 1, why: "Snippets are usually CC BY-SA — attribution and licence terms apply." },

  // ============ THREATS ============
  { topic: "threat", difficulty: 1, q: "Phishing is...", options: ["A network protocol", "Tricking users into giving info", "A backup method", "Cooling tech"], answer: 1, why: "Phishing uses fake messages to steal credentials or data." },
  { topic: "threat", difficulty: 1, q: "A brute-force attack tries to...", options: ["Smash the device", "Guess passwords by trying many combos", "Cool the CPU", "Unplug routers"], answer: 1, why: "It systematically tests password combinations." },
  { topic: "threat", difficulty: 2, q: "Ransomware does WHAT?", options: ["Speeds your PC", "Encrypts files and demands payment", "Backs up data", "Updates Windows"], answer: 1, why: "Files become unreadable until a ransom is paid (sometimes never restored)." },
  { topic: "threat", difficulty: 2, q: "A DoS attack aims to...", options: ["Steal passwords", "Overload a service so it can't respond", "Patch software", "Encrypt files"], answer: 1, why: "Denial-of-Service floods a target with traffic/requests." },
  { topic: "threat", difficulty: 2, q: "Social engineering exploits...", options: ["Old CPUs", "Human trust and behaviour", "WiFi signals", "RAM"], answer: 1, why: "It manipulates people, not machines, to break security." },
  { topic: "threat", difficulty: 3, q: "Identify the issue: an email says 'Your account is locked, click here NOW'.", options: ["Helpful warning", "Phishing — urgency + suspicious link", "Normal email", "From your bank for sure"], answer: 1, why: "Urgency + unexpected link = classic phishing pattern." },
  { topic: "threat", difficulty: 3, q: "What would happen if a hospital was hit by ransomware?", options: ["Just paperwork delay", "Patient care disrupted, lives at risk", "Faster service", "Free wifi"], answer: 1, why: "Real attacks have cancelled surgeries and rerouted ambulances." },

  // ============ PROTECTION ============
  { topic: "prot", difficulty: 1, q: "A firewall mainly does what?", options: ["Cools servers", "Filters network traffic", "Stores passwords", "Backs up data"], answer: 1, why: "Firewalls control which network traffic is allowed in/out." },
  { topic: "prot", difficulty: 1, q: "Two-factor authentication adds...", options: ["A second login step", "More cookies", "Bigger storage", "Faster WiFi"], answer: 0, why: "2FA requires a second proof of identity beyond the password." },
  { topic: "prot", difficulty: 2, q: "Encryption ensures data is...", options: ["Faster", "Unreadable without the key", "Public", "Compressed only"], answer: 1, why: "Confidentiality: only key-holders can read it." },
  { topic: "prot", difficulty: 2, q: "Which is the BEST password?", options: ["password123", "qwerty", "A long passphrase + symbols", "Your birthday"], answer: 2, why: "Length + entropy beats short complex passwords." },
  { topic: "prot", difficulty: 2, q: "Backups protect against...", options: ["Hot CPUs", "Ransomware, hardware failure, accidental deletion", "Slow WiFi", "Bright screens"], answer: 1, why: "Restoring from a clean backup defeats most data-loss scenarios." },
  { topic: "prot", difficulty: 3, q: "A company stores backups on the same server as live data. The risk?", options: ["None", "Single failure/ransomware destroys both", "Faster restores", "Cheaper hardware"], answer: 1, why: "Use the 3-2-1 rule: 3 copies, 2 media, 1 off-site." },
  { topic: "prot", difficulty: 3, q: "Identify the BEST defence-in-depth combo:", options: ["Just a password", "Firewall + 2FA + backups + updates + training", "Antivirus only", "Hide the WiFi name"], answer: 1, why: "Layered defences cover human, network, and recovery angles." },
];

export function pickQuestion(topic?: string): Question {
  const pool = topic ? questions.filter((q) => q.topic === topic) : questions;
  const list = pool.length ? pool : questions;
  return list[Math.floor(Math.random() * list.length)];
}

export function pickQuestions(n: number, topic?: string): Question[] {
  const pool = [...(topic ? questions.filter((q) => q.topic === topic) : questions)];
  const out: Question[] = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  while (out.length < n) out.push(pickQuestion(topic));
  return out;
}

/**
 * Pick a question scaled by wave: early waves favour easy, later waves harder.
 * Avoids repeating the most recent N questions.
 */
const recentlyAsked: string[] = [];
export function pickQuestionForWave(wave: number, topic?: string): Question {
  // wave 1-3: mostly diff 1; wave 4-9: mostly diff 2; wave 10+: mix 2/3
  const target: Difficulty = wave >= 10 ? 3 : wave >= 4 ? 2 : 1;
  const fallback: Difficulty = target === 3 ? 2 : target === 2 ? 1 : 1;
  const base = topic ? questions.filter(q => q.topic === topic) : questions;
  const tryPool = (d: Difficulty) =>
    base.filter(q => (q.difficulty ?? 1) === d && !recentlyAsked.includes(q.q));
  let pool = tryPool(target);
  if (!pool.length) pool = tryPool(fallback);
  if (!pool.length) pool = base.filter(q => !recentlyAsked.includes(q.q));
  if (!pool.length) { recentlyAsked.length = 0; pool = base; }
  const pick = pool[Math.floor(Math.random() * pool.length)];
  recentlyAsked.push(pick.q);
  if (recentlyAsked.length > 8) recentlyAsked.shift();
  return pick;
}
