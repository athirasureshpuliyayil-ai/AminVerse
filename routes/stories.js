const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const { protect, authorize } = require('../middleware/auth');

// Default initial stories with multi-page structure for auto-seeding
const DEFAULT_STORIES = [
  {
    title: "The Brave Little Rabbit",
    author: "AnimVerse Team",
    audience: "Kids",
    genre: "Fairy Tale",
    ageGroup: "children",
    icon: "🐇",
    color: "#FFD60A",
    coverImage: "/images/stories/brave_rabbit.jpg",
    desc: "A tiny rabbit named Barnaby discovers courage when Whispering Woods is threatened by Pyrrhus the dragon.",
    readTime: "12 min",
    readingTime: 12,
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
    ]
  },
  {
    title: "Midnight at Blackwood Manor",
    author: "A.K. Vortex",
    audience: "Adults",
    genre: "Mystery",
    ageGroup: "adult",
    icon: "🏚️",
    color: "#546E7A",
    coverImage: "/images/stories/blackwood_manor.jpg",
    desc: "Detective Julian Vance uncovers a labyrinth of corporate blackmail, hidden chambers, and coded clockwork in a storm-isolated Victorian estate.",
    readTime: "22 min",
    readingTime: 22,
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
    ]
  },
  {
    title: "Echoes of the Quantum Void",
    author: "Dr. Aris Vance",
    audience: "Adults",
    genre: "Sci-Fi",
    ageGroup: "adult",
    icon: "🌌",
    color: "#06B6D4",
    coverImage: "/images/stories/quantum_void.jpg",
    desc: "An astrophysicist intercepts deep-space quantum signals that rewrite the laws of gravity, unlocking temporal memory arrays from a dying galaxy.",
    readTime: "25 min",
    readingTime: 25,
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
    ]
  }
];

const ensureStructuredPages = (storyData) => {
  let pages = storyData.pages || [];
  if (!Array.isArray(pages) || pages.length === 0 || pages.every(p => !p.content || p.content.length === 0)) {
    const raw = storyData.content || storyData.description || storyData.desc || '';
    if (raw) {
      const paras = raw.split(/\r?\n\s*\r?\n|\r?\n/).map(p => p.trim()).filter(Boolean);
      pages = [];
      for (let i = 0; i < paras.length; i += 2) {
        const chunk = paras.slice(i, i + 2);
        const chNum = Math.floor(i / 2) + 1;
        pages.push({
          chapter: `Chapter ${chNum}`,
          title: chNum === 1 ? 'The Awakening' : chNum === 2 ? 'The Deep Adventure' : chNum === 3 ? 'The Decisive Climax' : `Journey Continued`,
          content: chunk
        });
      }
    }
  }
  return pages.length > 0 ? pages : [{ chapter: 'Chapter 1', title: 'Beginning', content: [storyData.desc || storyData.description || 'Story beginning...'] }];
};

// @route   GET /api/stories
// @desc    Get all stories stored in MongoDB (auto-seeds defaults if empty)
router.get('/', async (req, res) => {
  try {
    let stories = await Story.find().sort('-createdAt');

    // Auto-seed if database is empty
    if (stories.length === 0) {
      await Story.insertMany(DEFAULT_STORIES);
      stories = await Story.find().sort('-createdAt');
    }

    const formattedStories = stories.map(s => {
      const obj = s.toObject();
      obj.pages = ensureStructuredPages(obj);
      return obj;
    });

    res.json({ success: true, count: formattedStories.length, data: formattedStories });
  } catch (error) {
    console.error('Error fetching stories from MongoDB:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/stories/:id
// @desc    Get single story from MongoDB
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found in MongoDB' });
    }
    const obj = story.toObject();
    obj.pages = ensureStructuredPages(obj);
    res.json({ success: true, data: obj });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Story not found in MongoDB' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getOptionalUser = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'animverse_ai_super_secret_jwt_key_2024');
      if (decoded && decoded.id) {
        return await User.findById(decoded.id);
      }
    }
  } catch {
    // optional token failure ignored
  }
  return null;
};

// @route   POST /api/stories
// @desc    Add new story into MongoDB (Supports all user roles and guests)
router.post('/', async (req, res) => {
  try {
    const {
      title, author, description, desc, content, genre, audience, language,
      ageGroup, pages, fullContent, readTime, readingTime, rating, icon, color, coverImage
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({ success: false, message: 'Title and author are required' });
    }

    const user = await getOptionalUser(req);

    const structuredPages = ensureStructuredPages({ pages, content, description, desc });
    const fullParas = Array.isArray(fullContent) && fullContent.length > 0
      ? fullContent
      : structuredPages.flatMap(p => p.content);

    const newStory = await Story.create({
      title: title.trim(),
      author: author.trim(),
      description: description || desc || '',
      desc: desc || description || '',
      content: content || (Array.isArray(fullParas) ? fullParas.join('\n\n') : ''),
      genre: genre || 'Fantasy',
      language: language || 'English',
      audience: audience || 'All',
      ageGroup: ageGroup || (audience === 'Kids' ? 'kids' : 'adult'),
      coverImage: coverImage || '',
      pages: structuredPages,
      fullContent: fullParas,
      readTime: readTime || `${Math.max(4, Math.ceil(fullParas.join(' ').split(' ').length / 100))} min`,
      readingTime: readingTime || 10,
      rating: rating || 4.8,
      icon: icon || (audience === 'Kids' ? '🧸' : '📖'),
      color: color || '#F59E0B',
      addedBy: user ? user._id : undefined
    });

    res.status(201).json({
      success: true,
      data: newStory,
      message: 'Story successfully stored in MongoDB'
    });
  } catch (error) {
    console.error('Error creating story in MongoDB:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/stories/:id
// @desc    Delete story from MongoDB
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    await story.deleteOne();
    res.json({ success: true, message: 'Story deleted from MongoDB' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
