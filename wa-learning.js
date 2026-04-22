// ============================================================
// LITHALA LMS — WhatsApp Learning Engine
// Full course content for the in-app WA demo iframe
// All 6 WhatsApp-enabled courses with modules + assessments
// ============================================================

const WA_COURSES = {

  // ── CONFINED SPACE ENTRY ──────────────────────────────────
  CS001: {
    id: 'CS001', num: '1',
    title: 'Confined Space Entry',
    icon: '🔵',
    modules: [
      {
        id: 1, title: 'What is a Confined Space?',
        content: [
          '📖 *Module 1: What is a Confined Space?*\n\nA confined space is any space that:\n\n✅ Is large enough for a worker to enter\n✅ Has limited or restricted entry/exit\n✅ Is NOT designed for continuous occupancy\n\n*Examples:* tanks, vessels, silos, manholes, tunnels, pits, pipelines and open-topped vats.',
          '⚠️ *Key Fact:*\n\nA space can be a confined space even if it has no roof — an open-topped tank or trench may qualify.\n\n*Permit-Required Confined Space* = a confined space with one or more serious hazards: atmospheric, engulfment, internal configuration or any other recognised safety hazard.',
        ],
        quiz: {
          q: 'Which of these is a confined space?',
          opts: ['A large open warehouse', 'An underground manhole with limited entry', 'A fenced parking area', 'A rooftop work area'],
          ans: 1,
          explanation: '✅ *Correct!* An underground manhole with limited entry/exit that is not designed for continuous occupancy is a classic confined space.',
        },
      },
      {
        id: 2, title: 'Atmospheric Hazards',
        content: [
          '💨 *Module 2: Atmospheric Hazards*\n\nThe biggest killers in confined spaces are invisible:\n\n🔴 *Oxygen Deficiency* — below 19.5%\nCauses unconsciousness in seconds\n\n🔴 *Oxygen Enrichment* — above 23.5%\nDramatically increases fire/explosion risk\n\n🔴 *Flammable Gases* — methane, propane, H₂S\nOne spark = explosion\n\n🔴 *Toxic Gases* — CO, H₂S, SO₂, HCN\nH₂S smells like rotten eggs but numbs your sense of smell!',
          '📊 *Safe Atmospheric Limits:*\n\n| Hazard | Safe Level |\n|--------|------------|\n| Oxygen | 19.5–23.5% |\n| Flammables | Below 10% LEL |\n| CO | Below 25 ppm |\n| H₂S | Below 1 ppm |\n\n⚠️ *ALWAYS test before entry. Test continuously during work.*\n\nNEVER rely on your sense of smell — H₂S and CO are odourless at dangerous concentrations.',
        ],
        quiz: {
          q: 'What oxygen level is considered safe for confined space entry?',
          opts: ['Below 16%', '16–19%', '19.5–23.5%', 'Above 25%'],
          ans: 2,
          explanation: '✅ *Correct!* The safe oxygen range is 19.5–23.5%. Below 19.5% is oxygen deficiency; above 23.5% increases fire/explosion risk dramatically.',
        },
      },
      {
        id: 3, title: 'Entry Permits',
        content: [
          '📋 *Module 3: Confined Space Entry Permits*\n\nA confined space entry permit is a formal document that:\n\n✅ Authorises specific people to enter\n✅ Documents all hazards identified\n✅ Lists all precautions taken\n✅ Specifies the entry period\n✅ Identifies the authorised entrant(s) and attendant\n\nThe permit must be displayed at the entry point.',
          '👥 *The Three Roles:*\n\n🔑 *Authorised Entrant*\nThe person entering the confined space. Must understand hazards and emergency procedures.\n\n👁️ *Attendant*\nStays OUTSIDE. Monitors entrant continuously. Never enters to rescue.\n\n📋 *Entry Supervisor*\nIssues and cancels the permit. Verifies conditions before signing.',
        ],
        quiz: {
          q: 'What must the confined space attendant do?',
          opts: ['Enter the space to check on the entrant', 'Remain outside and monitor continuously', 'Sign the permit and leave', 'Only be present at entry and exit'],
          ans: 1,
          explanation: '✅ *Correct!* The attendant MUST remain outside at all times and monitor the entrant continuously. Over 60% of confined space deaths involve rescuers who entered without proper equipment.',
        },
      },
      {
        id: 4, title: 'Rescue Procedures',
        content: [
          '🚨 *Module 4: Rescue Procedures*\n\n⚠️ *NEVER enter a confined space to rescue without proper equipment and training.*\n\n*Non-Entry Rescue First:*\nUse a retrieval system (tripod, winch, lifeline) to pull the entrant out without anyone entering.\n\n*If non-entry rescue fails:*\n• Call emergency services immediately\n• Only trained rescue personnel with proper equipment may enter\n• Ensure adequate atmospheric conditions for rescuers',
          '🛠️ *Rescue Equipment Required:*\n\n• Retrieval line (lifeline) attached to entrant at all times\n• Tripod/davit arm over the entry point\n• Mechanical winch for lifting\n• Communication device (radio/voice)\n• Fully charged gas detector for rescuers\n• SCBA (Self-Contained Breathing Apparatus) if atmosphere unknown\n\n📞 *Emergency Number: 10111 (Police) or 10177 (Ambulance)*',
        ],
        quiz: {
          q: 'What is non-entry rescue?',
          opts: ['Calling emergency services and waiting', 'Rescuing a person without the rescuer entering the space', 'A last resort when all else fails', 'Entering quickly and exiting fast'],
          ans: 1,
          explanation: '✅ *Correct!* Non-entry rescue uses a retrieval system (tripod + lifeline) to recover the entrant WITHOUT anyone else entering. This is always the first rescue method.',
        },
      },
      {
        id: 5, title: 'Final Assessment', isAssessment: true,
        questions: [
          { q: 'A confined space MUST have:', opts: ['A roof', 'Limited or restricted entry/exit and not designed for continuous occupancy', 'Underground location', 'Chemical hazards'], ans: 1 },
          { q: 'Before entering a confined space you must:', opts: ['Get verbal permission from supervisor', 'Test atmosphere and obtain a signed entry permit', 'Just check if it smells unusual', 'Enter quickly and check inside'], ans: 1 },
          { q: 'The attendant\'s main job is to:', opts: ['Sign the permit', 'Enter periodically to check conditions', 'Remain outside and monitor the entrant continuously', 'Test the atmosphere'], ans: 2 },
          { q: 'Oxygen enrichment above 23.5% causes:', opts: ['Asphyxiation', 'No hazard', 'Increased fire and explosion risk', 'Toxic gas buildup'], ans: 2 },
          { q: 'IDLH stands for:', opts: ['Immediately Dangerous to Life or Health', 'Initial Detection Level Hazard', 'Internal Device Lockout Hazard', 'Incident Data Log Header'], ans: 0 },
        ],
      },
    ],
  },

  // ── PERMIT TO WORK ────────────────────────────────────────
  PTW001: {
    id: 'PTW001', num: '2',
    title: 'Permit to Work (PTW)',
    icon: '📋',
    modules: [
      {
        id: 1, title: 'Introduction to PTW',
        content: [
          '📋 *Module 1: Permit to Work Systems*\n\nA Permit to Work (PTW) is a formal document that controls potentially hazardous work activities. It is NOT a risk assessment — it is a communication and control tool.\n\n*Purpose:*\n✅ Identify and manage all hazards\n✅ Ensure only authorised people do the work\n✅ Ensure all precautions are in place\n✅ Communicate clearly between shifts/teams',
          '📝 *Types of Permits at Lithala:*\n\n🔥 *Hot Work Permit* — welding, cutting, grinding\n🔵 *Confined Space Permit* — any confined space entry\n⚡ *Electrical Isolation Permit* — any electrical work\n🏗️ *Working at Heights Permit* — above 2 metres\n🧪 *Chemical Work Permit* — hazardous substances\n\nEach permit type has specific precautions and requirements.',
        ],
        quiz: {
          q: 'A Permit to Work is:',
          opts: ['A replacement for a risk assessment', 'A communication and control tool to manage hazardous work', 'A verbal instruction from a supervisor', 'A training certificate'],
          ans: 1,
          explanation: '✅ *Correct!* A PTW is a communication and control tool. It works together with risk assessments but does NOT replace them.',
        },
      },
      {
        id: 2, title: 'Legal Framework',
        content: [
          '⚖️ *Module 2: Legal Framework*\n\nPTW systems are required under:\n\n📜 *OHS Act, 1993 (Section 8)*\nEmployer must provide a working environment that is safe and without risk to health.\n\n📜 *General Safety Regulations*\nRequires written procedures for hazardous work.\n\n📜 *Construction Regulations 2014*\nMandates permits for confined space, heights and demolition work.\n\nNon-compliance: up to R50,000 fine or 1 year imprisonment.',
          '📊 *Who is Responsible?*\n\n👔 *Employer/Owner*: Ensure PTW system is implemented\n🔑 *Permit Issuer*: Trained, authorised to issue/cancel permits\n👷 *Receiver/Performer*: Understands and complies with permit\n👁️ *Safety Officer*: Audits the PTW system\n\n*Key Rule:* Only the person who issued a permit can cancel it or extend it.',
        ],
        quiz: {
          q: 'Under the OHS Act, Section 8, the employer must:',
          opts: ['Issue permits for every task', 'Provide a safe working environment without risk to health', 'Train all employees in first aid', 'Conduct risk assessments annually'],
          ans: 1,
          explanation: '✅ *Correct!* Section 8 of the OHS Act requires employers to provide and maintain a working environment that is safe and without risk to health.',
        },
      },
      {
        id: 3, title: 'Permit Procedures',
        content: [
          '✅ *Module 3: PTW Step-by-Step*\n\n*Before Work:*\n1️⃣ Identify the task and all hazards\n2️⃣ Complete risk assessment\n3️⃣ Issuer completes and signs the permit\n4️⃣ Receiver reviews, understands and signs\n5️⃣ Display permit at the work location\n6️⃣ Implement all precautions listed',
          '*During Work:*\n7️⃣ Monitor continuously\n8️⃣ Stop work if conditions change\n9️⃣ Re-issue permit if it expires\n\n*After Work:*\n🔟 Sign off work as complete\n1️⃣1️⃣ Return site to safe condition\n1️⃣2️⃣ Issuer closes/cancels the permit\n1️⃣3️⃣ File permit for record keeping\n\n⏰ *Permits are typically valid for ONE SHIFT ONLY.*',
        ],
        quiz: {
          q: 'Where must a PTW be displayed during work?',
          opts: ['In the site safety file', 'At the location where the work is being done', 'With the permit issuer', 'In the control room only'],
          ans: 1,
          explanation: '✅ *Correct!* The PTW must be displayed at the actual work location so all workers and visitors can see the conditions and authorisation.',
        },
      },
      {
        id: 4, title: 'SIMOPS',
        content: [
          '🔄 *Module 4: Simultaneous Operations (SIMOPS)*\n\nSIMOPS = two or more hazardous activities happening at the same time or in the same area.\n\n*Risks:*\n• Hot work near flammable storage\n• Lifting operations over process areas\n• Multiple isolation points affecting same equipment\n• Confined space entry near chemical dosing\n\n*Control:*\n• SIMOPS review before work starts\n• Communication between all permit holders\n• Designated SIMOPS coordinator\n• Clear exclusion zones',
          '⚠️ *SIMOPS Case Study:*\n\nA refinery had welding (hot work permit) happening 15 metres from a vessel being cleaned by a confined space crew. A flash fire occurred because the gas released from the vessel reached the welding area.\n\n*Lesson:* Always check for other active permits before starting work. SIMOPS controls could have prevented this incident.\n\n*Rule:* If in doubt, stop work and consult the permit issuer.',
        ],
        quiz: {
          q: 'Simultaneous Operations (SIMOPS) refers to:',
          opts: ['Working double shifts', 'Two or more hazardous activities in the same area at the same time', 'Using two permits for the same job', 'Operating heavy equipment simultaneously'],
          ans: 1,
          explanation: '✅ *Correct!* SIMOPS are two or more hazardous activities in the same area or time period that could interact and create additional hazards.',
        },
      },
      {
        id: 5, title: 'Final Assessment', isAssessment: true,
        questions: [
          { q: 'A PTW is primarily:', opts: ['A risk assessment tool', 'A communication and control tool for hazardous work', 'A training record', 'An insurance document'], ans: 1 },
          { q: 'Only the __ can cancel a Permit to Work:', opts: ['Permit receiver', 'Safety officer', 'Permit issuer', 'Any supervisor'], ans: 2 },
          { q: 'PTW must be displayed:', opts: ['In the site office', 'At the location where work is done', 'With HR records', 'On the safety noticeboard'], ans: 1 },
          { q: 'A hot work permit is required for:', opts: ['Any outdoor work', 'Welding, cutting and grinding activities', 'Working in hot weather', 'Cooking on site'], ans: 1 },
          { q: 'Permits are typically valid for:', opts: ['One week', 'One month', 'One shift only', 'The duration of the project'], ans: 2 },
        ],
      },
    ],
  },

  // ── WORKING AT HEIGHTS ────────────────────────────────────
  WAH001: {
    id: 'WAH001', num: '3',
    title: 'Working at Heights',
    icon: '🏗️',
    modules: [
      {
        id: 1, title: 'Fall Hazards',
        content: [
          '🏗️ *Module 1: Fall Hazards & Statistics*\n\nFalls from height are the *#1 cause of fatal injuries* in the South African construction industry.\n\n📊 *By the numbers:*\n• Falls account for 38% of all construction fatalities\n• Most falls happen from ladders, scaffolding and roofs\n• 2 metres is the legal height trigger for fall protection in SA\n\n*Construction Regulations 2014* require a written Fall Protection Plan before any work at heights.',
          '⚠️ *Common Fall Hazards:*\n\n🪜 Unsafe ladders — too steep, damaged, wrong type\n🏗️ Unprotected edges — roof edges, floor openings\n🧱 Scaffolding collapses — overloaded, not inspected\n☁️ Weather conditions — wet surfaces, wind\n👟 Unsuitable footwear — no grip, slippery soles\n😴 Fatigue — working too long without breaks\n\n*First step:* Eliminate the need to work at height if possible.',
        ],
        quiz: {
          q: 'At what height does fall protection become legally required in South Africa?',
          opts: ['1 metre', '2 metres', '3 metres', '5 metres'],
          ans: 1,
          explanation: '✅ *Correct!* The Construction Regulations 2014 require fall protection for any work at 2 metres or more above a lower level.',
        },
      },
      {
        id: 2, title: 'Fall Protection Hierarchy',
        content: [
          '🛡️ *Module 2: Hierarchy of Fall Protection*\n\nAlways apply in this order:\n\n1️⃣ *ELIMINATION* — redesign the work to be done at ground level\n\n2️⃣ *PASSIVE PROTECTION* — barriers, guardrails, covers over openings (no reliance on behaviour)\n\n3️⃣ *FALL RESTRAINT* — prevents worker from reaching the fall edge (short lanyard)\n\n4️⃣ *FALL ARREST* — allows a fall but arrests it before injury (full harness + shock absorber)',
          '5️⃣ *ADMINISTRATIVE CONTROLS* — procedures, supervision, training, permits\n\n6️⃣ *PPE* — hard hats, safety shoes (last resort)\n\n⚠️ *Harnesses are LAST RESORT*\nA harness does not prevent a fall — it arrests it after the fact. Passive protection (guardrails) is always preferred.\n\n📏 *Free Fall Distance:*\nKeep free fall to maximum 600mm with a work positioning system and maximum 4m with a fall arrest system.',
        ],
        quiz: {
          q: 'What is the HIGHEST level of fall protection in the hierarchy?',
          opts: ['Personal Protective Equipment', 'Fall arrest harness', 'Elimination of the need to work at height', 'Guardrails and barriers'],
          ans: 2,
          explanation: '✅ *Correct!* Elimination — redesigning the work so it can be done at ground level — is always the highest and most preferred level of control.',
        },
      },
      {
        id: 3, title: 'Equipment Inspection',
        content: [
          '🔍 *Module 3: Harness & Equipment Inspection*\n\n*Inspect BEFORE EVERY USE:*\n\n✅ Web straps — cuts, tears, abrasion, discolouration\n✅ Stitching — broken or loose stitches\n✅ Hardware — buckles, D-rings, snap hooks — corrosion, cracks, working properly\n✅ Labels — must be legible; check manufacture date\n✅ Lanyards/shock absorbers — no deployment of shock absorber\n✅ Connectors — gates open and lock properly',
          '❌ *Remove from service immediately if:*\n\n• Any signs of cut, abrasion or deterioration\n• Snap hook gate does not lock\n• Shock absorber has deployed (expanded)\n• Equipment has sustained a fall arrest load\n• Equipment is more than 10 years old\n• Labels are missing\n• Subject was involved in a fall — even if no visible damage\n\n📦 *Storage:* Cool, dry, away from UV, chemicals and sharp objects.',
        ],
        quiz: {
          q: 'How often must a fall arrest harness be inspected?',
          opts: ['Monthly', 'Annually', 'Before every use', 'Only when it looks damaged'],
          ans: 2,
          explanation: '✅ *Correct!* A harness must be inspected before EVERY use by the wearer, plus a formal inspection by a competent person every 6–12 months.',
        },
      },
      {
        id: 4, title: 'Fall Protection Plan',
        content: [
          '📄 *Module 4: Fall Protection Plan Requirements*\n\nThe Construction Regulations 2014 require a *written Fall Protection Plan* before work at height begins.\n\n*It must include:*\n• Risk assessment identifying all fall hazards\n• Specific fall protection measures for each hazard\n• Equipment to be used and inspection records\n• Training records of workers\n• Rescue plan in case of a suspended worker\n• Supervision arrangements',
          '🚨 *Suspension Trauma:*\n\nIf a worker is suspended in a harness after a fall, *suspension trauma* can occur within 3–30 minutes — even if not injured in the fall.\n\n*Signs:* Fainting, nausea, numbness, breathing difficulty\n\n*Response:*\n1. Rescue worker within 30 minutes\n2. Do NOT lay them flat immediately\n3. Keep in upright or W-position first\n4. Call emergency services immediately',
        ],
        quiz: {
          q: 'Suspension trauma can occur when:',
          opts: ['Working in hot weather', 'A worker is left suspended in a harness after a fall arrest', 'Working on scaffolding', 'Climbing a ladder too quickly'],
          ans: 1,
          explanation: '✅ *Correct!* Suspension trauma (harness hang syndrome) can occur within minutes of a worker being suspended motionless in a harness. Rescue within 30 minutes is critical.',
        },
      },
      {
        id: 5, title: 'Final Assessment', isAssessment: true,
        questions: [
          { q: 'Fall protection is legally required in SA at heights of:', opts: ['1 metre', '2 metres', '3 metres', '5 metres'], ans: 1 },
          { q: 'The highest level of fall protection hierarchy is:', opts: ['PPE/Harness', 'Guardrails', 'Elimination of working at height', 'Administrative controls'], ans: 2 },
          { q: 'A harness must be inspected:', opts: ['Monthly', 'After a fall only', 'Before every use', 'Annually only'], ans: 2 },
          { q: 'Suspension trauma can cause serious harm within:', opts: ['24 hours', '2–3 hours', '3–30 minutes', '1 hour'], ans: 2 },
          { q: 'A Fall Protection Plan must be prepared by:', opts: ['Any worker', 'A competent person', 'The site foreman', 'HR department'], ans: 1 },
        ],
      },
    ],
  },

  // ── HOT WORK ──────────────────────────────────────────────
  HW001: {
    id: 'HW001', num: '4',
    title: 'Hot Work Safety',
    icon: '🔥',
    modules: [
      {
        id: 1, title: 'Hot Work Hazards',
        content: [
          '🔥 *Module 1: Hot Work Hazards*\n\nHot work = any work that produces heat, sparks, flame or slag that could ignite flammable/combustible materials.\n\n*Includes:*\n⚡ Welding (arc, MIG, TIG)\n✂️ Cutting (plasma, oxy-acetylene)\n🔧 Grinding and disc cutting\n🔩 Soldering and brazing\n🔥 Open flame tools and heat guns\n\n*Does NOT include:* work in designated welding areas with proper suppression systems.',
          '💥 *Key Hazards:*\n\n🔴 *Fire* — sparks travel up to 10 metres and stay hot for 30+ minutes\n🔴 *Explosion* — flammable gases or vapours in the area\n🔴 *UV Radiation* — arc eye, skin burns from welding arc\n🔴 *Fumes* — manganese, chromium, zinc fumes from welding\n🔴 *Electrical* — arc flash, electrocution from welding equipment\n\n⚠️ *Hot work accounts for 25% of all industrial fires in SA.*',
        ],
        quiz: {
          q: 'Hot work is defined as any work that:',
          opts: ['Is done in summer heat', 'Produces heat, sparks or open flame', 'Involves hot liquids', 'Requires working near boilers'],
          ans: 1,
          explanation: '✅ *Correct!* Hot work is any activity that produces heat, sparks or open flames — welding, cutting, grinding, soldering.',
        },
      },
      {
        id: 2, title: 'Area Preparation',
        content: [
          '🛠️ *Module 2: Area Preparation*\n\nBefore any hot work starts:\n\n1️⃣ Remove all flammable/combustible materials within 10 metres\n2️⃣ If materials cannot be removed, use fire blankets to cover them\n3️⃣ Wet down combustible floors and walls near the work area\n4️⃣ Cover floor openings and drains with non-combustible covers\n5️⃣ Purge all flammable gases and vapours\n6️⃣ Gas test the atmosphere',
          '🧯 *Fire Fighting Equipment:*\n\n• Minimum 1x 9kg DCP fire extinguisher at point of work\n• Fire hose reel accessible and tested\n• Fire blanket for smothering small fires\n\n*PPE for Hot Work:*\n\n🥽 Welding shield/goggles — correct shade lens\n🧤 Welding gloves — leather, long-cuffed\n👕 Fire-resistant overalls — no synthetic materials\n👞 Safety boots — leather, not rubber\n\n*Never wear nylon or polyester near hot work!*',
        ],
        quiz: {
          q: 'Combustible materials near hot work must be removed to at least:',
          opts: ['2 metres', '5 metres', '10 metres', 'Out of sight'],
          ans: 2,
          explanation: '✅ *Correct!* Combustible materials must be removed to at least 10 metres from hot work. Sparks can travel up to 10 metres and remain ignition sources.',
        },
      },
      {
        id: 3, title: 'Fire Watch',
        content: [
          '👁️ *Module 3: Fire Watch Requirements*\n\nA fire watch is MANDATORY during all hot work and for at least 30 minutes AFTER hot work is complete.\n\n*Fire Watch Responsibilities:*\n✅ Station themselves with clear view of all spark areas\n✅ Have fire extinguisher ready and know how to use it\n✅ Watch for smouldering materials\n✅ Check hidden areas (voids, behind panels)\n✅ Never leave the area during fire watch period',
          '⏰ *After Hot Work:*\n\nSparks and hot materials continue to be ignition sources long after work stops.\n\n• 30-minute fire watch minimum AFTER work completion\n• Check in areas BELOW the work (sparks fall)\n• Check areas ABOVE the work (heat rises)\n• Check hollow walls and floor voids\n• Final area check before leaving\n\n⚠️ *Most hot work fires start 30–60 minutes after work completes.*\n\nRecord the fire watch in the hot work permit.',
        ],
        quiz: {
          q: 'How long must fire watch continue after hot work is complete?',
          opts: ['5 minutes', '15 minutes', '30 minutes minimum', 'Until the next day'],
          ans: 2,
          explanation: '✅ *Correct!* Fire watch must continue for at least 30 minutes after hot work is complete. Most hot work fires actually start 30–60 minutes AFTER work stops.',
        },
      },
      {
        id: 4, title: 'Final Assessment', isAssessment: true,
        questions: [
          { q: 'Hot work includes:', opts: ['Working in the sun', 'Welding, cutting and grinding', 'Using a hot water kettle', 'Working near a heater'], ans: 1 },
          { q: 'Materials must be removed to at least __ from hot work:', opts: ['2m', '5m', '10m', '15m'], ans: 2 },
          { q: 'Fire watch must continue for __ after hot work:', opts: ['5 min', '15 min', '30 min minimum', '2 hours'], ans: 2 },
          { q: 'A hot work permit is valid for:', opts: ['The project duration', 'One week', 'One shift only', 'One month'], ans: 2 },
          { q: 'Which PPE must NOT be worn near hot work?', opts: ['Leather gloves', 'Welding shield', 'Nylon or polyester clothing', 'Safety boots'], ans: 2 },
        ],
      },
    ],
  },

  // ── LOTO ──────────────────────────────────────────────────
  LOTO001: {
    id: 'LOTO001', num: '5',
    title: 'Lock Out Tag Out (LOTO)',
    icon: '⚡',
    modules: [
      {
        id: 1, title: 'Hazardous Energy Types',
        content: [
          '⚡ *Module 1: Hazardous Energy Types*\n\nLOTO controls ALL forms of hazardous energy:\n\n⚡ *Electrical* — most common; shock, arc flash, burns\n🔧 *Mechanical* — rotating machinery, springs under tension\n💧 *Hydraulic* — pressurised fluids; sudden movement\n🌬️ *Pneumatic* — compressed air; stored pressure\n🌡️ *Thermal* — steam, hot fluids, hot surfaces\n⚗️ *Chemical* — pressurised chemicals, reactive substances\n☢️ *Gravity* — elevated equipment that can fall',
          '💀 *Why LOTO Matters:*\n\nIn South Africa, maintenance workers are seriously injured or killed every year when equipment unexpectedly energises during maintenance.\n\n*Common scenarios:*\n• Machine restarts while being cleaned\n• Valve opens unexpectedly releasing pressurised fluid\n• Gravity causes suspended load to drop\n• Stored electrical charge discharges\n\n⚠️ *LOTO is legally required under OHS Act General Machine Regulations.*',
        ],
        quiz: {
          q: 'Which of these is a form of hazardous energy controlled by LOTO?',
          opts: ['Sound energy', 'Solar energy', 'Stored hydraulic pressure', 'Radio waves'],
          ans: 2,
          explanation: '✅ *Correct!* Stored hydraulic pressure is a form of hazardous energy. When released unexpectedly during maintenance, it can cause severe injury or death.',
        },
      },
      {
        id: 2, title: 'The 6-Step LOTO Procedure',
        content: [
          '🔒 *Module 2: The 6-Step LOTO Procedure*\n\n*Step 1: NOTIFY*\nInform all affected employees that equipment will be shut down.\n\n*Step 2: IDENTIFY*\nLocate ALL energy sources (there may be more than one!).\n\n*Step 3: ISOLATE*\nShut down equipment using proper isolation points.',
          '*Step 4: LOCK OUT / TAG OUT*\nApply your personal lock and danger tag to EVERY isolation point.\n\n*Step 5: RELEASE STORED ENERGY*\n• Bleed hydraulic/pneumatic pressure\n• Discharge electrical capacitors\n• Block suspended parts\n• Allow equipment to cool\n\n*Step 6: VERIFY ZERO ENERGY*\n⚠️ Try to START the equipment — if it doesn\'t start, the lockout is effective.\n\nTest ALL isolation points before beginning work.',
        ],
        quiz: {
          q: 'Step 6 of the LOTO procedure — verifying zero energy — means:',
          opts: ['Trusting your lock is in place', 'Attempting to restart the equipment to confirm it will not start', 'Checking the energy meter from the office', 'Asking a colleague to confirm'],
          ans: 1,
          explanation: '✅ *Correct!* You must ATTEMPT TO START the equipment (press the start button) to verify it is truly de-energised. Never assume — always verify.',
        },
      },
      {
        id: 3, title: 'Group Lockout',
        content: [
          '👥 *Module 3: Group Lockout Procedures*\n\nWhen multiple workers are doing maintenance on the same equipment, group lockout is required.\n\n*Group LOTO Steps:*\n1️⃣ Primary person applies the isolation lock\n2️⃣ A hasp (multi-lock device) is placed on the isolation point\n3️⃣ *EACH WORKER applies their own personal lock*\n4️⃣ Work begins\n5️⃣ Each worker removes only their own lock when finished\n6️⃣ Primary lock is removed last when all workers are clear',
          '🔑 *Key Rules:*\n\n✅ ONE lock per worker — your personal lock, your personal key\n✅ Never share a lock with another worker\n✅ Never remove another worker\'s lock\n✅ If a worker leaves and forgets their lock, follow the "forgotten lock" procedure (supervisor authorisation required)\n✅ Each worker controls their own safety\n\n⚠️ *Tagout alone is NOT sufficient*\nA tag can be removed by anyone. If equipment CAN be locked, it MUST be locked.',
        ],
        quiz: {
          q: 'In group LOTO, each worker must:',
          opts: ['Share one communal lock', 'Apply their own personal lock to the hasp', 'Sign the logbook and trust the primary lockout', 'Only apply a danger tag'],
          ans: 1,
          explanation: '✅ *Correct!* In group LOTO, every individual worker applies their own personal lock. This way each worker controls their own safety — no one can restart the equipment until ALL locks are removed.',
        },
      },
      {
        id: 4, title: 'Final Assessment', isAssessment: true,
        questions: [
          { q: 'LOTO stands for:', opts: ['Lock Out Time Out', 'Lockout Tagout', 'Level Out Take Over', 'Log Out Tag Only'], ans: 1 },
          { q: 'The 6th step of LOTO is:', opts: ['Apply the lock', 'Notify employees', 'Verify zero energy state', 'Release stored energy'], ans: 2 },
          { q: 'In group lockout, each worker:', opts: ['Shares one lock', 'Applies their own personal lock', 'Only signs the logbook', 'Trusts the primary worker'], ans: 1 },
          { q: 'A tagout alone (without lockout) is acceptable when:', opts: ['It is quicker', 'Equipment cannot physically be locked out', 'The lock is lost', 'Preferred by the worker'], ans: 1 },
          { q: 'Stored energy must be released BEFORE work starts. This includes:', opts: ['Only electrical energy', 'Only pressure', 'All forms — hydraulic pressure, electrical charge, gravity, thermal', 'Only what is visible'], ans: 2 },
        ],
      },
    ],
  },

  // ── RISK ASSESSMENT ───────────────────────────────────────
  RA001: {
    id: 'RA001', num: '6',
    title: 'Risk Assessment',
    icon: '🎓',
    modules: [
      {
        id: 1, title: 'Risk Assessment Fundamentals',
        content: [
          '🎓 *Module 1: Risk Assessment Fundamentals*\n\n*Key Definitions:*\n\n⚠️ *Hazard* — anything with potential to cause harm\n(e.g. a chemical, a height, a moving machine)\n\n📊 *Risk* — the likelihood that harm will actually occur × severity of that harm\n\n📋 *Risk Assessment* — the systematic process of identifying hazards, evaluating risks and deciding on control measures\n\n*Risk = Likelihood × Severity*',
          '📊 *Risk Rating Matrix:*\n\n| Severity → | Low | Medium | High |\n|Likelihood ↓|     |        |      |\n| Low        |  1  |   2    |  3   |\n| Medium     |  2  |   4    |  6   |\n| High       |  3  |   6    |  9   |\n\n🟢 1–2 = Low Risk — acceptable, review periodically\n🟡 3–4 = Medium Risk — control measures required\n🔴 6–9 = High Risk — STOP work, immediate action required\n\nThis matrix guides your control decisions.',
        ],
        quiz: {
          q: 'Risk is defined as:',
          opts: ['Any dangerous activity', 'Likelihood of harm multiplied by the severity of that harm', 'A hazard that has already caused injury', 'A near-miss incident'],
          ans: 1,
          explanation: '✅ *Correct!* Risk = Likelihood × Severity. A hazard with very low likelihood of causing harm or very low severity has lower risk than one with high likelihood and high severity.',
        },
      },
      {
        id: 2, title: 'Hierarchy of Controls',
        content: [
          '🛡️ *Module 2: Hierarchy of Controls*\n\nAlways apply controls in this order — highest to lowest effectiveness:\n\n1️⃣ *ELIMINATION* — remove the hazard entirely\nMost effective. Example: automate a task to remove manual handling.\n\n2️⃣ *SUBSTITUTION* — replace with something less hazardous\nExample: use a water-based paint instead of solvent-based.\n\n3️⃣ *ENGINEERING CONTROLS* — physical barriers, guards\nExample: machine guard, local exhaust ventilation.',
          '4️⃣ *ADMINISTRATIVE CONTROLS* — procedures, training, supervision\nExample: PTW system, training, job rotation.\n\n5️⃣ *PPE* — last resort only\nExample: hard hat, gloves, respirator.\n\n⚠️ *PPE is the LEAST effective control.*\nIt does not reduce the hazard — it only protects the person wearing it if it works correctly.\n\n*The hierarchy is not "choose one" — often multiple levels are needed together.*',
        ],
        quiz: {
          q: 'The most effective control in the hierarchy is:',
          opts: ['PPE (hard hat, gloves)', 'Administrative controls (procedures)', 'Engineering controls (guards)', 'Elimination of the hazard'],
          ans: 3,
          explanation: '✅ *Correct!* Elimination — removing the hazard entirely — is always the most effective control. PPE is the LEAST effective because it relies on the equipment working and the person using it correctly.',
        },
      },
      {
        id: 3, title: 'Types of Risk Assessment',
        content: [
          '📋 *Module 3: Types of Risk Assessment*\n\n*1. Baseline Risk Assessment (BRA)*\nA comprehensive assessment of all hazards in the workplace. Done before work starts and when significant changes occur. Required by OHS Act.\n\n*2. Issue-Based Risk Assessment (IBRA)*\nDone when a specific new hazard or situation arises — e.g. a new chemical, a new machine, after an incident.\n\n*3. Continuous/Task Risk Assessment*\nDone by workers before each task. Sometimes called a Job Safety Analysis (JSA) or Daily Risk Assessment (DRA). Takes 5–10 minutes.',
          '📜 *Legal Requirements:*\n\nOHS Act Section 8(2)(d) — employer must identify hazards and evaluate risks.\n\nGeneral Safety Regulations — require documented risk assessments.\n\nISO 45001:2018 Clause 6.1 — risk assessment and planning for opportunities.\n\n*Who does it:*\n• Must be done by a *competent person*\n• Workers must be involved and consulted\n• Results must be communicated to all affected employees\n• Must be reviewed when conditions change or after incidents',
        ],
        quiz: {
          q: 'Under the OHS Act, a baseline risk assessment must be done:',
          opts: ['Only after an incident occurs', 'Before work begins and when significant changes occur', 'Every 5 years regardless of changes', 'Only by external consultants'],
          ans: 1,
          explanation: '✅ *Correct!* A baseline risk assessment must be done BEFORE work begins and reviewed whenever significant changes occur — new equipment, new processes, new chemicals, or after any serious incident.',
        },
      },
      {
        id: 4, title: 'Final Assessment', isAssessment: true,
        questions: [
          { q: 'Risk = :', opts: ['Hazard × Number of workers', 'Likelihood × Severity', 'Number of incidents × Cost', 'Severity only'], ans: 1 },
          { q: 'The MOST effective control in the hierarchy:', opts: ['PPE', 'Administrative controls', 'Elimination of the hazard', 'Engineering controls'], ans: 2 },
          { q: 'PPE is the __ effective control:', opts: ['Most', 'Second most', 'Least', 'Equally'], ans: 2 },
          { q: 'HIRA stands for:', opts: ['Health Inspection and Risk Analysis', 'Hazard Identification and Risk Assessment', 'High Impact Risk Activity', 'Hazard Investigation Report Action'], ans: 1 },
          { q: 'Risk assessments must be reviewed:', opts: ['Never once done', 'Every 5 years regardless', 'When significant changes occur or after incidents', 'Monthly'], ans: 2 },
        ],
      },
    ],
  },
};
