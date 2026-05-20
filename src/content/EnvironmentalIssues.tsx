import { Reveal, TerminalBox } from "@/components/atoms";
import { MCQuiz, TrueFalse } from "@/components/Quiz";
import { Flashcards } from "@/components/Flashcards";
import { SortGame } from "@/components/SortGame";
import { EnergyMeter } from "@/components/EnergyMeter";
import { ReplacementTimeline } from "@/components/ReplacementTimeline";
import { SpotTheProblem } from "@/components/SpotTheProblem";

function Section({
  id, code, title, intro, children,
}: {
  id: string; code: string; title: string; intro: string; children?: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <Reveal>
          <div className="flex items-center gap-3 text-xs text-primary mb-3">
            <span className="border border-primary px-2 py-0.5 glow-border">SECTION_{code}</span>
            <span className="h-px flex-1 bg-border" />
            <span className="text-muted-foreground">/env/{id}.md</span>
          </div>
          <h2 className="text-2xl md:text-3xl text-primary glow-text">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground leading-relaxed">{intro}</p>
        </Reveal>
        {children && <div className="mt-6 grid gap-6">{children}</div>}
      </div>
    </section>
  );
}

function Bullets({ items }: { items: { k: string; v: string }[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((it) => (
        <div key={it.k} className="ascii-frame bg-card/30 p-3 text-xs hover:glow-border transition">
          <div className="text-primary">▸ {it.k}</div>
          <div className="mt-1 text-muted-foreground leading-relaxed">{it.v}</div>
        </div>
      ))}
    </div>
  );
}

export function EnvironmentalIssues() {
  return (
    <>
      {/* Intro */}
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Reveal>
            <TerminalBox title="readme.txt">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every device in your bag, on your desk, and in your pocket has a hidden cost.
                Mining, factories, electricity, cooling, packaging, shipping, and eventually
                <span className="text-primary"> the bin</span>. This module decodes how computing affects the planet —
                and what you, the operator, can actually do about it.
              </p>
              <div className="mt-3 flex flex-wrap gap-1 text-[11px] text-primary">
                {["MANUFACTURE","ENERGY","DISPOSAL","RECYCLING","CYCLES","CONSEQUENCES","REDUCE","POSITIVE"].map((t) => (
                  <span key={t} className="border border-primary px-2 py-0.5">{t}</span>
                ))}
              </div>
            </TerminalBox>
          </Reveal>
        </div>
      </section>

      {/* 1. MANUFACTURE */}
      <Section
        id="manufacture"
        code="01"
        title="Manufacture"
        intro="Devices don't materialise out of thin air. Building a phone or laptop pulls metals out of the ground, drinks rivers of water, and fires up power-hungry factories."
      >
        <Reveal>
          <Bullets items={[
            { k: "Non-renewable materials", v: "Lithium, cobalt, gold, rare earth metals — once dug up, they're gone." },
            { k: "Mining", v: "Strip mining destroys habitats, pollutes rivers, and often relies on unsafe labour." },
            { k: "Energy usage", v: "Chip fabrication needs huge amounts of electricity — much of it still from fossil fuels." },
            { k: "Waste water", v: "Factories produce contaminated water that can poison nearby ecosystems." },
          ]}/>
        </Reveal>
        <Reveal>
          <TrueFalse
            statement="Rare earth metals can be remade in a lab so mining isn't a real issue."
            answer={false}
            why="Rare earth metals are finite resources. They can't be 'made' — only extracted, with massive environmental damage."
          />
        </Reveal>
      </Section>

      {/* 2. ENERGY CONSUMPTION */}
      <Section
        id="energy"
        code="02"
        title="Energy Consumption"
        intro="Tech eats electricity 24/7. Even when you're asleep, servers, routers, and cooling fans are spinning. Tap a bar to see where the watts are really going."
      >
        <Reveal><EnergyMeter /></Reveal>
        <Reveal>
          <Bullets items={[
            { k: "Data centers", v: "Buildings full of servers running streaming, social media, AI, and cloud storage." },
            { k: "Devices", v: "Billions of phones, TVs, consoles drawing power around the clock." },
            { k: "Cooling systems", v: "Servers run hot. Cooling can use almost as much energy as the servers themselves." },
            { k: "Networking", v: "Cell towers, routers, and undersea cables move your packets — always on." },
          ]}/>
        </Reveal>
        <Reveal>
          <MCQuiz items={[
            { q: "Which uses the MOST energy in a typical data center facility?",
              options: ["The keyboards", "The servers + their cooling", "The Wi-Fi router", "The vending machine"],
              answer: 1,
              why: "Servers do the work, but cooling them is almost as expensive — together they dominate." },
            { q: "Why is reducing energy waste important environmentally?",
              options: ["It makes devices look cooler", "Most electricity still comes from fossil fuels which release CO₂", "It speeds up your Wi-Fi", "It removes ads"],
              answer: 1,
              why: "Less energy used = fewer fossil fuels burned = less CO₂ in the atmosphere." },
          ]}/>
        </Reveal>
      </Section>

      {/* 3. DISPOSAL */}
      <Section
        id="disposal"
        code="03"
        title="Disposal"
        intro="When devices die, where do they actually go? A worrying amount ends up dumped, not recycled — and they don't decompose like banana peels."
      >
        <Reveal>
          <Bullets items={[
            { k: "E-waste", v: "Discarded electronics — the world produces over 60 million tonnes per year." },
            { k: "Illegal dumping", v: "E-waste is often shipped to poorer countries and dumped in unsafe sites." },
            { k: "Toxic materials", v: "Lead, mercury, cadmium leak into soil and groundwater." },
            { k: "Non-recyclable components", v: "Glued screens, soldered batteries — designed to be hard to take apart." },
          ]}/>
        </Reveal>
        <Reveal>
          <SortGame
            prompt="Sort each item into the correct disposal route."
            bins={[
              { id: "ewaste", label: "E-waste centre" },
              { id: "recycle", label: "Standard recycling" },
              { id: "general", label: "General waste" },
            ]}
            items={[
              { id: "1", label: "Old smartphone", category: "ewaste" },
              { id: "2", label: "Cardboard box", category: "recycle" },
              { id: "3", label: "Dead AA battery", category: "ewaste" },
              { id: "4", label: "Broken HDMI cable", category: "ewaste" },
              { id: "5", label: "Plastic water bottle", category: "recycle" },
              { id: "6", label: "Banana peel", category: "general" },
            ]}
          />
        </Reveal>
      </Section>

      {/* 4. RESPONSIBLE RECYCLING */}
      <Section
        id="recycling"
        code="04"
        title="Responsible Recycling"
        intro="Recycling isn't just feel-good marketing. Done properly, it recovers metals worth billions and stops fresh damage to the planet."
      >
        <Reveal>
          <Bullets items={[
            { k: "Why it matters", v: "Stops toxic materials leaking into nature and saves precious resources." },
            { k: "Recovering materials", v: "Gold, copper, aluminium and rare earths can be re-used in new devices." },
            { k: "Reducing pollution", v: "Less landfill waste, less burning, less water contamination." },
            { k: "Reducing mining", v: "Recycled metal = less new mining = healthier ecosystems." },
            { k: "Protecting environment", v: "Closes the loop instead of taking-making-throwing." },
          ]}/>
        </Reveal>
        <Reveal>
          <TrueFalse
            statement="Recycled materials from old devices can be used to make new electronics."
            answer={true}
            why="Yes — gold, copper, aluminium and rare earths recovered from e-waste are commonly re-used."
          />
        </Reveal>
      </Section>

      {/* 5. SHORT REPLACEMENT CYCLE */}
      <Section
        id="cycle"
        code="05"
        title="Short Replacement Cycle"
        intro="People upgrade phones every 1–2 years. That's not an accident — it's engineered. Step through the timeline to see how."
      >
        <Reveal><ReplacementTimeline /></Reveal>
        <Reveal>
          <Bullets items={[
            { k: "Planned obsolescence", v: "Designing products to fail or feel slow after a set time." },
            { k: "Advertising influence", v: "Marketing makes the latest model feel essential." },
            { k: "Software slowing old devices", v: "Updates can use more resources than older hardware can handle." },
            { k: "Manufacturer pressure", v: "Trade-ins, contracts and 'upgrade events' nudge people to buy more." },
          ]}/>
        </Reveal>
      </Section>

      {/* 6. CONSEQUENCES */}
      <Section
        id="consequences"
        code="06"
        title="Consequences of Short Replacement Cycle"
        intro="Quick upgrades feel harmless on the surface. Multiply that by billions of users and the impact stacks fast."
      >
        <Reveal>
          <Bullets items={[
            { k: "More e-waste", v: "Tonnes of working-but-discarded devices added to landfills every day." },
            { k: "More pollution", v: "More factories running, more shipping emissions, more chemical waste." },
            { k: "More mining", v: "Demand for fresh metals rises — habitats and communities pay the price." },
            { k: "Wasted resources", v: "Materials with years of life left get binned." },
            { k: "Increased manufacturing", v: "Factories scale up, burning more fossil-fuel electricity." },
            { k: "Responsible ownership", v: "Repair, resell, and pass-on culture reduces the damage." },
          ]}/>
        </Reveal>
        <Reveal>
          <MCQuiz items={[
            { q: "Which of these is NOT a direct consequence of short replacement cycles?",
              options: ["More e-waste", "More mining", "More biodiversity", "More CO₂ emissions"],
              answer: 2,
              why: "Mining and waste actively REDUCE biodiversity, they don't increase it." },
          ]}/>
        </Reveal>
      </Section>

      {/* 7. WAYS TO REDUCE ENERGY */}
      <Section
        id="reduce"
        code="07"
        title="Ways to Reduce Energy Consumption"
        intro="Spot the bad habits in this room. Small clicks → real watts saved. (Hover the blinking nodes.)"
      >
        <Reveal><SpotTheProblem /></Reveal>
        <Reveal>
          <Bullets items={[
            { k: "Sleep mode", v: "Suspends most components when you're not using the device." },
            { k: "Power saving settings", v: "Caps performance and dims the screen — big battery wins." },
            { k: "Shutting devices down", v: "Off is always cheaper than standby for long periods." },
            { k: "Reducing brightness", v: "Screens are one of the biggest power draws on a device." },
            { k: "Efficient usage habits", v: "Close unused apps, batch tasks, avoid unnecessary streaming." },
            { k: "Unplugging unused devices", v: "Chargers still draw 'phantom' power even when nothing is plugged in." },
          ]}/>
        </Reveal>
      </Section>

      {/* 8. POSITIVE IMPACT */}
      <Section
        id="positive"
        code="08"
        title="Positive Impact of Technology"
        intro="It's not all doom. The same tech that drains the grid can also help save it."
      >
        <Reveal>
          <Bullets items={[
            { k: "Smart systems", v: "Smart thermostats, lights and meters cut household energy waste." },
            { k: "Renewable energy systems", v: "Software optimises wind, solar and battery output in real time." },
            { k: "Environmental monitoring", v: "Satellites + sensors track deforestation, pollution and wildlife." },
            { k: "Reduced travel", v: "Video calls replace flights and commutes — fewer emissions." },
            { k: "Digital documents", v: "Less paper, less printing, less ink, fewer trees felled." },
          ]}/>
        </Reveal>
        <Reveal>
          <MCQuiz items={[
            { q: "Which is a POSITIVE environmental impact of technology?",
              options: ["Increased mining", "Smart grids optimising renewable energy", "More e-waste", "Faster battery degradation"],
              answer: 1,
              why: "Smart grids balance supply/demand and maximise clean-energy use." },
          ]}/>
        </Reveal>
      </Section>

      {/* FLASHCARDS */}
      <section className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Reveal>
            <div className="mb-4 flex items-center gap-3 text-xs text-primary">
              <span className="border border-primary px-2 py-0.5 glow-border">REVISION_DECK</span>
              <span className="h-px flex-1 bg-border" />
              <span className="text-muted-foreground">/env/cards.dat</span>
            </div>
            <Flashcards cards={[
              { front: "E-waste", back: "Discarded electronic devices. >60Mt produced globally per year — most not recycled." },
              { front: "Planned obsolescence", back: "Designing products with an artificially limited life so customers replace them sooner." },
              { front: "Why are data centers energy-hungry?", back: "Servers run 24/7 and need constant cooling to stop overheating." },
              { front: "Rare earth metals", back: "Finite metals (e.g. neodymium, cobalt) used in electronics. Mining is environmentally destructive." },
              { front: "Phantom power", back: "Energy still drawn by chargers/devices even when nothing is being charged." },
              { front: "Responsible recycling — 3 benefits", back: "Recovers materials, reduces mining, prevents toxic pollution." },
              { front: "Why does software cause replacement?", back: "Updates often need more resources than older hardware can provide, making old devices feel slow." },
              { front: "Positive tech for environment", back: "Smart grids, renewable optimisation, environmental monitoring, video calls cutting travel." },
            ]}/>
          </Reveal>
        </div>
      </section>
    </>
  );
}
