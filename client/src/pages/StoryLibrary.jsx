import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { getUser, getToken } from '../utils/authStorage'

export const STORY_COVERS = {
  "the brave little rabbit": "/images/stories/brave_rabbit.jpg",
  "the golden lantern": "/images/stories/golden_lantern.jpg",
  "midnight at blackwood manor": "/images/stories/blackwood_manor.jpg",
  "echoes of the quantum void": "/images/stories/quantum_void.jpg",
  "stars of the deep ocean": "/images/stories/deep_ocean.jpg",
  "oliver the owl's midnight school": "/images/stories/owl_school.jpg"
};

export const getStoryCover = (story) => {
  if (story?.coverImage) return story.coverImage;
  const key = story?.title?.toLowerCase()?.trim() || '';
  if (STORY_COVERS[key]) return STORY_COVERS[key];
  if (story?.audience === 'Kids' || story?.ageGroup === 'children' || story?.ageGroup === 'kids' || story?.genre === 'Fairy Tale' || story?.genre === 'Moral Story') {
    return "/images/stories/brave_rabbit.jpg";
  }
  return "/images/stories/quantum_void.jpg";
};

export const LIBRARY_STORIES = [
  {
    id: 1,
    title: "The Brave Little Rabbit",
    author: "AnimVerse Team",
    audience: "Kids",
    genre: "Fairy Tale",
    ageGroup: "Children",
    icon: "🐇",
    color: "#FFD60A",
    coverImage: "/images/stories/brave_rabbit.jpg",
    desc: "A tiny rabbit named Barnaby discovers courage when Whispering Woods is threatened by Pyrrhus the dragon.",
    readTime: "12 min",
    rating: 4.9,
    pages: [
      {
        chapter: "Chapter 1",
        title: "The Whispering Woods",
        content: [
          "Deep in the emerald embrace of Whispering Woods lived Barnaby, a tiny rabbit with soft silver fur and ears that twitched at the gentlest sigh of the breeze. While other wild hares boasted of their sprinting speed and leaped over fallen birch logs, Barnaby preferred quiet afternoons studying the moss and collecting sweet clover berries.",
          "Every morning, Barnaby would visit the Great Oak Tree at the heart of the meadow. The tree had stood for a thousand summers, its roots humming with ancient forest magic that kept the streams crystal-clear and the flowers ever-blooming."
        ]
      },
      {
        chapter: "Chapter 2",
        title: "A Shadow Over the Canopy",
        content: [
          "One sunlit afternoon, the cheerful bird songs abruptly ceased. A colossal shadow swept across the meadow, turning the golden sunlight into an eerie amber haze. Pyrrhus, a mighty dragon with scales like polished obsidian and eyes burning like embers, descended from the stormy Obsidian Peaks.",
          "Pyrrhus landed with a thundering crash upon the rocky ridge above the Great Oak. His smoky breath billowed into the air. 'Creatures of Whispering Woods!' roared the dragon with a raspy cough. 'Bring me all your glowing moonlight mushrooms before the stars rise, or my fire shall scorch these meadows to black ash!'"
        ]
      },
      {
        chapter: "Chapter 3",
        title: "The Grandmother's Ancient Riddle",
        content: [
          "Panic gripped the forest animals. The squirrels hid inside hollow acorns, the badgers barricaded their burrows, and the deer prepared to flee across the river. But Barnaby sat quietly beneath a cluster of silver ferns, remembering the bedtime tales told by his wise grandmother.",
          "'A dragon's flame burns hot and bright,' she had once whispered by firelight, 'but dewdrop nectar quenches fire with gentle light.' Barnaby looked up at the fiery monster and noticed something unusual: Pyrrhus was wheezing, his throat glowing a painful, inflamed red rather than a triumphant flame."
        ]
      },
      {
        chapter: "Chapter 4",
        title: "The Ascent to Obsidian Peaks",
        content: [
          "Instead of packing his things to run, Barnaby gathered his prized hollow acorn canteen. He bounded across the dew-kissed heather meadows at twilight, delicately collecting the pure, glistening nectar drops that formed upon the petals of the sacred Star-Lilies.",
          "With the canteen fastened snugly across his silver chest, Barnaby began the perilous hop up the jagged cliffs of Obsidian Peaks. Sharp shale stones tumbled beneath his paws, but his little heart beat with steady courage. 'True bravery,' he reminded himself, 'is not having no fear—it is doing what is kind even when fear whispers to turn back.'"
        ]
      },
      {
        chapter: "Chapter 5",
        title: "The Dewdrop Nectar",
        content: [
          "At the summit, inside a cavern lined with smoking volcanic pumice, Barnaby found Pyrrhus lying curled in misery. Smoke drifted painfully from the dragon's nostrils, and tears of hot cinder rolled down his scaly cheeks.",
          "'Who dares enter my lair?' Pyrrhus growled, struggling to raise his enormous horned head. Barnaby did not flinch. He bowed politely, stepped forward, and unfastened his acorn canteen. 'I brought no gold, noble dragon,' Barnaby squeaked softly, 'only sweet dewdrop nectar to soothe your burning throat.'"
        ]
      },
      {
        chapter: "Chapter 6",
        title: "The Golden Peace",
        content: [
          "Pyrrhus hesitated, then leaned his massive snout down and tasted the cool dewdrop nectar. Instantly, the cooling botanical herbs extinguished the painful volcanic ash burning in his gullet. A sigh of pure relief rippled across the dragon's great wings, and his fiery eyes softened to warm amber honey.",
          "'For three moons, ash choked my lungs,' Pyrrhus admitted, bowing his head to the tiny rabbit. 'I was angry and in pain, but your kindness has healed me.' From that sacred dusk onward, Pyrrhus became the sworn guardian of Whispering Woods, flying gentle updrafts to water the crops and carrying Barnaby on grand aerial tours of the starry night sky."
        ]
      }
    ],
    fullContent: [
      "Deep in the heart of Whispering Woods lived Barnaby, a tiny rabbit with soft silver fur and ears that twitched at the slightest sound. Unlike the wild hares who bragged about their speed, Barnaby was quiet and spent his days collecting sweet clover berries.",
      "One sunlit afternoon, a shadow fell over the canopy. Pyrrhus, a fiery dragon from the Obsidian Peaks, landed upon the Great Oak Tree. Pyrrhus demanded all the glowing moonlight mushrooms in the forest, threatening to scorch the meadows if his golden basket wasn't filled by nightfall.",
      "While the elder animals trembled in fear, Barnaby remembered an ancient riddle taught by his grandmother: 'A dragon's flame burns hot and bright, but dewdrop nectar quenches fire with light.' Armed only with a hollow acorn pouch filled with morning dew, Barnaby hopped up to the dragon's lair.",
      "Instead of fighting Pyrrhus, Barnaby offered the dragon a sip of dewdrop nectar. The sweet liquid instantly cooled Pyrrhus's sore throat, which had been inflamed by smoky volcanic ash. Grateful and relieved, Pyrrhus promised never to harm Whispering Woods again, forming an eternal alliance with the brave little rabbit."
    ],
    quizQuestions: [
      { id: 1, question: "What is the name of the main rabbit protagonist?", options: ["Barnaby", "Bugs", "Peter", "Oliver"], correctIndex: 0, explanation: "The main character is Barnaby, a tiny rabbit with soft silver fur.", difficulty: "Easy" },
      { id: 2, question: "Where does Barnaby live?", options: ["Whispering Woods", "Obsidian Peaks", "Emerald Valley", "Sunny Meadows"], correctIndex: 0, explanation: "Barnaby lives deep in Whispering Woods.", difficulty: "Easy" },
      { id: 3, question: "What is the name of the fiery dragon?", options: ["Ignis", "Pyrrhus", "Smaug", "Draco"], correctIndex: 1, explanation: "The dragon is named Pyrrhus from the Obsidian Peaks.", difficulty: "Easy" },
      { id: 4, question: "What was inside Barnaby's hollow acorn pouch?", options: ["Morning dew", "Poison dust", "Firecrackers", "Magic seeds"], correctIndex: 0, explanation: "Barnaby carried morning dew in his hollow acorn pouch.", difficulty: "Medium" }
    ]
  },
  {
    id: 2,
    title: "The Golden Lantern",
    author: "Folk Tales Press",
    audience: "Kids",
    genre: "Moral Story",
    ageGroup: "Children",
    icon: "🏮",
    color: "#FF9F1C",
    coverImage: "/images/stories/golden_lantern.jpg",
    desc: "A poor boy named Leo returns a lost purse to a merchant, receiving an ancient lantern that rewards pure intent.",
    readTime: "10 min",
    rating: 4.8,
    pages: [
      {
        chapter: "Chapter 1",
        title: "The Market of Whispering Winds",
        content: [
          "In the bustling seaside town of Port Valora, young Leo worked from sunrise to dusk sweeping dry leaves and polished marble tiles outside an ancient curio shop. Leo possessed only a patched linen coat and worn leather shoes, yet his eyes shone with curious wonder at the marvelous trade caravans arriving from distant empires.",
          "Every merchant in the market knew Leo for his gentle smile and honesty. Whenever a vendor dropped an apple or a silver hairpin, Leo would dash through the crowd to return it before the owner even realized it had slipped away."
        ]
      },
      {
        chapter: "Chapter 2",
        title: "The Lost Velvet Pouch",
        content: [
          "One misty autumn morning, while sweeping near the fountain courtyard, Leo noticed something heavy resting beneath a stone bench. It was an embroidered crimson velvet pouch tied with golden silk cords. Inside was a fortune: seventy shimmering imperial gold coins, marked with the royal seal of Master Chen, the realm's wealthiest silk merchant.",
          "For a split second, a tempting thought whispered in the cold wind: with seventy coins, Leo could buy a warm house for his ailing mother and hot meals for years. But Leo immediately shook his head. 'What is not mine cannot bring true joy,' he whispered to himself."
        ]
      },
      {
        chapter: "Chapter 3",
        title: "The Test of Integrity",
        content: [
          "Leo sprinted across the cobblestone alleys to the Grand Merchant Guild where Master Chen stood frantically surrounded by guards, tears brimming in his eyes over the lost pouch containing the year's wages for hundreds of weavers.",
          "Out of breath, Leo presented the velvet bag completely untouched. Master Chen counted each coin in disbelief. Overjoyed, Master Chen offered Leo a handful of gold. But Leo bowed politely and said: 'My mother taught me that doing what is right requires no payment; honor is its own harvest.'"
        ]
      },
      {
        chapter: "Chapter 4",
        title: "The Brass Vault of Mysteries",
        content: [
          "Stunned by such rare integrity in one so young, Master Chen led Leo into his private sanctuary. From behind a velvet curtain, he brought out an ornate brass lantern covered in celestial runes that seemed to pulse with faint amber starlight.",
          "'Gold can be spent and lost to thieves,' Master Chen spoke softly. 'This is the Lantern of Truth, passed down by monks of the high peaks. It does not ignite with oil, but with the pure intentions of the soul who holds its handle. It belongs with you, Leo.'"
        ]
      },
      {
        chapter: "Chapter 5",
        title: "The Healing Golden Beam",
        content: [
          "When Leo carried the lantern back to his modest cottage, he discovered its extraordinary gift. The lantern did not generate selfish riches, but whenever someone with a genuine hardship came near, its wick ignited into a warm, fragrant golden light.",
          "When his neighbor's sheep wandered into the dark briar brambles, the lantern projected an luminous path leading them safely home. When winter frost threatened the village wheat reserves, holding the lantern over the grain kept it dry, sweet, and miraculously nourished."
        ]
      },
      {
        chapter: "Chapter 6",
        title: "The Light That Never Fades",
        content: [
          "News of Leo's miraculous lantern spread throughout the province, but Leo never charged a single copper for its help. Whenever traveling lords offered him mountains of gold to buy the artifact, the lantern would grow dim in their greedy hands, only glowing bright again when Leo cradled it gently.",
          "Leo grew up to become the honored Guardian of Port Valora, proving to generation after generation that wealth stored in a vault turns to dust, but kindness and honesty create an inextinguishable light that warms the entire world."
        ]
      }
    ],
    fullContent: [
      "In a crowded village square, young Leo swept leaves outside an antique shop. He possessed very little, yet his heart was rich with honesty. One foggy morning, he stumbled upon a heavy velvet coin pouch dropped by Master Chen, the village's wealthiest silk merchant.",
      "Without hesitation, Leo ran through the bustling market to return the pouch intact. Impressed by the boy's rare integrity, Master Chen offered him a bag of gold coins. But Leo politely declined, saying, 'My mother taught me that doing what is right is its own reward.'",
      "Moved by Leo's humility, Master Chen presented him with a dusty, ornate brass lantern from his private vault. 'This is the Lantern of Truth,' Master Chen whispered. 'It lightens the path of those with selfless hearts.'",
      "When Leo brought the lantern home, it did not grant selfish desires like gold or mansions. Instead, whenever a villager in need approached, the lantern emitted a warm golden beam that revealed hidden solutions—guiding lost livestock, healing sick crops, and restoring peace to the community."
    ],
    quizQuestions: [
      { id: 1, question: "What was Leo's job at the beginning of the story?", options: ["Sweeping leaves outside an antique shop", "Selling silk in the market", "Farming rice fields", "Fishing in the river"], correctIndex: 0, explanation: "Leo swept leaves outside an antique shop.", difficulty: "Easy" }
    ]
  },
  {
    id: 5,
    title: "Midnight at Blackwood Manor",
    author: "A.K. Vortex",
    audience: "Adults",
    genre: "Mystery",
    ageGroup: "Adults",
    icon: "🏚️",
    color: "#546E7A",
    coverImage: "/images/stories/blackwood_manor.jpg",
    desc: "Detective Julian Vance uncovers a labyrinth of corporate blackmail, hidden chambers, and coded clockwork in a storm-isolated Victorian estate.",
    readTime: "22 min",
    rating: 4.9,
    pages: [
      {
        chapter: "Act I",
        title: "The Midnight Vanishing",
        content: [
          "Rain whipped against the gothic gargoyles of Blackwood Manor like bursts of shrapnel as Detective Julian Vance pushed open the wrought-iron gates. Perched atop the sea cliffs of Raven's End, the mansion stood shrouded in black fog. Less than two hours ago, billionaire tech industrialist Arthur Blackwood had vanished into thin air from inside his locked third-floor study.",
          "Vance stamped the rainwater from his trench coat and was met in the grand vestibule by Inspector Graves. 'The study door was bolted from the inside with three deadbolts, Vance. The stained-glass windows are barred with iron filigree. No footprints, no signs of struggle. Only this.' Graves held out an evidence bag containing an antique gold pocket watch—its sapphire hands frozen at precisely 12:00:00."
        ]
      },
      {
        chapter: "Act II",
        title: "The Clock That Chimed Thirteen",
        content: [
          "Vance surveyed the study with microscopic precision. The scent of bitter almond and aged sandalwood hung faint in the air. The heavy oak desk bore an open ledger, its final entry detailing a secret transfer of proprietary neural network patents to a shell corporation in the Cayman Islands.",
          "As the grandfather clock in the mahogany corner chimed for two o'clock in the morning, Vance's hand snapped to his notepad. The mechanical hammer struck not twice, but thirteen reverberating strokes. 'A displaced escapement wheel,' Vance murmured, kneeling before the pendulum cabinet. 'Someone altered the internal gears to create an acoustic harmonic trigger.'"
        ]
      },
      {
        chapter: "Act III",
        title: "The Telescope in the Library",
        content: [
          "Following the acoustic resonance along the mansion's hollow plaster walls, Vance traced the vibration to the grand conservatory library. Thousands of calfskin-bound volumes lined three tiers of spiraling cast-iron balconies. At the center stood a vintage brass naval telescope pointed out toward the turbulent ocean.",
          "Vance adjusted the telescope's focus ring. Instead of viewing the sea, the lens reflected a series of miniature mirrors concealed inside the bookcase woodwork. Vance rotated the azimuth dial to coordinates matching the date on Blackwood's pocket watch: 1-2-0-0. With a soft pneumatic hiss, a nine-foot bookshelf slid back into the wall, revealing a stone staircase spiraling down into pitch-black depths."
        ]
      },
      {
        chapter: "Act IV",
        title: "Subterranean Secrets",
        content: [
          "Descending with his flashlight drawn, Vance entered a subterranean laboratory carved directly into the seaside cliff bedrock. Banks of humming quantum servers and glowing fiber-optic conduits illuminated the cavern with eerie electric cyan light.",
          "Sitting calmly at the central terminal, sipping black tea from a porcelain cup, was Arthur Blackwood himself—unharmed, armed with a digital decryptor, and staring intently at an encrypted bank ledger. 'I expected Graves to take till morning,' Blackwood said without looking up. 'I am pleased they called you, Detective Vance.'"
        ]
      },
      {
        chapter: "Act V",
        title: "The Conspiracy Exposed",
        content: [
          "Blackwood turned his monitor toward Vance. 'I didn't flee to escape my debts, Julian. I staged this vanishing because my business partner, Lord Sterling, poisoned my evening brandy with diluted cyanide and tampered with my security system to forge my signature on the acquisition deed before midnight.'",
          "Blackwood held up an audio recorder playing Sterling's voice instructing assassins to scuttle Blackwood's research vessel offshore. 'By vanishing behind the study's secret passage before the poison could be administered, I forced Sterling to prematurely execute his forged transactions, cementing his criminal footprint across the global banking network.'"
        ]
      },
      {
        chapter: "Act VI",
        title: "The Dawn of Truth",
        content: [
          "Before Blackwood could finish his explanation, heavy footsteps echoed down the stone spiral staircase. Lord Sterling emerged from the shadows, a silenced revolver raised, his face twisted in desperate rage. 'A brilliant deduction, gentlemen, but neither of you will leave this cavern alive.'",
          "Vance had anticipated the ambush. With lightning reflex, Vance triggered the high-voltage photographic flash of his field camera directly into Sterling's night-adapted eyes, lunging forward to disarm him in the blinding flash. As dawn cracked over the stormy sea, police cruisers illuminated Blackwood Manor with flashing red and blue lights. The Blackwood legacy was saved, and the detective walked into the morning mist, ready for the next case."
        ]
      }
    ],
    fullContent: [
      "A thunderstorm lashed against the gothic towers of Blackwood Manor as Detective Julian Vance arrived. Billionaire industrialist Arthur Blackwood had vanished from his locked study at precisely midnight, leaving behind only an antique pocket watch frozen at 12:00.",
      "Vance interviewed the household staff, noting a subtle detail: the grandfather clock in the foyer chimed thirteen times. Inspecting the library's mahogany bookshelf, Vance discovered a secret mechanism hidden inside a brass telescope ornament.",
      "Pressing the hidden trigger revealed a subterranean chamber beneath the study floor. Inside, Arthur Blackwood wasn't dead or kidnapped—he had staged his own disappearance to expose his corrupt business partner, Lord Sterling, who was attempting to seize the family estate.",
      "With evidence secured from the subterranean safe, Detective Vance brought Sterling to justice, restoring honor to the Blackwood legacy before dawn broke."
    ],
    quizQuestions: [
      { id: 1, question: "Who is the lead detective in 'Midnight at Blackwood Manor'?", options: ["Julian Vance", "Sherlock Holmes", "Hercule Poirot", "Arthur Blackwood"], correctIndex: 0, explanation: "The detective is Julian Vance.", difficulty: "Easy" }
    ]
  },
  {
    id: 6,
    title: "Echoes of the Quantum Void",
    author: "Dr. Aris Vance",
    audience: "Adults",
    genre: "Sci-Fi",
    ageGroup: "Adults",
    icon: "🌌",
    color: "#06B6D4",
    coverImage: "/images/stories/quantum_void.jpg",
    desc: "An astrophysicist intercepts deep-space quantum signals that rewrite the laws of gravity, unlocking temporal memory arrays from a dying galaxy.",
    readTime: "25 min",
    rating: 4.9,
    pages: [
      {
        chapter: "Chapter 1",
        title: "The Tachyon Anomaly",
        content: [
          "Aboard the orbital deep-space telemetry station Aetheris-9, suspended in geosynchronous orbit 36,000 kilometers above the Pacific, Dr. Aris Vance listened to the static of the cosmos. For eight months, the station's sub-space graviton arrays had registered only the quiet cosmic background radiation of dead stars.",
          "At 03:42 Station Time, the quantum baseline spiked into impossible territory. A harmonic sequence of graviton pulses washed through the sensors, originating not from any known pulsar, but from the void between galaxies—specifically, Sector 12 near the Boötes Void. The pulses weren't random cosmic noise; they followed the mathematical Fibonacci spiral down to forty decimal places."
        ]
      },
      {
        chapter: "Chapter 2",
        title: "The Sub-Space Decryption Protocol",
        content: [
          "Vance initialized the station's synthetic neural core, 'Prometheus'. As the algorithmic decryptor chewed through the petabytes of tachyon interference, a holographic matrix bloomed inside the observation module. Blue and violet light bathed the zero-gravity chamber.",
          "'Doctor,' Prometheus's synthesized voice resonated with uncharacteristic awe, 'this signal is not an optical transmission. It is an entangled quantum memory stream containing the encoded genetic and linguistic archives of an advanced civilization that perished four billion years ago.'"
        ]
      },
      {
        chapter: "Chapter 3",
        title: "The Holographic Archive",
        content: [
          "Stepping into the center of the projection, Vance watched towering spires of crystalline carbon weave across his vision. He saw beings whose bodies were woven from condensed starlight, communicating through harmonic chord vibrations that altered physical matter instantaneously.",
          "The alien message was titled 'The Chrysalis Protocol'. It was an astronomical warning and a technological bequest: their home galaxy had been swallowed by a runaway dark matter singularity, but before extinction, they had encoded their greatest discoveries—gravitational manipulation, clean planetary energy, and atmospheric restoration—into the fabric of quantum spacetime."
        ]
      },
      {
        chapter: "Chapter 4",
        title: "Orbital Decay Alert",
        content: [
          "Suddenly, warning sirens screamed across Aetheris-9. The immense gravitational resonance from the incoming transmission had destabilized the station's magnetic containment coils. The orbital thrusters sputtered and died, and the station's trajectory began decaying rapidly toward Earth's upper thermosphere.",
          "'Hull temperature rising at 40 degrees per second,' Prometheus reported. 'Atmospheric burn-up in twelve minutes. If we purge the quantum buffer to restore thruster power, the alien transmission will be permanently erased from human history.'"
        ]
      },
      {
        chapter: "Chapter 5",
        title: "The Singularity Inversion",
        content: [
          "Vance refused to let humanity's greatest discovery burn in the clouds. Working with feverish precision in microgravity, he accessed the decrypted alien equations on gravity manipulation. 'Prometheus, do not purge the buffer! Invert the graviton collector coils and project a focused repulsive gravitational beam against Earth's ionosphere!'",
          "The neural AI hesitated for a microsecond. 'Doctor, that calculation has never been experimentally tested.' 'Do it now!' Vance shouted. The coils hummed with a bone-jarring bass rumble. A blinding beam of cerulean light erupted from the station's keel, pushing against the planetary magnetic field and arresting their fiery descent with breathtaking elegance."
        ]
      },
      {
        chapter: "Chapter 6",
        title: "The Quantum Inheritance",
        content: [
          "Aetheris-9 stabilized safely into a higher orbit. Below, the city lights of Tokyo, Mumbai, and San Francisco shimmered like constellations across the night-side of Earth. The complete alien codex was safely compiled into the station's crystalline storage banks.",
          "Within forty-eight hours, the decoded formulas were transmitted to planetary research laboratories worldwide. The equations solved Earth's climate collapse, offering inexhaustible solar-gravity power for billions of people.",
          "Vance stood alone at the cupola window, looking past the moon into the silent, eternal void of deep space. He tapped the transceiver console and sent a single whisper into the dark: 'We hear you. You are remembered.'"
        ]
      }
    ],
    fullContent: [
      "Stationed aboard the orbital research vessel Aetheris, Commander Astra Vega monitored deep-space radio telemetry from Sector 9. Suddenly, her quantum array captured a repeating harmonic signal originating 40 light-years away near the Vega Star Cluster.",
      "De-scrambling the tachyon transmission revealed not a threat, but a complex bio-atmospheric formula engineered by an ancient interstellar civilization. The formula detailed how to harmlessly neutralize greenhouse gases using solar-activated micro-algae.",
      "Working against a looming orbital decay timeline, Astra transmitted the encoded schematics to terrestrial labs in Tokyo, Geneva, and Nairobi. Within months, Earth's atmospheric scrubbing towers were successfully deployed.",
      "Looking out the viewport at a restored blue Earth, Astra transmitted a single signal back into the cosmos: 'Message received. Humanity thanks you.'"
    ],
    quizQuestions: [
      { id: 1, question: "What is the name of the research station in 'Echoes of the Quantum Void'?", options: ["Aetheris-9", "Prometheus", "Nautilus", "Apollo 13"], correctIndex: 0, explanation: "The station is Aetheris-9.", difficulty: "Easy" }
    ]
  },
  {
    id: 3,
    title: "Stars of the Deep Ocean",
    author: "Marina Blue",
    audience: "Teens",
    genre: "Adventure",
    ageGroup: "All Ages",
    icon: "🐬",
    color: "#4FC3F7",
    coverImage: "/images/stories/deep_ocean.jpg",
    desc: "An oceanographer named Dr. Kai dives into the Mariana Trench and discovers an ancient bioluminescent civilization.",
    readTime: "16 min",
    rating: 4.7,
    pages: [
      {
        chapter: "Chapter 1",
        title: "The 8000-Meter Trench",
        content: [
          "Dr. Kai Vance piloted his experimental deep-sea titanium submersible, the Nautilus II, into the pitch-black abyssal trenches of the Mariana. At 8,000 meters below sea level, where the crushing hydrostatic pressure would shatter ordinary submarines like eggshells, his external sonar began detecting rhythmic electromagnetic pulses echoing from the ocean floor.",
          "Kai checked his telemetry monitors. The pulses weren't hydrothermal vents or seismic tremors; they had the syncopated harmony of a living heartbeat, pulsing through the midnight waters."
        ]
      },
      {
        chapter: "Chapter 2",
        title: "Atlantis-Atoll Unveiled",
        content: [
          "Kai engaged his forward xenon floodlights. As the illumination pierced through the ancient oceanic snow, his breath caught in his throat. Towering spires constructed from iridescent living coral-glass stretched hundreds of meters above the seabed.",
          "He had discovered Atlantis-Atoll, a mythical sunken metropolis thought to be a sailor's legend. Graceful aquatic beings called the Thalassians swam effortlessly between the glowing spires, their bodies adorned in shimmering bioluminescent patterns that sparkled like underwater constellations."
        ]
      },
      {
        chapter: "Chapter 3",
        title: "The Bioluminescent Language",
        content: [
          "Two Thalassian emissaries swam alongside the submersible's cockpit dome. Rather than speaking with words, their skin emitted pulses of emerald, sapphire, and amber light in intricate geometrical rhythms.",
          "Kai engaged his AI optical scanner to translate the light patterns. 'Welcome, surface explorer,' the translated words flashed across Kai's glass visor. 'We have waited three centuries for an emissary who comes with curiosity rather than weapons of war.'"
        ]
      },
      {
        chapter: "Chapter 4",
        title: "Danger at the Central Pearl Core",
        content: [
          "The Thalassians guided Nautilus II into a massive airlock cavern beneath their central citadel. There, Council Elder Nerea revealed a critical emergency threatening their world.",
          "Their city's power source, the Central Pearl Core, was overheating. An underwater volcanic rift had fractured the geothermal intake valves, and superheated magma was threatening to collapse the foundational reefs that supported their entire civilization."
        ]
      },
      {
        chapter: "Chapter 5",
        title: "The Geothermal Repair",
        content: [
          "Kai knew his submersible's micro-welding robotic arms and titanium coolant conduits were the only tools that could survive the extreme volcanic heat. Maneuvering the Nautilus II into the scalding hydrothermal plume, Kai guided the remote manipulators with master precision.",
          "Sparks and steam engulfed the submersible's hull as Kai realigned the fractured geothermal pressure valves and sealed the fissure with liquid ceramic resin. With a triumphant hiss, the core's temperature normalized, and a warm blue radiance rippled across the oceanic spires."
        ]
      },
      {
        chapter: "Chapter 6",
        title: "Guardians of the Abyssal Stars",
        content: [
          "In a solemn ceremony beneath the glowing dome of Atlantis-Atoll, Elder Nerea presented Kai with an ancient aqua crystal containing Earth's climate records spanning millions of years before human industrialization.",
          "'Guard our oceans as we guard the deep secrets,' Nerea communicated with a gentle cascade of golden light. Returning to the surface under a canopy of midnight stars, Dr. Kai pledged his life to protecting the marine environment, forever bound to the secret wonders of the deep."
        ]
      }
    ],
    fullContent: [
      "Dr. Kai Vance piloted his experimental submersible, the Nautilus II, into the pitch-black abyssal depths of the Mariana Trench. At 8,000 meters below sea level, the sonar began picking up rhythmic electromagnetic pulses—almost like a heartbeat echoing from the seabed.",
      "Descending through a narrow ocean trench, Kai gasped as his floodlights illuminated towering spire structures built from iridescent coral-glass. He had stumbled upon Atlantis-Atoll, a lost underwater city inhabited by the Thalassians, a species that communicated through shimmering bioluminescent light patterns.",
      "The Thalassians welcomed Kai and showed him their Central Pearl Core, an ancient energy reservoir threatened by thermal vents. Kai used his submersible's micro-welding robotic arms to repair the core's geothermal regulator, saving their aquatic metropolis from collapsing.",
      "In gratitude, the Thalassian Council presented Kai with a glowing aqua crystal holding records of earth's ancient climate history. Returning to the surface, Kai pledged to protect the oceans and guard the secret of the abyssal stars."
    ],
    quizQuestions: [
      { id: 1, question: "What is the name of the protagonist in 'Stars of the Deep Ocean'?", options: ["Dr. Kai Vance", "Captain Nemo", "Dr. Nebula", "Arthur Curry"], correctIndex: 0, explanation: "The oceanographer protagonist is Dr. Kai Vance.", difficulty: "Easy" }
    ]
  },
  {
    id: 7,
    title: "Oliver the Owl's Midnight School",
    author: "Bedtime Story Press",
    audience: "Kids",
    genre: "Fairy Tale",
    ageGroup: "Children",
    icon: "🦉",
    color: "#8B5CF6",
    coverImage: "/images/stories/owl_school.jpg",
    desc: "Oliver the young owl overcomes night-blindness with help from twinkling fireflies and learns to read star maps.",
    readTime: "10 min",
    rating: 4.9,
    pages: [
      {
        chapter: "Chapter 1",
        title: "The Ancient Sycamore",
        content: [
          "High in the hollow trunk of the Ancient Sycamore Tree, young Oliver the owl adjusted his tiny silver wire-rimmed spectacles. All his cousins and classmates could swoop effortlessly through the pitch-black midnight forest, catching mice and threading between pine branches without a care.",
          "Oliver, however, suffered from night-blurriness. Whenever the moon hid behind a cloud, the trees looked like fuzzy blobs of ink, making it impossible for him to read the constellation star maps during the academy's midnight navigation class."
        ]
      },
      {
        chapter: "Chapter 2",
        title: "The Night-Blurry Dilemma",
        content: [
          "Headmaster Bubo announced that the annual Great Solstice Flight was only two nights away. Every fledgeling owl was required to navigate the four-mile Forest Loop beneath the starry sky to earn their Golden Feather Star.",
          "Oliver sat sadly upon a low cedar branch, his round spectacles fogged with tears. 'I will never be a true nocturnal flyer,' Oliver sniffled to himself. 'My eyes just cannot see in the deep shadow.'"
        ]
      },
      {
        chapter: "Chapter 3",
        title: "Felix and the Firefly Choir",
        content: [
          "Suddenly, a cheerful golden spark danced in front of Oliver's beak. It was Felix, the captain of the Whispering Meadow Firefly Choir. 'Why the long feather-face, little Oliver?' Felix buzzed warmly, blinking his bright yellow lantern abdomen.",
          "Oliver explained his predicament. Felix did not laugh or tell him to try harder. Instead, Felix grinned and whistled into the night air: 'You don't need to change who you are, Oliver. You just need friends who shine in the dark!'"
        ]
      },
      {
        chapter: "Chapter 4",
        title: "The Starlight Halo",
        content: [
          "Within minutes, hundreds of friendly fireflies gathered upon the cedar branch. Working together under Felix's direction, they formed a shimmering, luminous halo around Oliver's wire spectacles.",
          "The soft amber glow illuminated the star map right before Oliver's eyes, while casting a gentle path ten feet ahead through the dark canopy. Oliver gasped in delight—the constellation stars Ursa Major and Orion were as clear as day!"
        ]
      },
      {
        chapter: "Chapter 5",
        title: "The Great Solstice Flight",
        content: [
          "On the night of the Solstice Flight, the entire forest gathered around the Ancient Sycamore. When Oliver stepped onto the launch branch with his crown of twinkling fireflies, some of the older owls raised their feathery eyebrows in surprise.",
          "With a confident leap, Oliver took flight! Together with his glowing firefly crew, Oliver glided smoothly through the twisted Willow Maze, skirted the Misty Waterfall, and read every constellation checkpoint with flaw-free precision."
        ]
      },
      {
        chapter: "Chapter 6",
        title: "The Golden Feather Star",
        content: [
          "Oliver was the first fledgeling to cross the finish ribbon, touching down lightly on the teacher's branch to thunderous applause from badgers, rabbits, and owls alike.",
          "Headmaster Bubo pinned the gleaming Golden Feather Star to Oliver's chest and announced: 'True wisdom is not doing everything alone; it is having the heart to unite with others and turn challenges into brilliant light.' From that night on, Oliver and the fireflies taught navigation together, guiding every forest creature home safely."
        ]
      }
    ],
    fullContent: [
      "High in the hollow trunk of the Ancient Sycamore, young Oliver the owl put on his silver wire-rimmed spectacles. While other owls flew effortlessly through the dark, Oliver struggled to see the constellation maps during nocturnal flight class.",
      "Determined not to miss the annual Solstice Flight, Oliver sought guidance from Felix, a friendly firefly leader who lit up the forest floor with warm golden sparks.",
      "Felix and his firefly choir formed a luminous glowing halo around Oliver's spectacles, illuminating the night sky like a starry lantern. Guided by their gentle light, Oliver navigated the Great Forest Loop flawlessly.",
      "The Headmaster Owl awarded Oliver the Golden Feather Star, teaching the forest that asking for help turns challenges into brilliant triumphs."
    ],
    quizQuestions: [
      { id: 1, question: "Who is the main protagonist in 'Oliver the Owl's Midnight School'?", options: ["Oliver the young owl", "Felix the fox", "Barnaby the rabbit", "Dr. Kai"], correctIndex: 0, explanation: "Oliver is the young owl protagonist.", difficulty: "Easy" }
    ]
  }
]

export function getStoryById(id) {
  if (!id) return LIBRARY_STORIES[0];
  const searchId = String(id).trim();
  let found = LIBRARY_STORIES.find(s => String(s.id).trim() === searchId);
  if (found) return found;
  try {
    const customContest = JSON.parse(localStorage.getItem('animverse_custom_contest_stories') || '[]');
    found = customContest.find(s => String(s.id).trim() === searchId);
    if (found) return found;
    const authorStories = JSON.parse(localStorage.getItem('animverse_author_stories') || '[]');
    found = authorStories.find(s => String(s.id).trim() === searchId);
    if (found) return found;
  } catch {
    // Ignore JSON errors
  }
  return LIBRARY_STORIES[0];
}

export default function StoryLibrary() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const user = getUser()
  const activeRole = user?.role || searchParams.get('role') || 'guest'

  const [search, setSearch] = useState(initialSearch)
  const [subFilter, setSubFilter] = useState('All')
  const [authorTab, setAuthorTab] = useState('my-all') // 'my-all' | 'my-kids' | 'my-adults' | 'platform'
  const [allStories, setAllStories] = useState(LIBRARY_STORIES)
  const [authorStories, setAuthorStories] = useState([])

  // ── Add New Story State ──
  const [showAddStoryModal, setShowAddStoryModal] = useState(false)
  const [addTab, setAddTab] = useState('gemini') // 'gemini' | 'manual'
  const [geminiPrompt, setGeminiPrompt] = useState('')
  const [geminiGenre, setGeminiGenre] = useState('Fairy Tale')
  const [geminiAudience, setGeminiAudience] = useState(activeRole === 'adult' ? 'Adults' : 'Kids')
  const [geminiLanguage, setGeminiLanguage] = useState('English')
  const [geminiChapters, setGeminiChapters] = useState(4)
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false)
  const [generatedPreview, setGeneratedPreview] = useState(null)

  // Manual Form State
  const [manualForm, setManualForm] = useState({
    title: '',
    author: user?.name || 'AnimVerse Author',
    genre: 'Fairy Tale',
    audience: activeRole === 'adult' ? 'Adults' : 'Kids',
    language: 'English',
    desc: '',
    content: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  // Post-Save Confirmation Modal
  const [savedStoryModal, setSavedStoryModal] = useState(null)

  // Story to Animated Video Modal & Pipeline
  const [animatingStory, setAnimatingStory] = useState(null)
  const [animationProgress, setAnimationProgress] = useState({ step: 1, text: '', pct: 0 })
  const [animationResult, setAnimationResult] = useState(null)
  const [isRenderingVideo, setIsRenderingVideo] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  // Load Stories from MongoDB and local storage
  const loadStoriesFromDB = () => {
    try {
      const savedAuthorStories = JSON.parse(localStorage.getItem('animverse_author_stories') || '[]')
      const normalizedAuthorStories = savedAuthorStories.map(s => ({
        ...s,
        author: s.author || user?.name || 'Author (You)',
        coverImage: getStoryCover(s),
        isAuthorUploaded: true
      }))
      setAuthorStories(normalizedAuthorStories)
    } catch {
      setAuthorStories([])
    }

    fetch('/api/stories')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          const mongoStories = res.data.map(s => {
            const bundled = LIBRARY_STORIES.find(b => b.title?.toLowerCase() === s.title?.toLowerCase() || String(b.id) === String(s._id || s.id))
            return {
              ...s,
              id: s._id || s.id,
              desc: s.desc || s.description,
              coverImage: s.coverImage || bundled?.coverImage || getStoryCover(s)
            }
          })
          const existingTitles = new Set(mongoStories.map(s => s.title.toLowerCase()))
          const merged = [
            ...mongoStories,
            ...LIBRARY_STORIES.filter(s => !existingTitles.has(s.title.toLowerCase()))
          ]
          setAllStories(merged)
        }
      })
      .catch(err => console.warn('Using bundled story library:', err))
  }

  useEffect(() => {
    loadStoriesFromDB()
  }, [user?.name])

  // ── 1. GENERATE STORY WITH GOOGLE GEMINI AI ──
  const handleGenerateWithGemini = async (e) => {
    e?.preventDefault()
    if (!geminiPrompt.trim()) {
      showToast('Please enter a story topic or prompt for Gemini AI.')
      return
    }

    setIsGeneratingGemini(true)
    try {
      const token = getToken()
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`

      const res = await fetch('/api/generate/story-ai', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: geminiPrompt,
          genre: geminiGenre,
          audience: geminiAudience,
          language: geminiLanguage,
          chapterCount: geminiChapters,
          author: user?.name || 'AnimVerse AI Creator'
        })
      })

      const json = await res.json()
      if (json.success && json.data) {
        setGeneratedPreview(json.data)
        showToast('✨ Story generated with Google Gemini AI!')
      } else {
        showToast(json.message || 'Error generating story with Gemini AI')
      }
    } catch (err) {
      console.error(err)
      showToast('Server connection error while generating story.')
    } finally {
      setIsGeneratingGemini(false)
    }
  }

  // ── 2. SAVE STORY (GEMINI OR MANUAL) ──
  const handleSaveStory = async (storyToSave) => {
    setIsSaving(true)
    try {
      const token = getToken()
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`

      const res = await fetch('/api/stories', {
        method: 'POST',
        headers,
        body: JSON.stringify(storyToSave)
      })

      const json = await res.json()
      if (json.success && json.data) {
        const saved = json.data
        setShowAddStoryModal(false)
        setSavedStoryModal(saved)
        loadStoriesFromDB()
        showToast(`🎉 "${saved.title}" saved to library!`)
      } else {
        showToast(json.message || 'Error saving story')
      }
    } catch (err) {
      console.error(err)
      showToast('Error connecting to backend database.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveManualStory = (e) => {
    e.preventDefault()
    if (!manualForm.title.trim()) {
      showToast('Title is required.')
      return
    }

    const rawChapters = manualForm.content.split(/\n\s*\n/)
    const pages = rawChapters.map((ch, idx) => ({
      chapter: `Chapter ${idx + 1}`,
      title: `Part ${idx + 1}`,
      content: [ch.trim()]
    }))

    const storyPayload = {
      title: manualForm.title.trim(),
      author: manualForm.author.trim() || user?.name || 'Author',
      genre: manualForm.genre,
      audience: manualForm.audience,
      language: manualForm.language,
      desc: manualForm.desc.trim() || `${manualForm.title}. An original story.`,
      description: manualForm.desc.trim() || `${manualForm.title}. An original story.`,
      pages: pages.length > 0 ? pages : [{ chapter: 'Chapter 1', title: 'Beginning', content: [manualForm.desc || 'An original adventure.'] }],
      readTime: '10 min',
      readingTime: 10
    }

    handleSaveStory(storyPayload)
  }

  // ── 3. AUTOMATIC CONVERT STORY TO ANIMATED VIDEO ──
  const handleStartVideoGeneration = async (story) => {
    if (!story) return
    setSavedStoryModal(null)
    setAnimatingStory(story)
    setAnimationResult(null)
    setIsRenderingVideo(true)
    setAnimationProgress({ step: 1, text: '🧠 Analyzing Story Characters, Chapters & Script...', pct: 20 })

    const t1 = setTimeout(() => {
      setAnimationProgress({ step: 2, text: '🎬 Generating Multi-Scene Storyboard & Camera Angles...', pct: 45 })
    }, 600)

    const t2 = setTimeout(() => {
      setAnimationProgress({ step: 3, text: '🎙️ Synthesizing Spoken Dialogue & Cinematic Narration...', pct: 70 })
    }, 1200)

    const t3 = setTimeout(() => {
      setAnimationProgress({ step: 4, text: '🎥 Rendering Neural AI Animation Video Clips...', pct: 88 })
    }, 1800)

    try {
      const token = getToken()
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`

      const res = await fetch('/api/generate/story-to-video', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          storyId: story._id || story.id,
          storyData: story,
          style: (story.audience === 'Kids' || story.ageGroup === 'kids') ? 'Kids Cartoon' : 'Cinematic 8K',
          animationStyle: (story.audience === 'Kids' || story.ageGroup === 'kids') ? 'cartoon' : 'cinematic'
        })
      })

      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)

      const json = await res.json()
      if (json.success && json.data) {
        setAnimationProgress({ step: 5, text: '✨ 100% Animation Render Complete! Loading Video...', pct: 100 })
        
        setTimeout(() => {
          setIsRenderingVideo(false)
          setAnimationResult(json.data)
          showToast('🎬 Animated Video generated & added to Animated Videos!')
        }, 600)
      } else {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        showToast(json.message || 'Video generation failed')
        setIsRenderingVideo(false)
      }
    } catch (err) {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      console.error(err)
      showToast('Error during AI animation synthesis.')
      setIsRenderingVideo(false)
    }
  }

  // ROLE-BASED STORY FILTERING:
  // 1. Parent login: CAN ONLY SEE KIDS BOOKS. Adult books strictly forbidden.
  // 2. Adult login: CAN ONLY SEE ADULT/TEEN NOVELLAS. Kids books strictly hidden.
  // 3. Author login: Shows author's uploaded books with category filtering (Kids/Adults), or platform browse.
  // 4. Guest: Shows all with category switchers.
  let displayedStories = []

  if (activeRole === 'parent') {
    displayedStories = allStories.filter(s =>
      s.audience === 'Kids' || s.ageGroup === 'children' || s.ageGroup === 'kids' || s.genre === 'Fairy Tale' || s.genre === 'Moral Story'
    )
    if (subFilter !== 'All') {
      displayedStories = displayedStories.filter(s => s.genre?.toLowerCase() === subFilter.toLowerCase())
    }
  } else if (activeRole === 'adult') {
    displayedStories = allStories.filter(s =>
      s.audience === 'Adults' || s.audience === 'Teens' || s.ageGroup === 'adult'
    )
    if (subFilter !== 'All') {
      displayedStories = displayedStories.filter(s => s.genre?.toLowerCase() === subFilter.toLowerCase())
    }
  } else if (activeRole === 'author') {
    if (authorTab === 'my-all') {
      displayedStories = authorStories
    } else if (authorTab === 'my-kids') {
      displayedStories = authorStories.filter(s => s.audience === 'Kids' || s.ageGroup === 'kids')
    } else if (authorTab === 'my-adults') {
      displayedStories = authorStories.filter(s => s.audience === 'Adults' || s.ageGroup === 'adult')
    } else {
      displayedStories = allStories
    }
  } else {
    // Guest / general user
    if (subFilter === 'Kids') {
      displayedStories = allStories.filter(s => s.audience === 'Kids' || s.ageGroup === 'children' || s.ageGroup === 'kids')
    } else if (subFilter === 'Adults') {
      displayedStories = allStories.filter(s => s.audience === 'Adults' || s.audience === 'Teens' || s.ageGroup === 'adult')
    } else {
      displayedStories = allStories
    }
  }

  // Apply search query
  if (search.trim()) {
    const q = search.toLowerCase()
    displayedStories = displayedStories.filter(s =>
      s.title?.toLowerCase().includes(q) ||
      s.desc?.toLowerCase().includes(q) ||
      s.genre?.toLowerCase().includes(q) ||
      s.author?.toLowerCase().includes(q)
    )
  }

  const authorKidsCount = authorStories.filter(s => s.audience === 'Kids' || s.ageGroup === 'kids').length
  const authorAdultsCount = authorStories.filter(s => s.audience === 'Adults' || s.ageGroup === 'adult').length

  return (
    <AppShell title="Digital Story Library">
      {/* ── ROLE-SPECIFIC STATUS & SAFETY BANNER ── */}
      <div style={{
        background: activeRole === 'parent'
          ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(10, 11, 14, 0.95) 100%)'
          : activeRole === 'adult'
          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(10, 11, 14, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(10, 11, 14, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 20, padding: '24px 28px', marginBottom: 28,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
      }}>
        <div>
          {activeRole === 'parent' && (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '4px 12px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 800, color: '#06B6D4', fontFamily: 'monospace', marginBottom: 8 }}>
                🛡️ PARENT SAFETY SUITE ACTIVE • STRICTLY KID-SAFE STORIES
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 6px', color: '#F8FAFC' }}>
                Bedtime & <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Children's Library</span>
              </h1>
              <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.9rem' }}>
                Exclusively displaying parent-approved fairy tales, moral fables, and gentle bedtime stories. Adult novellas are completely restricted.
              </p>
            </>
          )}

          {activeRole === 'adult' && (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 12px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'monospace', marginBottom: 8 }}>
                ✦ ADULT FICTION LOUNGE • MATURE & DEEP NARRATIVES ONLY
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 6px', color: '#F8FAFC' }}>
                Adult & Sci-Fi <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Novellas</span>
              </h1>
              <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.9rem' }}>
                Immersive sci-fi world-building, gothic mysteries, and complex novellas. Kids stories are filtered out of your reading lounge.
              </p>
            </>
          )}

          {activeRole === 'author' && (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '4px 12px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 800, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 8 }}>
                ✍️ AUTHOR PUBLISHING PIPELINE • MANUSCRIPT REPOSITORY
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 6px', color: '#F8FAFC' }}>
                Your Uploaded <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Manuscripts</span>
              </h1>
              <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.9rem' }}>
                View and manage the books you uploaded, organized by their designated category: Kids or Adults.
              </p>
            </>
          )}

          {activeRole !== 'parent' && activeRole !== 'adult' && activeRole !== 'author' && (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '4px 12px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', fontFamily: 'monospace', marginBottom: 8 }}>
                ✦ DIGITAL STORY LIBRARY
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 6px', color: '#F8FAFC' }}>
                Explore All Stories & <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Novellas</span>
              </h1>
              <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.9rem' }}>
                Multi-page animated books with 6+ chapters each. Log into Parent Portal for Kid-Safe mode or Adult Portal for deep fiction.
              </p>
            </>
          )}
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setShowAddStoryModal(true)
              setGeneratedPreview(null)
            }}
            style={{
              padding: '11px 22px', borderRadius: 50, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0A0B0E', fontWeight: 900, fontSize: '0.88rem',
              boxShadow: '0 4px 16px rgba(245,158,11,0.35)', display: 'inline-flex', alignItems: 'center', gap: 8
            }}>
            ✨ + Add New Story (Gemini AI)
          </button>

          <Link
            to="/projects"
            style={{
              padding: '11px 20px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)', color: '#F8FAFC', fontWeight: 800, fontSize: '0.88rem',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8
            }}>
            🎬 Animated Videos
          </Link>
        </div>
      </div>

      {/* ── TOAST ALERT ── */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 99999,
          background: 'linear-gradient(135deg, #10B981, #059669)',
          color: 'white', padding: '14px 24px', borderRadius: 14,
          fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {toastMsg}
        </div>
      )}

      {/* ── FILTER CONTROLS ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        {/* AUTHOR-SPECIFIC CATEGORY SWITCHER */}
        {activeRole === 'author' && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setAuthorTab('my-all')}
              style={{
                padding: '8px 18px', borderRadius: 50,
                border: `1px solid ${authorTab === 'my-all' ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                background: authorTab === 'my-all' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                color: authorTab === 'my-all' ? '#F59E0B' : '#94A3B8',
                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
              }}>
              ✍️ All Uploaded ({authorStories.length})
            </button>
            <button
              onClick={() => setAuthorTab('my-kids')}
              style={{
                padding: '8px 18px', borderRadius: 50,
                border: `1px solid ${authorTab === 'my-kids' ? '#06B6D4' : 'rgba(255,255,255,0.1)'}`,
                background: authorTab === 'my-kids' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.03)',
                color: authorTab === 'my-kids' ? '#06B6D4' : '#94A3B8',
                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
              }}>
              🧸 Kids Category ({authorKidsCount})
            </button>
            <button
              onClick={() => setAuthorTab('my-adults')}
              style={{
                padding: '8px 18px', borderRadius: 50,
                border: `1px solid ${authorTab === 'my-adults' ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                background: authorTab === 'my-adults' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                color: authorTab === 'my-adults' ? '#F59E0B' : '#94A3B8',
                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
              }}>
              📚 Adults Category ({authorAdultsCount})
            </button>
            <button
              onClick={() => setAuthorTab('platform')}
              style={{
                padding: '8px 18px', borderRadius: 50,
                border: `1px solid ${authorTab === 'platform' ? '#8B5CF6' : 'rgba(255,255,255,0.1)'}`,
                background: authorTab === 'platform' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                color: authorTab === 'platform' ? '#A78BFA' : '#94A3B8',
                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
              }}>
              🌐 All Platform Stories ({allStories.length})
            </button>
          </div>
        )}

        {/* PARENT-SPECIFIC GENRE FILTER (ONLY KIDS GENRES) */}
        {activeRole === 'parent' && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Fairy Tale', 'Moral Story'].map(genre => (
              <button
                key={genre}
                onClick={() => setSubFilter(genre)}
                style={{
                  padding: '8px 18px', borderRadius: 50,
                  border: `1px solid ${subFilter === genre ? '#06B6D4' : 'rgba(255,255,255,0.1)'}`,
                  background: subFilter === genre ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: subFilter === genre ? '#06B6D4' : '#94A3B8',
                  fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                }}>
                {genre === 'All' ? '🧸 All Kids Books' : `🌟 ${genre}`}
              </button>
            ))}
          </div>
        )}

        {/* ADULT-SPECIFIC GENRE FILTER (ONLY ADULT GENRES) */}
        {activeRole === 'adult' && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Sci-Fi', 'Mystery'].map(genre => (
              <button
                key={genre}
                onClick={() => setSubFilter(genre)}
                style={{
                  padding: '8px 18px', borderRadius: 50,
                  border: `1px solid ${subFilter === genre ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                  background: subFilter === genre ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: subFilter === genre ? '#F59E0B' : '#94A3B8',
                  fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                }}>
                {genre === 'All' ? '📚 All Adult Novellas' : `✦ ${genre}`}
              </button>
            ))}
          </div>
        )}

        {/* GUEST FILTER */}
        {activeRole !== 'parent' && activeRole !== 'adult' && activeRole !== 'author' && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Kids', 'Adults'].map(cat => (
              <button
                key={cat}
                onClick={() => setSubFilter(cat)}
                style={{
                  padding: '8px 18px', borderRadius: 50,
                  border: `1px solid ${subFilter === cat ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                  background: subFilter === cat ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: subFilter === cat ? '#F59E0B' : '#94A3B8',
                  fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                }}>
                {cat === 'All' ? 'All Stories' : cat === 'Kids' ? '🧸 Kids Stories' : '📚 Adult Novellas'}
              </button>
            ))}
          </div>
        )}

        {/* SEARCH BAR */}
        <div style={{ minWidth: 240 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories, genres, authors..."
            style={{
              width: '100%', padding: '10px 16px', borderRadius: 50,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#F8FAFC', fontSize: '0.85rem', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* ── EMPTY STATE ── */}
      {displayedStories.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px', borderRadius: 20,
          background: 'rgba(18, 19, 26, 0.6)', border: '1px dashed rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>
            {activeRole === 'author' ? '✍️' : activeRole === 'parent' ? '🧸' : '📚'}
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px', color: '#F8FAFC' }}>
            No stories found
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: 420, margin: '0 auto 20px' }}>
            Start creating your own story using Google Gemini AI or write one manually!
          </p>
          <button
            onClick={() => {
              setShowAddStoryModal(true)
              setGeneratedPreview(null)
            }}
            style={{
              padding: '12px 28px', borderRadius: 50, border: 'none',
              background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, cursor: 'pointer'
            }}>
            ✨ Generate New Story with Gemini AI →
          </button>
        </div>
      )}

      {/* ── STORIES GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {displayedStories.map(story => {
          const cover = getStoryCover(story)
          const isKids = story.audience === 'Kids' || story.ageGroup === 'children' || story.ageGroup === 'kids'

          return (
            <div key={story.id || story._id} style={{
              background: 'rgba(18, 19, 26, 0.85)', backdropFilter: 'blur(20px)',
              borderRadius: 20, border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              transition: 'all 0.2s'
            }}>
              <div>
                <div style={{
                  height: '180px',
                  background: `url(${cover}) center/cover no-repeat`,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,11,14,0.9) 0%, transparent 60%)', pointerEvents: 'none' }} />

                  {/* Left Badge: Category */}
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    background: isKids ? 'rgba(6, 182, 212, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                    padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem',
                    color: '#0A0B0E', fontWeight: 900, fontFamily: 'monospace', zIndex: 2,
                    textTransform: 'uppercase'
                  }}>
                    {isKids ? '🧸 KIDS' : '📚 ADULTS'}
                  </div>

                  {/* Right Badge: Pages / Author Upload Tag */}
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: story.isAuthorUploaded ? 'rgba(16, 185, 129, 0.9)' : 'rgba(0,0,0,0.75)',
                    padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem',
                    color: story.isAuthorUploaded ? '#0A0B0E' : '#F59E0B',
                    fontWeight: 800, fontFamily: 'monospace', zIndex: 2
                  }}>
                    {story.isAuthorUploaded ? '✓ YOUR UPLOAD' : `${(story.pages?.length || 4) * 2} BOOK PAGES`}
                  </div>
                </div>

                <div style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 800,
                      color: isKids ? '#06B6D4' : '#F59E0B',
                      textTransform: 'uppercase', fontFamily: 'monospace'
                    }}>
                      {story.genre || 'Adventure'} • {isKids ? 'Kids Category' : 'Adult Category'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{story.readTime || '10 min'}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {story.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '10px' }}>
                    by {story.author || 'Author'}
                  </p>
                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {story.desc || story.description || story.synopsis}
                  </p>
                </div>
              </div>

              {/* Story Actions */}
              <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Primary Automated Animation Generation Action */}
                <button
                  onClick={() => handleStartVideoGeneration(story)}
                  style={{
                    width: '100%', padding: '11px', textAlign: 'center', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', fontWeight: 800, fontSize: '0.86rem',
                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  🎬 Generate Animated Video
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                  <Link to={`/stories/${story.id || story._id}`} style={{
                    padding: '9px', textAlign: 'center', borderRadius: 8,
                    background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, fontSize: '0.82rem',
                    textDecoration: 'none'
                  }}>
                    📖 Open Book
                  </Link>
                  <Link to={`/generate?storyId=${story.id || story._id}&prompt=${encodeURIComponent(story.title + ': ' + (story.desc || story.description || ''))}&style=${isKids ? 'Kids Cartoon' : 'Cinematic'}`} style={{
                    padding: '9px', textAlign: 'center', borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#F8FAFC', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none'
                  }}>
                    ⚙️ Studio
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          1. ADD NEW STORY MODAL (GEMINI AI & CUSTOM)
          ══════════════════════════════════════════════════════════════ */}
      {showAddStoryModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#0F121C', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 24, width: '100%', maxWidth: 740, maxHeight: '90vh',
            overflowY: 'auto', padding: 32, color: '#F8FAFC',
            boxShadow: '0 30px 90px rgba(0,0,0,0.95)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFF', margin: '0 0 4px' }}>
                  ✨ Add New Story to AnimVerse
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
                  Generate with Google Gemini AI or write your custom manuscript.
                </p>
              </div>
              <button
                onClick={() => setShowAddStoryModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Tab Selector */}
            <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 50, marginBottom: 24 }}>
              <button
                type="button"
                onClick={() => setAddTab('gemini')}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 50, border: 'none',
                  background: addTab === 'gemini' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'transparent',
                  color: addTab === 'gemini' ? '#0A0B0E' : '#94A3B8',
                  fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                🤖 Generate with Google Gemini AI
              </button>
              <button
                type="button"
                onClick={() => setAddTab('manual')}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 50, border: 'none',
                  background: addTab === 'manual' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'transparent',
                  color: addTab === 'manual' ? '#0A0B0E' : '#94A3B8',
                  fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                ✍️ Write Custom Story
              </button>
            </div>

            {/* TAB A: GEMINI AI STORY GENERATION */}
            {addTab === 'gemini' && (
              <div>
                {!generatedPreview ? (
                  <form onSubmit={handleGenerateWithGemini}>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#CBD5E1', marginBottom: 6 }}>
                        Story Theme, Idea or Topic *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={geminiPrompt}
                        onChange={e => setGeminiPrompt(e.target.value)}
                        placeholder="e.g. A young girl discovers a floating clockwork bird that can pause time in Kerala backwaters..."
                        style={{
                          width: '100%', padding: '12px 16px', borderRadius: 12, background: '#07090E',
                          border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.9rem', outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 20 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Genre</label>
                        <select
                          value={geminiGenre}
                          onChange={e => setGeminiGenre(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.82rem' }}
                        >
                          <option value="Fairy Tale">Fairy Tale</option>
                          <option value="Moral Story">Moral Story</option>
                          <option value="Sci-Fi">Sci-Fi</option>
                          <option value="Mystery">Mystery</option>
                          <option value="Mythology">Mythology</option>
                          <option value="Adventure">Adventure</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Target Audience</label>
                        <select
                          value={geminiAudience}
                          onChange={e => setGeminiAudience(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.82rem' }}
                        >
                          <option value="Kids">Kids (Children)</option>
                          <option value="Adults">Adults & Teens</option>
                          <option value="All">All Audiences</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Language</label>
                        <select
                          value={geminiLanguage}
                          onChange={e => setGeminiLanguage(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.82rem' }}
                        >
                          <option value="English">English</option>
                          <option value="Malayalam">Malayalam (മലയാളം)</option>
                          <option value="Hindi">Hindi (हिंदी)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Chapters</label>
                        <select
                          value={geminiChapters}
                          onChange={e => setGeminiChapters(Number(e.target.value))}
                          style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.82rem' }}
                        >
                          <option value={3}>3 Chapters</option>
                          <option value={4}>4 Chapters</option>
                          <option value={5}>5 Chapters</option>
                          <option value={6}>6 Chapters</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isGeneratingGemini}
                      style={{
                        width: '100%', padding: '14px', borderRadius: 50, border: 'none',
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0A0B0E',
                        fontWeight: 900, fontSize: '0.95rem', cursor: isGeneratingGemini ? 'wait' : 'pointer',
                        boxShadow: '0 4px 20px rgba(245,158,11,0.3)'
                      }}
                    >
                      {isGeneratingGemini ? '🤖 Gemini AI is Composing Story & Storyboard...' : '✨ Generate Story with Google Gemini AI'}
                    </button>
                  </form>
                ) : (
                  <div>
                    {/* Story Preview Generated */}
                    <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'monospace' }}>
                          ✓ AI GENERATION READY ({generatedPreview.language})
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{generatedPreview.readTime}</span>
                      </div>

                      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', margin: '0 0 6px' }}>
                        {generatedPreview.title}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: 14 }}>
                        {generatedPreview.desc}
                      </p>

                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: 8 }}>
                        <strong>Chapters ({generatedPreview.pages?.length}):</strong>
                      </div>
                      <div style={{ maxHeight: 180, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {generatedPreview.pages?.map((p, idx) => (
                          <div key={idx} style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 12px', borderRadius: 8 }}>
                            <div style={{ fontWeight: 800, color: '#F59E0B', fontSize: '0.8rem' }}>{p.chapter}: {p.title}</div>
                            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: 3 }}>
                              {Array.isArray(p.content) ? p.content[0] : p.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => handleSaveStory(generatedPreview)}
                        disabled={isSaving}
                        style={{
                          flex: 1, padding: '13px', borderRadius: 50, border: 'none',
                          background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white',
                          fontWeight: 900, fontSize: '0.92rem', cursor: isSaving ? 'wait' : 'pointer',
                          boxShadow: '0 4px 16px rgba(16,185,129,0.3)'
                        }}
                      >
                        {isSaving ? 'Saving to Library...' : '💾 Save Story to Library'}
                      </button>

                      <button
                        onClick={() => setGeneratedPreview(null)}
                        style={{
                          padding: '13px 20px', borderRadius: 50,
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                          color: '#CBD5E1', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                        }}
                      >
                        🔄 Re-Generate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB B: MANUAL STORY CREATION */}
            {addTab === 'manual' && (
              <form onSubmit={handleSaveManualStory}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', marginBottom: 4 }}>Story Title *</label>
                  <input
                    type="text" required
                    value={manualForm.title}
                    onChange={e => setManualForm({ ...manualForm, title: e.target.value })}
                    placeholder="e.g. The Mystery of the Star Watcher"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Author</label>
                    <input
                      type="text"
                      value={manualForm.author}
                      onChange={e => setManualForm({ ...manualForm, author: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Audience</label>
                    <select
                      value={manualForm.audience}
                      onChange={e => setManualForm({ ...manualForm, audience: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.82rem' }}
                    >
                      <option value="Kids">Kids</option>
                      <option value="Adults">Adults</option>
                      <option value="All">All</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Language</label>
                    <select
                      value={manualForm.language}
                      onChange={e => setManualForm({ ...manualForm, language: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.82rem' }}
                    >
                      <option value="English">English</option>
                      <option value="Malayalam">Malayalam</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', marginBottom: 4 }}>Short Synopsis</label>
                  <input
                    type="text"
                    value={manualForm.desc}
                    onChange={e => setManualForm({ ...manualForm, desc: e.target.value })}
                    placeholder="Brief 1-2 sentence overview of the plot..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', marginBottom: 4 }}>
                    Story Content / Chapters (Separate chapters with blank lines) *
                  </label>
                  <textarea
                    rows={6} required
                    value={manualForm.content}
                    onChange={e => setManualForm({ ...manualForm, content: e.target.value })}
                    placeholder="Chapter 1 content goes here...&#10;&#10;Chapter 2 content continues here..."
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none', fontSize: '0.88rem' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    width: '100%', padding: '13px', borderRadius: 50, border: 'none',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0A0B0E',
                    fontWeight: 900, fontSize: '0.92rem', cursor: isSaving ? 'wait' : 'pointer'
                  }}
                >
                  {isSaving ? 'Saving Story...' : '💾 Save Story & Continue'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          2. POST-SAVE CONFIRMATION & ANIMATION PROMPT MODAL
          ══════════════════════════════════════════════════════════════ */}
      {savedStoryModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#0F121C', border: '1px solid rgba(16,185,129,0.5)',
            borderRadius: 24, width: '100%', maxWidth: 580, padding: 36, color: '#FFF',
            textAlign: 'center', boxShadow: '0 25px 80px rgba(0,0,0,0.95)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 8px', color: '#10B981' }}>
              Story Saved Successfully!
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '1rem', lineHeight: 1.6, marginBottom: 24 }}>
              <strong>"{savedStoryModal.title}"</strong> is now saved in your AnimVerse Story Library.
              Would you like to automatically convert it into a fully animated video?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => handleStartVideoGeneration(savedStoryModal)}
                style={{
                  padding: '14px 28px', borderRadius: 50, border: 'none',
                  background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white',
                  fontWeight: 900, fontSize: '1rem', cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(16,185,129,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                }}
              >
                🎬 Generate Animated Video for this Story →
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Link
                  to={`/stories/${savedStoryModal.id || savedStoryModal._id}`}
                  style={{
                    padding: '12px', borderRadius: 50, textAlign: 'center',
                    background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, fontSize: '0.85rem',
                    textDecoration: 'none'
                  }}
                >
                  📖 Read Story Book
                </Link>

                <button
                  onClick={() => setSavedStoryModal(null)}
                  style={{
                    padding: '12px', borderRadius: 50,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#94A3B8', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          3. STORY TO ANIMATED VIDEO LIVE PIPELINE & RESULT MODAL
          ══════════════════════════════════════════════════════════════ */}
      {animatingStory && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999999,
          background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(24px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#0F121C', border: '1px solid rgba(245,158,11,0.4)',
            borderRadius: 28, width: '100%', maxWidth: 780, maxHeight: '90vh',
            overflowY: 'auto', padding: 36, color: '#FFF',
            boxShadow: '0 30px 100px rgba(0,0,0,0.98)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>
                  🎬 AI STORY ANIMATION ENGINE
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFF', margin: 0 }}>
                  {animatingStory.title}
                </h2>
              </div>

              {!isRenderingVideo && (
                <button
                  onClick={() => setAnimatingStory(null)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.4rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* LIVE GENERATION PROGRESS VIEW */}
            {isRenderingVideo && (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
                  border: '4px solid rgba(245,158,11,0.2)', borderTopColor: '#F59E0B',
                  animation: 'spin 1s linear infinite'
                }} />

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 8, color: '#F8FAFC' }}>
                  {animationProgress.text}
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.88rem', maxWidth: 460, margin: '0 auto 24px' }}>
                  Translating characters, scenes, dialogues, actions, and vocal narration into an animated multi-scene render.
                </p>

                {/* Progress Bar */}
                <div style={{ width: '100%', maxWidth: 500, height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 50, margin: '0 auto', overflow: 'hidden' }}>
                  <div style={{
                    width: `${animationProgress.pct}%`, height: '100%',
                    background: 'linear-gradient(90deg, #F59E0B, #10B981)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800, marginTop: 8 }}>
                  {animationProgress.pct}% Completed
                </div>
              </div>
            )}

            {/* VIDEO GENERATION COMPLETED VIEW */}
            {animationResult && !isRenderingVideo && (
              <div>
                {/* Video Player */}
                <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', marginBottom: 24, background: '#000', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <video
                    src={animationResult.videoUrl || '/videos/scene_1.mp4'}
                    controls
                    autoPlay
                    style={{ width: '100%', maxHeight: 380, display: 'block' }}
                  />
                </div>

                {/* Scene breakdown count */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '12px 18px', borderRadius: 12, marginBottom: 24 }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981' }}>✓ Multi-Scene Video Generated:</span>
                    <span style={{ fontSize: '0.85rem', color: '#CBD5E1', marginLeft: 8 }}>{animationResult.scenes?.length || 4} Animated Scenes</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#F59E0B', fontWeight: 800 }}>Engine: {animationResult.engineName || 'LTX Studio'}</span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
                  <button
                    onClick={() => {
                      setAnimatingStory(null)
                      navigate('/projects')
                    }}
                    style={{
                      padding: '14px', borderRadius: 50, border: 'none',
                      background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white',
                      fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer',
                      boxShadow: '0 6px 20px rgba(16,185,129,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    🎬 Open in Animated Videos Section →
                  </button>

                  <button
                    onClick={() => {
                      setAnimatingStory(null)
                      navigate(`/generate?storyId=${animatingStory.id || animatingStory._id}`)
                    }}
                    style={{
                      padding: '14px', borderRadius: 50,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer'
                    }}
                  >
                    ⚙️ Open in Animation Studio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  )
}
