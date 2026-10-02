const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const MuseumExhibit = require('../models/Museum');
const { protect, authorize } = require('../middleware/auth');

// Ensure upload directory exists
const museumUploadDir = path.join(__dirname, '../public/uploads/museum');
if (!fs.existsSync(museumUploadDir)) {
  fs.mkdirSync(museumUploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, museumUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'exhibit-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|mp3|wav|ogg|m4a/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      return cb(null, true);
    }
    cb(new Error('Only images and audio files are supported'));
  }
});

// Comprehensive seed collection representing the 7 main museum wings in authentic languages
const DEFAULT_MUSEUM_EXHIBITS = [
  // ── 1. MALAYALAM LITERATURE (മലയാള സാഹിത്യം) ──
  {
    title: 'തുഞ്ചത്ത് എഴുത്തച്ഛനും കിളിപ്പാട്ട് പ്രസ്ഥാനവും',
    subtitle: 'മലയാള ഭാഷയുടെയും ആധുനിക സാഹിത്യത്തിന്റെയും പിതാവ്',
    room: 'Malayalam Literature',
    category: 'ഇതിഹാസ കാവ്യം (Epic Poetry)',
    author: 'തുഞ്ചത്ത് രാമാനുജൻ എഴുത്തച്ഛൻ',
    era: '16-ാം നൂറ്റാണ്ട് (16th Century CE)',
    language: 'Malayalam',
    ageGroup: 'all',
    keyWorks: ['അദ്ധ്യാത്മ രാമായണം കിളിപ്പാട്ട്', 'മഹാഭാരതം കിളിപ്പാട്ട്', 'ഹരിനാമകീർത്തനം', 'ചിന്താരത്നം'],
    quote: 'ശ്രീരാമ നാമം ജപിച്ചുകൊള്ളുവിൻ... ജീവന്റെ നാഥൻ സദാ തുണയേകും.',
    description: 'മലയാള അക്ഷരമാലയെ ക്രമപ്പെടുത്തിയും കിളിപ്പാട്ട് രീതിയിലൂടെ സാഹിത്യത്തെ ജനകീയമാക്കിയും ഭാഷാ നവോത്ഥാനം സൃഷ്ടിച്ച എഴുത്തച്ഛന്റെ ചരിത്രം.',
    content: [
      'പതിനാറാം നൂറ്റാണ്ടിൽ ജീവിച്ചിരുന്ന തുഞ്ചത്ത് രാമാനുജൻ എഴുത്തച്ഛനാണ് ആധുനിക മലയാള ഭാഷയുടെ പിതാവ് എന്ന് ആദരിക്കപ്പെടുന്നത്. സംസ്കൃത ആധിപത്യമുള്ള മണിപ്രവാള ശൈലിയിൽ നിന്നും ലളിതമായ ജനകീയ ഭാഷയിലേക്ക് സാഹിത്യത്തെ അദ്ദേഹം പരിവർത്തിപ്പിച്ചു.',
      'കിളിപ്പാട്ട് രീതിയിൽ രചിക്കപ്പെട്ട അദ്ധ്യാത്മ രാമായണവും മഹാഭാരതവും കേരളത്തിലെ വീടുകളിൽ നിത്യപാരായണമായി മാറി. 51 അക്ഷരങ്ങളുള്ള ആര്യ-എഴുത്ത് ലിപി പ്രചരിപ്പിച്ച് മലയാള വ്യാകരണത്തിനും അക്ഷരമാലയ്ക്കും ഏകീകൃത രൂപം നൽകിയത് അദ്ദേഹമാണ്.',
      'ഈ ഗാലറിയിൽ പുരാതന താളിയോല ഗ്രന്ഥങ്ങൾ, എഴുത്താണി, രാമായണ പാരായണ ഈണങ്ങൾ, പൗരാണിക ലിപി ചരിത്രങ്ങൾ എന്നിവ ദൃശ്യ-ശ്രാവ്യ മാധ്യമങ്ങളിലൂടെ ആസ്വദിക്കാം.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#F59E0B',
    tags: ['malayalam', 'kilippattu', 'ezhuthachan', 'epic', 'renaissance'],
    featured: true,
    order: 1,
    isPublished: true
  },
  {
    title: 'വൈക്കം മുഹമ്മദ് ബഷീർ: ബേപ്പൂർ സുൽത്താൻ',
    subtitle: 'മാനവികതയുടെയും ലളിതഭാഷണത്തിന്റെയും മാന്ത്രികൻ',
    room: 'Malayalam Literature',
    category: 'ആധുനിക ഫിക്ഷൻ (Modern Fiction)',
    author: 'വൈക്കം മുഹമ്മദ് ബഷീർ',
    era: 'ആധുനിക യുഗം (1908–1994)',
    language: 'Malayalam',
    ageGroup: 'all',
    keyWorks: ['ബാല്യകാലസഖി', 'പാത്തുമ്മയുടെ ആട്', 'മതിലുകൾ', 'ന്റുപ്പൂപ്പാക്കൊരാനേണ്ടാർന്നു', 'ശബ്ദങ്ങൾ', 'അനർഘനിമിഷം'],
    quote: 'ഭൂമിയുടെ അവകാശികൾ മനുഷ്യർ മാത്രമല്ല, സർവ്വ ചരാചരങ്ങളുമാണ്.',
    description: 'ബേപ്പൂരിലെ മാങ്കോസ്റ്റിൻ മരത്തണലിലിരുന്ന് ഗ്രാമഫോൺ സംഗീതം കേട്ട് സർവ്വ ചരാചരങ്ങൾക്കും സ്നേഹം പകർന്നുനൽകിയ ബഷീറിയൻ വിശ്വസാഹിത്യ ലോകം.',
    content: [
      'ജീവിതാനുഭവങ്ങളുടെ തീച്ചൂളയിൽ നിന്നും സാധാരണ മനുഷ്യരുടെ വേദനകളും ആർദ്രമായ നർമ്മവും പകർത്തിയെഴുതിയ മലയാളത്തിന്റെ പ്രിയങ്കരനായ സാഹിത്യകാരനാണ് ബേപ്പൂർ സുൽത്താൻ എന്നറിയപ്പെടുന്ന വൈക്കം മുഹമ്മദ് ബഷീർ.',
      'മജീദിന്റെയും സുഹ്റയുടെയും തീവ്രപ്രണയം പറഞ്ഞ ബാല്യകാലസഖിയും, സ്വന്തം കുടുംബത്തിലെ പച്ചയായ ജീവിതം ചിരിയും കണ്ണീരുമായി അവതരിപ്പിച്ച പാത്തുമ്മയുടെ ആടും മലയാള സാഹിത്യത്തിന്റെ എക്കാലത്തെയും ക്ലാസിക്കുകളാണ്.',
      'ബഷീറിന്റെ കയ്യെഴുത്തുപ്രതികൾ, അദ്ദേഹത്തിന്റെ ചരിത്രപ്രസിദ്ധമായ ഗ്രാമഫോൺ, ബേപ്പൂരിലെ സാഹിത്യ സദസ്സുകളുടെ അപൂർവ ചിത്രങ്ങൾ എന്നിവ ഇവിടെ പ്രദർശിപ്പിച്ചിരിക്കുന്നു.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#10B981',
    tags: ['malayalam', 'basheer', 'beypore', 'novels', 'humanism'],
    featured: true,
    order: 2,
    isPublished: true
  },
  {
    title: 'മഹാകവി കുമാരനാശാൻ: വീണപൂവും നവോത്ഥാനവും',
    subtitle: 'സ്നേഹഗായകനും സാമൂഹിക നവോത്ഥാന നായകനും',
    room: 'Malayalam Literature',
    category: 'കാല്പനിക കവിത (Romantic Poetry)',
    author: 'മഹാകവി കുമാരനാശാൻ',
    era: 'ആധുനിക നവോത്ഥാനം (1873–1924)',
    language: 'Malayalam',
    ageGroup: 'all',
    keyWorks: ['വീണപൂവ്', 'കരുണ', 'ചണ്ഡാലഭിക്ഷുകി', 'ദുരവസ്ഥ', 'നളിനി', 'ലീല'],
    quote: 'ഹാ പുഷ്പമേ, അധികതുംഗപദത്തിലെത്ര ശോഭിച്ചിരുന്നിതൊരു രാജ്ഞികണക്കയേ നീ!',
    description: 'ഒരു പൂവിന്റെ ജനനം മുതൽ മരണം വരെയുള്ള ജീവിതത്തിലൂടെ മനുഷ്യ ജീവിതത്തിന്റെ നശ്വരതയെ വർണ്ണിക്കുകയും ജാതിവ്യവസ്ഥയ്ക്കെതിരെ വിപ്ലവം സൃഷ്ടിക്കുകയും ചെയ്ത മഹാകവി.',
    content: [
      '1907-ൽ പ്രസിദ്ധീകരിച്ച വീണപൂവ് എന്ന അനശ്വര ഖണ്ഡകാവ്യത്തിലൂടെ മലയാള കവിതയിൽ കാല്പനിക യുഗത്തിന് തുടക്കം കുറിച്ച കവിശ്രേഷ്ഠനാണ് കുമാരനാശാൻ.',
      'ശ്രീനാരായണഗുരുവിന്റെ പ്രിയശിഷ്യനായിരുന്ന അദ്ദേഹം ദുരവസ്ഥ, ചണ്ഡാലഭിക്ഷുകി തുടങ്ങിയ കൃതികളിലൂടെ ജാതീയമായ അസമത്വങ്ങളെയും അനാചാരങ്ങളെയും ശക്തമായി എതിർത്തു തോൽപ്പിച്ചു.',
      'സ്നേഹമാണ് അഖിലസാരമൂഴിയിൽ എന്ന് പാടിയ ആശാന്റെ കവിതാ ഭാഗങ്ങളും അപൂർവ്വ കാവ്യരേഖകളും ഇവിടെ കാണാം.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#06B6D4',
    tags: ['malayalam', 'kumaran asan', 'veena poovu', 'poetry', 'renaissance'],
    featured: false,
    order: 3,
    isPublished: true
  },
  {
    title: 'തകഴി ശിവശങ്കരപ്പിള്ള: കുട്ടനാടിന്റെ ഇതിഹാസകാരൻ',
    subtitle: 'തീരദേശ ജീവിതവും കർഷക തൊഴിലാളി മുന്നേറ്റങ്ങളും',
    room: 'Malayalam Literature',
    category: 'റിയലിസ്റ്റിക് ഫിക്ഷൻ (Realistic Fiction)',
    author: 'തകഴി ശിവശങ്കരപ്പിള്ള',
    era: 'ജ്ഞാനപീഠ യുഗം (1912–1999)',
    language: 'Malayalam',
    ageGroup: 'all',
    keyWorks: ['ചെമ്മീൻ', 'കയർ', 'രണ്ടിടങ്ങഴി', 'തോട്ടിയിടെ മകൻ', 'ഏണിപ്പടികൾ'],
    quote: 'കടലമ്മയുടെ മക്കൾക്ക് കടലാണ് ജീവനും ജീവിതവും.',
    description: 'കുട്ടനാട്ടിലെ നെൽപ്പാടങ്ങളിലെയും തീരദേശ മുക്കുവരുടെയും പച്ചയായ ജീവിത യാഥാർത്ഥ്യങ്ങൾ വിശ്വസാഹിത്യത്തിലേക്ക് ഉയർത്തിയ ജ്ഞാനപീഠ ജേതാവ്.',
    content: [
      'തകഴിയുടെ ചെമ്മീൻ എന്ന നോവൽ ലോകത്തിലെ നിരവധി ഭാഷകളിലേക്ക് വിവർത്തനം ചെയ്യപ്പെടുകയും സിനിമയായി രാഷ്ട്രപതിയുടെ സുവർണ്ണ കമലം നേടുകയും ചെയ്ത വിശ്വോത്തര കൃതിയാണ്.',
      'പുന്നപ്ര വയലാർ സമരവും കുട്ടനാട്ടിലെ കർഷകത്തൊഴിലാളികളുടെ ചരിത്രവും പറയുന്ന കയർ, രണ്ടിടങ്ങഴി എന്നിവ മലയാള സാഹിത്യത്തിലെ മഹാപ്രസ്ഥാനങ്ങളാണ്.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#EF4444',
    tags: ['malayalam', 'thakazhi', 'chemmeen', 'kuttanad', 'realism'],
    featured: false,
    order: 4,
    isPublished: true
  },

  // ── 2. ENGLISH LITERATURE ──
  {
    title: 'William Shakespeare & The Globe Theatre',
    subtitle: 'The Universal Mirror of Human Passion',
    room: 'English Literature',
    category: 'Elizabethan Drama',
    author: 'William Shakespeare',
    era: 'Elizabethan & Jacobean Era (1564–1616)',
    language: 'English',
    ageGroup: 'all',
    keyWorks: ['Hamlet', 'Macbeth', 'Romeo and Juliet', 'The Tempest', 'Sonnets'],
    quote: 'All the world\'s a stage, and all the men and women merely players.',
    description: 'Step into the wooden O of the Globe Theatre on London\'s Bankside, where Shakespeare forged over 1,700 English words and immortalized human ambition, tragedy, and comedy.',
    content: [
      'William Shakespeare remains the defining pillar of English literature. His 39 plays and 154 sonnets explored the intricate depths of jealousy, destiny, power, love, and madness in timeless iambic pentameter.',
      'His innovative syntax expanded the English language forever, coining enduring phrases such as "break the ice", "heart of gold", and "brave new world".',
      'This gallery features a 3D digital recreation of Elizabethan staging techniques, original First Folio print sheets (1623), and interactive soliloquy audio recordings.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#8B5CF6',
    tags: ['english', 'shakespeare', 'theatre', 'drama', 'classics'],
    featured: true,
    order: 5,
    isPublished: true
  },
  {
    title: 'Jane Austen: Irony, Society, and Moral Grace',
    subtitle: 'The Master of the English Comedy of Manners',
    room: 'English Literature',
    category: 'Regency Fiction',
    author: 'Jane Austen',
    era: 'Regency Era (1775–1817)',
    language: 'English',
    ageGroup: 'all',
    keyWorks: ['Pride and Prejudice', 'Sense and Sensibility', 'Emma', 'Persuasion'],
    quote: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    description: 'An elegant gallery dissecting Austen\'s sharp wit, psychological realism, and incandescent character studies of 19th-century British society.',
    content: [
      'Writing from her small 12-sided walnut table in Chawton cottage, Jane Austen created novels that blended sparkling humor with penetrating critique of social mobility, gender economics, and moral maturity.',
      'Through free indirect discourse, Austen pioneered modern novelistic interiority—letting readers inhabit Elizabeth Bennet and Emma Woodhouse\'s inner contemplation with unmatched intimacy.',
      'Exhibits include Regency manuscript replicas, letters with her sister Cassandra, and fashion sketches illuminating early 19th-century drawing room life.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#EC4899',
    tags: ['english', 'austen', 'regency', 'novels', 'realism'],
    featured: false,
    order: 6,
    isPublished: true
  },
  {
    title: 'Charles Dickens & The Industrial Heartbeat',
    subtitle: 'Social Conscience and London Shadows',
    room: 'English Literature',
    category: 'Victorian Realism',
    author: 'Charles Dickens',
    era: 'Victorian Era (1812–1870)',
    language: 'English',
    ageGroup: 'all',
    keyWorks: ['A Tale of Two Cities', 'Great Expectations', 'Oliver Twist', 'David Copperfield'],
    quote: 'It was the best of times, it was the worst of times...',
    description: 'Venture into the gas-lit alleys and bustling wharves of Victorian London, where Dickens used serialized fiction to fight poverty, child labor, and institutional cruelty.',
    content: [
      'Charles Dickens utilized the power of serial publication to reach hundreds of thousands of readers across Victorian Britain and America, keeping society captivated week after week.',
      'His vivid cast of characters—from Ebenezer Scrooge to Pip and Miss Havisham—became permanent archetypes of moral transformation, redemption, and societal empathy.',
      'Visitors can view period illustrations by Phiz and Cruikshank, printing press movable type blocks, and historical maps of 1850s London.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#F97316',
    tags: ['english', 'dickens', 'victorian', 'london', 'novels'],
    featured: false,
    order: 7,
    isPublished: true
  },

  // ── 3. HINDI LITERATURE (हिंदी साहित्य) ──
  {
    title: 'मुंशी प्रेमचंद: उपन्यास सम्राट और ग्रामीण भारत की आत्मा',
    subtitle: 'गोदान, गबन और यथार्थवादी साहित्य के अग्रदूत',
    room: 'Hindi Literature',
    category: 'सामाजिक यथार्थवाद (Social Realism)',
    author: 'मुंशी प्रेमचंद',
    era: '20वीं सदी का पूर्वार्ध (1880–1936)',
    language: 'Hindi',
    ageGroup: 'all',
    keyWorks: ['गोदान', 'निर्मला', 'गबन', 'कफ़न', 'ईदगाह', 'पूस की रात'],
    quote: 'साहित्य जीवन की आलोचना है, चाहे वह निबंध के रूप में हो या कहानी अथवा नाटक के रूप में।',
    description: 'भारतीय ग्रामीण जीवन, किसानों के संघर्ष और मानवीय संवेदनाओं को हिंदी-उर्दू साहित्य के शिखर तक पहुंचाने वाले उपन्यास सम्राट प्रेमचंद की अमर विरासत।',
    content: [
      'मुंशी प्रेमचंद को हिंदी और उर्दू साहित्य का "उपन्यास सम्राट" माना जाता है। उन्होंने काल्पनिक और तिलस्मी कहानियों के युग को समाप्त कर साहित्य को समाज की कड़वी सच्चाइयों से जोड़ा।',
      'होरी, धनिया, हामिद और घीसू-माधव जैसे पात्रों के माध्यम से उन्होंने किसान जीवन, जातिगत भेदभाव, अनमेल विवाह और निर्धनता की मार्मिक व्याख्या प्रस्तुत की।',
      'इस दीर्घा में प्रेमचंद जी की पत्रिका "हंस" के दुर्लभ अंक, उनके हस्तलिखित पत्र और "ईदगाह" की प्रसिद्ध कहानी के ऑडियो अंश उपलब्ध हैं।'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#EF4444',
    tags: ['hindi', 'premchand', 'godan', 'realism', 'classics'],
    featured: true,
    order: 8,
    isPublished: true
  },
  {
    title: 'संत कबीर दास: साखी, सबद और भक्ति के अमर दोहे',
    subtitle: 'सत्य, प्रेम और सार्वभौमिक एकता के सूफी-भक्त कवि',
    room: 'Hindi Literature',
    category: 'भक्ति काव्य (Bhakti Poetry)',
    author: 'कबीर दास',
    era: '15वीं शताब्दी (15th Century CE)',
    language: 'Hindi',
    ageGroup: 'all',
    keyWorks: ['बीजक', 'कबीर ग्रंथावली', 'साखी', 'अनुराग सागर'],
    quote: 'पोथी पढ़ि पढ़ि जग मुआ, पंडित भया न कोय। ढाई आखर प्रेम का, पढ़े सो पंडित होय॥',
    description: 'साधारण जुलाहे के रूप में जीवन व्यतीत करते हुए सामाजिक रूढ़ियों और पाखंड पर प्रहार करने वाले संत कबीर के अमर दोहे।',
    content: [
      '15वीं शताब्दी के महान संत और रहस्यवादी कवि कबीर दास ने सधुक्कड़ी भाषा में दोहों की रचना कर समाज को मानवता, करुणा और आत्मानुभूति का मार्ग दिखाया।',
      'उनके पदों में बाह्य आडंबरों, धार्मिक कट्टरता और सामाजिक विभाजन का तीव्र विरोध था। उन्होंने समझाया कि ईश्वर मंदिर या मस्जिद में नहीं, बल्कि प्रत्येक प्राणी के हृदय में निवास करता है।',
      'प्रदर्शनी में तानपूरे पर गाए गए कबीर के शास्त्रीय भजन, दोहों के सुलेखन पत्र और भक्ति आंदोलन के ऐतिहासिक दस्तावेज संकलित हैं।'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#D97706',
    tags: ['hindi', 'kabir', 'dohas', 'bhakti', 'philosophy'],
    featured: false,
    order: 9,
    isPublished: true
  },
  {
    title: 'महादेवी वर्मा: आधुनिक मीरा और छायावाद की अमर वाणी',
    subtitle: 'ज्ञानपीठ पुरस्कार विजेता एवं रहस्यवादी कवयित्री',
    room: 'Hindi Literature',
    category: 'छायावादी काव्य (Chhayavaad)',
    author: 'महादेवी वर्मा',
    era: 'छायावाद युग (1907–1987)',
    language: 'Hindi',
    ageGroup: 'all',
    keyWorks: ['यामा', 'नीहार', 'रश्मि', 'नीरजा', 'स्मृति की रेखाएं', 'गिल्लू'],
    quote: 'मैं नीर भरी दुख की बदली! विस्तृत नभ का कोई कोना, मेरा न कभी अपना होना...',
    description: 'हिंदी साहित्य के छायावादी युग के चार प्रमुख स्तंभों में से एक, जिन्होंने गीतों में वेदना, करुणा और प्रकृति के रहस्यमयी सौंदर्य को अमर बना दिया।',
    content: [
      'महादेवी वर्मा को आधुनिक युग की मीरा कहा जाता है। 1982 में उनके प्रसिद्ध काव्य संकलन "यामा" के लिए उन्हें प्रतिष्ठित ज्ञानपीठ पुरस्कार से सम्मानित किया गया था।',
      'कविताओं के अतिरिक्त उनके संस्मरण जैसे "स्मृति की रेखाएं", "पथ के साथी" और "मेरा परिवार" (जिसमें गिल्लू गिलहरी का रेखाचित्र शामिल है) मानवीय संवेदनशीलता के अनुपम उदाहरण हैं।'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#8B5CF6',
    tags: ['hindi', 'mahadevi varma', 'chhayavaad', 'poetry', 'jnanpith'],
    featured: false,
    order: 10,
    isPublished: true
  },

  // ── 4. POETRY (കവിതകൾ / कविताएं / POETRY) ──
  {
    title: 'ഒ. എൻ. വി. കുറുപ്പ്: ഭൂമിയുടെയും പ്രകൃതിയുടെയും ഗായകൻ',
    subtitle: 'ജ്ഞാനപീഠ പുരസ്കാര ജേതാവായ മലയാളത്തിന്റെ കാവ്യവസന്തം',
    room: 'Poetry',
    category: 'ഗാനകാവ്യം (Lyric Poetry)',
    author: 'ഒ. എൻ. വി. കുറുപ്പ്',
    era: 'ആധുനിക യുഗം (1931–2016)',
    language: 'Malayalam',
    ageGroup: 'all',
    keyWorks: ['ഭൂമിക്കൊരു ചരമഗീതം', 'ഉജ്ജയിനി', 'കറുത്ത പക്ഷിയുടെ പാട്ട്', 'അക്ഷരം', 'മരുഭൂമി'],
    quote: 'ഇനിയും മരിക്കാത്ത ഭൂമി നിന്നാസന്ന മൃതിയില്‍ നിനക്കാത്മശാന്തി നേരുന്നു...',
    description: 'പരിസ്ഥിതി സംരക്ഷണത്തിനും സ്നേഹത്തിനും മാനവികതയ്ക്കും വേണ്ടി അനശ്വര കാവ്യങ്ങൾ രചിച്ച ഒ. എൻ. വി. കുറുപ്പിന്റെ കാവ്യലോകം.',
    content: [
      'മലയാള ഭാഷയ്ക്ക് ശ്രേഷ്ഠഭാഷാ പദവിയും ജ്ഞാനപീഠ പുരസ്കാരവും നേടിത്തന്ന പ്രമുഖ കവിയാണ് ഒ. എൻ. വി. കുറുപ്പ്. കാവ്യഭംഗിയും ഗാനമാധുര്യവും ഒത്തുചേർന്ന അദ്ദേഹത്തിന്റെ രചനകൾ മലയാളിയുടെ ഹൃദയത്തിൽ കുടിയേറി.',
      '1984-ൽ രചിച്ച "ഭൂമിക്കൊരു ചരമഗീതം" എന്ന കവിത മനുഷ്യന്റെ പ്രകൃതി ചൂഷണത്തിനെതിരെയുള്ള ലോകോത്തരമായ പരിസ്ഥിതി മുന്നറിയിപ്പായിരുന്നു.',
      'ഒ. എൻ. വിയുടെ സ്വന്തം ശബ്ദത്തിലുള്ള കവിതാപാരായണങ്ങളും കാവ്യരേഖകളും ഇവിടെ കേൾക്കാം.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#10B981',
    tags: ['poetry', 'onv kurup', 'malayalam', 'nature', 'ecology'],
    featured: true,
    order: 11,
    isPublished: true
  },
  {
    title: 'Rabindranath Tagore: Gitanjali & Universal Song',
    subtitle: 'Asia\'s First Nobel Laureate in Literature',
    room: 'Poetry',
    category: 'Mystic Lyricism',
    author: 'Rabindranath Tagore (Gurudev)',
    era: 'Bengal Renaissance (1861–1941)',
    language: 'English',
    ageGroup: 'all',
    keyWorks: ['Gitanjali (Song Offerings)', 'The Gardener', 'Kabuliwala', 'Gora'],
    quote: 'Where the mind is without fear and the head is held high; where knowledge is free...',
    description: 'Immerse in the incandescent spiritual songs and global humanist philosophy of Gurudev Tagore, who composed anthems for two nations and transformed world literature.',
    content: [
      'In 1913, Rabindranath Tagore was awarded the Nobel Prize in Literature for Gitanjali, celebrated by W.B. Yeats for its profound simplicity and spiritual ecstasy.',
      'Tagore was a polymath who founded Visva-Bharati University in Santiniketan, composed over 2,200 Rabindra Sangeet songs, and championed open-air education rooted in art and nature.',
      'Exhibits feature original English and Bengali calligraphic manuscripts, paintings by Tagore, and recordings of his universal prayer.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#F59E0B',
    tags: ['poetry', 'tagore', 'gitanjali', 'nobel', 'renaissance'],
    featured: false,
    order: 12,
    isPublished: true
  },
  {
    title: 'John Keats: Beauty, Truth, and the Immortal Ode',
    subtitle: 'The Radiance of English Romanticism',
    room: 'Poetry',
    category: 'Romantic Ode',
    author: 'John Keats',
    era: 'Romantic Era (1795–1821)',
    language: 'English',
    ageGroup: 'all',
    keyWorks: ['Ode to a Nightingale', 'Ode on a Grecian Urn', 'To Autumn', 'Hyperion'],
    quote: '"Beauty is truth, truth beauty," — that is all ye know on earth, and all ye need to know.',
    description: 'A quiet, sun-dappled chamber celebrating Keats\'s unmatched sensuous imagery and meditation on art, transience, and eternal beauty.',
    content: [
      'Despite dying at the age of only 25, John Keats produced some of the most exalted lyric poetry in the English language during his miraculous year of 1819.',
      'His "Great Odes" captured the yearning of the mortal spirit toward timeless art, exploring the sweet sorrow of joy, melancholy, and autumn ripeness.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#3B82F6',
    tags: ['poetry', 'keats', 'romanticism', 'odes', 'english'],
    featured: false,
    order: 13,
    isPublished: true
  },

  // ── 5. CHILDREN'S LITERATURE ──
  {
    title: 'കൊട്ടാരത്തിൽ ശങ്കുണ്ണിയുടെ ഐതിഹ്യമാല',
    subtitle: 'കേരളത്തിലെ അത്ഭുത കഥകളും മാന്ത്രികാനുഭവങ്ങളും',
    room: "Children's Literature",
    category: 'ഐതിഹ്യങ്ങൾ & നാടോടിക്കഥകൾ',
    author: 'കൊട്ടാരത്തിൽ ശങ്കുണ്ണി',
    era: '20-ാം നൂറ്റാണ്ടിന്റെ തുടക്കം (1909–1934)',
    language: 'Malayalam',
    ageGroup: 'kids',
    keyWorks: ['ഐതിഹ്യമാല (8 ഭാഗങ്ങൾ)'],
    quote: 'ഐതിഹ്യങ്ങൾ വെറും കഥകളല്ല; നമ്മുടെ പൂർവ്വികരുടെ വിസ്മയ സ്മരണകളാണ്.',
    description: 'കായംകുളം കൊച്ചുണ്ണിയും കടമറ്റത്ത് കത്തനാറും പറയിപെറ്റ പന്തിരുകുലവും നിറഞ്ഞ കേരളീയ നാടോടിക്കഥകളുടെ വിസ്മയ ശേഖരം.',
    content: [
      'കൊട്ടാരത്തിൽ ശങ്കുണ്ണി കാൽനൂറ്റാണ്ടോളം അദ്ധ്വാനിച്ച് രചിച്ച ഐതിഹ്യമാല മലയാളത്തിലെ കുട്ടികളുടെയും മുതിർന്നവരുടെയും എക്കാലത്തെയും പ്രിയപ്പെട്ട ഇതിഹാസ കഥാസമാഹാരമാണ്.',
      'കായംകുളം കൊച്ചുണ്ണി, കടമറ്റത്ത് കത്തനാർ, ചെങ്ങന്നൂർ ആനകൾ, ക്ഷേത്ര മാഹാത്മ്യങ്ങൾ എന്നിവ കുട്ടികളിൽ ഭാവനയും സാഹസികതയും സദാചാരമൂല്യങ്ങളും വളർത്തുന്നു.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#10B981',
    tags: ['kids', 'aithihyamala', 'folklore', 'legends', 'malayalam'],
    featured: false,
    order: 14,
    isPublished: true
  },
  {
    title: 'Vishnu Sharma\'s Panchatantra: Ancient Fables of Wisdom',
    subtitle: 'The World\'s Most Traveled Storybook',
    room: "Children's Literature",
    category: 'Ancient Fables',
    author: 'Pandit Vishnu Sharma',
    era: 'c. 300 BCE – 300 CE',
    language: 'English',
    ageGroup: 'kids',
    keyWorks: ['Mitra Bhedha (Loss of Friends)', 'Mitra Labha (Gaining Friends)', 'Kakolukiyam (Of Crows and Owls)'],
    quote: 'Knowledge without practical wisdom is like a loaded donkey carrying gold but eating grass.',
    description: 'Step into the vibrant jungle council of animal fables where kings, monkeys, lions, and clever turtles taught statecraft, friendship, and quick wit to young princes.',
    content: [
      'The Panchatantra is one of humanity’s oldest interconnected story collections. Written in ancient India to educate young princes, it was translated into Middle Persian (Pahlavi), Arabic (Kalila wa Dimna), Latin, and influenced Aesop and La Fontaine.',
      'With engaging tales like "The Monkey and the Crocodile" and "The Turtle who could not stop talking", the Panchatantra taught that wit, unity, and critical thinking triumph over brute strength.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#F59E0B',
    tags: ['kids', 'panchatantra', 'fables', 'folklore', 'morals'],
    featured: true,
    order: 15,
    isPublished: true
  },
  {
    title: 'Ruskin Bond & Tales of the Himalayan Foothills',
    subtitle: 'The Gentle Magic of Indian Childhood',
    room: "Children's Literature",
    category: 'Children\'s Fiction',
    author: 'Ruskin Bond',
    era: 'Contemporary (1934–Present)',
    language: 'English',
    ageGroup: 'kids',
    keyWorks: ['The Blue Umbrella', 'Rusty: The Boy from the Hills', 'Grandfather\'s Private Zoo', 'Night Train at Deoli'],
    quote: 'And when all the wars are over, a butterfly will still be beautiful.',
    description: 'A cozy cottage gallery with pine scents and mountain wind, celebrating Ruskin Bond\'s charming tales of mountain children, playful ghosts, and wild pets in Mussoorie.',
    content: [
      'From his Ivy Cottage in Landour, Ruskin Bond has enchanted millions of young readers with stories of simplicity, kindness, and deep connection with the Himalayan mountains.',
      'In The Blue Umbrella, little Binya\'s selfless gesture of trading her prized umbrella for a leopard claw necklace teaches children the true beauty of generosity and empathy.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#06B6D4',
    tags: ['kids', 'ruskin bond', 'mountains', 'adventure', 'stories'],
    featured: false,
    order: 16,
    isPublished: true
  },

  // ── 6. FAMOUS AUTHORS ──
  {
    title: 'എം. ടി. വാസുദേവൻ നായർ: രണ്ടാമൂഴവും നിളയുടെ കഥാകാരനും',
    subtitle: 'ജ്ഞാനപീഠം നേടിയ ഇതിഹാസ പുനരാഖ്യാനം',
    room: 'Famous Authors',
    category: 'വിശ്വസാഹിത്യകാരൻ (Master Author)',
    author: 'എം. ടി. വാസുദേവൻ നായർ',
    era: 'ആധുനിക യുഗം (1933–Present)',
    language: 'Malayalam',
    ageGroup: 'adult',
    keyWorks: ['രണ്ടാമൂഴം', 'നാലുകെട്ട്', 'അസുരവിത്ത്', 'മഞ്ഞ്', 'കാലം'],
    quote: 'മഹാഭാരതത്തിലെ പാണ്ഡവരിൽ എന്നും രണ്ടാമനായി നിന്ന ഭീമന്റെ ഹൃദയവ്യഥകളിലേക്ക് ഒരു തീർത്ഥയാത്ര.',
    description: 'രണ്ടാമൂഴത്തിലൂടെ ഭീമന്റെ ആത്മാവിഷ്കാരവും നാലുകെട്ടിലൂടെ കേരളത്തിന്റെ സാമൂഹിക മാറ്റങ്ങളും വരച്ചുകാട്ടിയ വിശ്വസാഹിത്യകാരൻ.',
    content: [
      'എം. ടി. വാസുദേവൻ നായരുടെ രണ്ടാമൂഴം എന്ന നോവൽ മഹാഭാരത കഥയെ ഭീമസേനന്റെ കാഴ്ച്ചപ്പാടിൽ പുനരാവിഷ്കരിച്ച ലോകോത്തര ക്ലാസിക്കാണ്. ദൈവീകതയുടെ പരിവേഷമില്ലാതെ ഭീമന്റെ മാനുഷിക വികാരങ്ങളെ എം. ടി ആവിഷ്കരിച്ചു.',
      'നാലുകെട്ട്, മഞ്ഞ്, അസുരവിത്ത് തുടങ്ങിയ നോവലുകൾ നിളയുടെ തീരത്തെ മനുഷ്യരുടെ വിഹ്വലതകളെയും ആധുനികതയുടെ ആഘാതങ്ങളെയും മലയാള സാഹിത്യത്തിന്റെ അമരത്തെത്തിച്ചു.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#F59E0B',
    tags: ['authors', 'mt vasudevan nair', 'randamoozham', 'jnanpith', 'classics'],
    featured: true,
    order: 17,
    isPublished: true
  },
  {
    title: 'Gabriel García Márquez & The Wonder of Magical Realism',
    subtitle: 'The Solitude and Wonder of Macondo',
    room: 'Famous Authors',
    category: 'Magical Realism',
    author: 'Gabriel García Márquez (Gabo)',
    era: 'Latin American Boom (1927–2014)',
    language: 'English',
    ageGroup: 'adult',
    keyWorks: ['One Hundred Years of Solitude', 'Love in the Time of Cholera', 'Chronicle of a Death Foretold'],
    quote: 'It was the time when they both loved each other best, without hurry or excess, when both were most conscious of and grateful for their incredible victories over adversity.',
    description: 'Discover the golden, butterfly-filled realm of Macondo, where magical realism transformed world fiction by making the miraculous commonplace and the ordinary miraculous.',
    content: [
      'Colombian Nobel laureate Gabriel García Márquez transformed 20th-century literature. In One Hundred Years of Solitude, he chronicled seven generations of the Buendía family, weaving ghosts, yellow butterflies, and political turbulence into a tapestry of eternal human longing.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#EC4899',
    tags: ['authors', 'marquez', 'magical realism', 'solitude', 'nobel'],
    featured: false,
    order: 18,
    isPublished: true
  },
  {
    title: 'R. K. Narayan & The Enchanted Streets of Malgudi',
    subtitle: 'Chronicler of Everyday Indian Life',
    room: 'Famous Authors',
    category: 'Indian English Fiction',
    author: 'R. K. Narayan',
    era: 'Mid-20th Century (1906–2001)',
    language: 'English',
    ageGroup: 'all',
    keyWorks: ['Swami and Friends', 'The Guide', 'The Bachelor of Arts', 'The English Teacher'],
    quote: 'Life is about making the best of what comes, with humor and a quiet mind.',
    description: 'Wander down Market Road in the timeless fictional town of Malgudi, where Swami played cricket, Raju became a spiritual guide, and ordinary life shone with warmth and gentle irony.',
    content: [
      'Rasipuram Krishnaswami Iyer Narayanaswami (R.K. Narayan) is celebrated as one of India’s pioneering English-language novelists. Mentored by Graham Greene, Narayan invented the fictional town of Malgudi—a microcosm of a changing India.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#10B981',
    tags: ['authors', 'rk narayan', 'malgudi', 'classic', 'india'],
    featured: false,
    order: 19,
    isPublished: true
  },

  // ── 7. EVOLUTION OF STORYTELLING (കഥപറച്ചിലിന്റെ പരിണാമം) ──
  {
    title: 'From Oral Campfires to Palm-Leaf Manuscripts',
    subtitle: 'The Dawn of Shared Human Memory',
    room: 'Evolution of Storytelling',
    category: 'Historical Evolution',
    author: 'Ancient Humanity & Scribes',
    era: 'Prehistoric Era to 15th Century CE',
    language: 'All',
    ageGroup: 'all',
    keyWorks: ['Mesopotamian Clay Tablets', 'Egyptian Papyrus Scrolls', 'Vedic Oral Chants', 'Indian Talapatra (താളിയോലകൾ)'],
    quote: 'A story is a wayfinding map — a record of where we have been, who we have loved, and what we carry forward.',
    description: 'Travel back to the origin of narrative consciousness, when human communities sat beside glowing embers and etched ancient tales into clay, papyrus, and palm leaves.',
    content: [
      'Storytelling is humanity’s oldest survival technology. Tens of thousands of years ago, before the invention of written alphabets, oral traditions encoded astronomical navigation, medicinal knowledge, moral compasses, and mythological origins into rhythm and song.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#D97706',
    tags: ['evolution', 'oral tradition', 'manuscripts', 'history', 'origins'],
    featured: true,
    order: 20,
    isPublished: true
  },
  {
    title: 'The Gutenberg Press & The Mass Literacy Revolution',
    subtitle: 'When Movable Type Democratized the Human Mind',
    room: 'Evolution of Storytelling',
    category: 'Technological Leap',
    author: 'Johannes Gutenberg & Renaissance Printers',
    era: '1450 CE – 19th Century',
    language: 'All',
    ageGroup: 'all',
    keyWorks: ['The Gutenberg 42-Line Bible (1455)', 'The First Folio (1623)', 'The Rise of the Paperback Novel'],
    quote: 'Give me twenty-six lead soldiers and I will conquer the world.',
    description: 'Witness the revolutionary moment in Mainz, Germany, when movable metal type unlocked books from palace vaults and ignited the Renaissance, Scientific Revolution, and modern world.',
    content: [
      'In 1440, Johannes Gutenberg combined an olive press mechanism, oil-based ink, and hand-cast metal alloy letters to create movable type printing. Within decades, millions of books flooded European cities.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#3B82F6',
    tags: ['evolution', 'gutenberg', 'printing press', 'renaissance', 'books'],
    featured: false,
    order: 21,
    isPublished: true
  },
  {
    title: 'Radio Waves, Animated Cinema, and AI Storytelling',
    subtitle: 'The Living Canvas of Digital Narratives',
    room: 'Evolution of Storytelling',
    category: 'Future of Narrative',
    author: 'AnimVerse AI & Modern Creators',
    era: '20th Century to 2026 & Beyond',
    language: 'All',
    ageGroup: 'all',
    keyWorks: ['Golden Age Radio Dramas', 'Hand-Drawn & 3D Animation', 'AnimVerse AI Living Video Engine'],
    quote: 'The future of storytelling is not just reading a world — it is watching it breathe, listen, and transform with you.',
    description: 'Explore the modern continuum from early 1930s radio drama sound effects to cinema projection, and today\'s interactive digital animation studio at AnimVerse AI.',
    content: [
      'In the 20th century, stories leaped from flat printed pages into the sonic ether of radio broadcasts and the glowing silver screens of cinema, engaging sight and sound simultaneously.',
      'Today, AnimVerse AI continues this historic evolution: transforming text manuscripts and imagination into vibrant animated scenes, voiceovers, and interactive digital museums in seconds.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#8B5CF6',
    tags: ['evolution', 'radio', 'animation', 'ai storytelling', 'future'],
    featured: true,
    order: 22,
    isPublished: true
  }
];

// Room metadata definition
const ROOM_METADATA = [
  {
    id: 'malayalam',
    name: 'Malayalam Literature',
    nativeName: 'മലയാള സാഹിത്യം',
    icon: '🏛️',
    themeColor: '#F59E0B',
    description: 'കിളിപ്പാട്ട് പ്രസ്ഥാനം മുതൽ ബഷീറിയൻ മാനവികതയും എം.ടിയുടെ ഇതിഹാസ പുനരാഖ്യാനങ്ങളും വരെയുള്ള മലയാള സാഹിത്യ പൈതൃകം.',
    banner: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'english',
    name: 'English Literature',
    nativeName: 'English Literature',
    icon: '📚',
    themeColor: '#8B5CF6',
    description: 'Explore the sweeping evolution of English letters from the Globe Theatre and Victorian realism to modernist streams of consciousness.',
    banner: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'hindi',
    name: 'Hindi Literature',
    nativeName: 'हिंदी साहित्य',
    icon: '📖',
    themeColor: '#EF4444',
    description: 'कबीर के ज्ञानमार्गी दोहे, मुंशी प्रेमचंद का यथार्थवादी कथा-संसार और छायावादी काव्य का भावपूर्ण सौंदर्य।',
    banner: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'poetry',
    name: 'Poetry',
    nativeName: 'കവിതകൾ / कविताएं',
    icon: '✒️',
    themeColor: '#06B6D4',
    description: 'സ്നേഹവും പ്രകൃതിയും താളവും സമന്വയിക്കുന്ന വിശ്വോത്തര കവിതകളുടെയും സൂഫി ഭക്തി ഗീതങ്ങളുടെയും ഉദ്യാനം.',
    banner: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'children',
    name: "Children's Literature",
    nativeName: 'കുട്ടികളുടെ സാഹിത്യം / बाल साहित्य',
    icon: '🧒',
    themeColor: '#10B981',
    description: 'പഞ്ചതന്ത്രം കഥകളും ഐതിഹ്യമാലയും റസ്കിൻ ബോണ്ടിന്റെ മലയോര കഥകളും നിറഞ്ഞ ബാലസാഹിത്യ ശാഖ.',
    banner: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'authors',
    name: 'Famous Authors',
    nativeName: 'പ്രശസ്ത എഴുത്തുകാർ / प्रसिद्ध लेखक',
    icon: '👤',
    themeColor: '#EC4899',
    description: 'ലോകസാഹിത്യത്തിന് ദിശാബോധം നൽകിയ അനശ്വര എഴുത്തുകാരുടെ സവിശേഷ സലോണുകൾ.',
    banner: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'evolution',
    name: 'Evolution of Storytelling',
    nativeName: 'കഥപറച്ചിലിന്റെ പരിണാമം / कथा-विकास',
    icon: '🕰️',
    themeColor: '#D97706',
    description: 'താളിയോലകളിൽ നിന്നും അച്ചടിയന്ത്രങ്ങളിലേക്കും റേഡിയോയിൽ നിന്നും ആധുനിക AI ആനിമേഷനിലേക്കുമുള്ള കഥാപ്രയാണങ്ങൾ.',
    banner: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80'
  }
];

// Helper to seed or update defaults
async function ensureSeedData() {
  const count = await MuseumExhibit.countDocuments();
  if (count === 0) {
    await MuseumExhibit.insertMany(DEFAULT_MUSEUM_EXHIBITS);
  } else {
    // Refresh / sync default exhibits with authentic language versions
    for (const def of DEFAULT_MUSEUM_EXHIBITS) {
      const existing = await MuseumExhibit.findOne({
        $or: [
          { title: def.title },
          { author: def.author },
          { room: def.room, order: def.order }
        ]
      });
      if (existing) {
        existing.title = def.title;
        existing.subtitle = def.subtitle;
        existing.room = def.room;
        existing.category = def.category;
        existing.author = def.author;
        existing.era = def.era;
        existing.keyWorks = def.keyWorks;
        existing.quote = def.quote;
        existing.language = def.language;
        existing.description = def.description;
        existing.content = def.content;
        existing.imageUrl = def.imageUrl;
        existing.accentColor = def.accentColor;
        existing.tags = def.tags;
        existing.order = def.order;
        await existing.save();
      } else {
        await MuseumExhibit.create(def);
      }
    }
  }
}

// ── GET /api/museum ──
// Fetch published exhibits with filters
router.get('/', async (req, res) => {
  try {
    await ensureSeedData();

    const { room, language, ageGroup, search, category, featured } = req.query;
    const filter = { isPublished: { $ne: false } };

    if (room && room !== 'All' && room !== 'All Rooms') {
      filter.room = room;
    }

    if (language && language !== 'All') {
      filter.$or = [{ language }, { language: 'All' }];
    }

    if (ageGroup && ageGroup !== 'all' && ageGroup !== 'All') {
      filter.$or = [{ ageGroup }, { ageGroup: 'all' }];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search && search.trim()) {
      const term = search.trim();
      const regex = new RegExp(term, 'i');
      filter.$or = [
        { title: regex },
        { subtitle: regex },
        { author: regex },
        { description: regex },
        { era: regex },
        { tags: regex }
      ];
    }

    const exhibits = await MuseumExhibit.find(filter).sort({ order: 1, featured: -1, createdAt: -1 });
    res.json({ success: true, count: exhibits.length, data: exhibits });
  } catch (error) {
    console.error('Error fetching museum exhibits:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ── GET /api/museum/rooms ──
// Get structured list of museum rooms with exhibit counts and metadata
router.get('/rooms', async (req, res) => {
  try {
    await ensureSeedData();

    // Calculate live counts from MongoDB
    const roomCounts = await MuseumExhibit.aggregate([
      { $match: { isPublished: { $ne: false } } },
      { $group: { _id: '$room', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    roomCounts.forEach(r => { countMap[r._id] = r.count; });

    // Distinct rooms in DB
    const dbRooms = await MuseumExhibit.distinct('room', { isPublished: { $ne: false } });

    // Combine preset rooms with counts
    const rooms = ROOM_METADATA.map(preset => ({
      ...preset,
      count: countMap[preset.name] || 0
    }));

    // Add any custom rooms created by admins
    dbRooms.forEach(roomName => {
      if (!rooms.some(r => r.name.toLowerCase() === roomName.toLowerCase())) {
        rooms.push({
          id: roomName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: roomName,
          nativeName: roomName,
          icon: '🏛️',
          themeColor: '#F59E0B',
          description: `Explore curated exhibits in the ${roomName} gallery wing.`,
          banner: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
          count: countMap[roomName] || 0
        });
      }
    });

    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    console.error('Error fetching museum rooms:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ── GET /api/museum/admin/all ──
// Admin endpoint to view all exhibits (including drafts)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    await ensureSeedData();
    const exhibits = await MuseumExhibit.find().sort({ order: 1, featured: -1, createdAt: -1 });
    res.json({ success: true, count: exhibits.length, data: exhibits });
  } catch (error) {
    console.error('Error fetching museum admin records:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ── POST /api/museum/admin/upload ──
// Upload exhibit artwork / audio file
router.post('/admin/upload', protect, authorize('admin'), upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/museum/${req.file.filename}`;
    res.json({ success: true, message: 'File uploaded successfully', url: fileUrl });
  } catch (error) {
    console.error('Exhibit upload error:', error);
    res.status(500).json({ success: false, message: 'Upload error', error: error.message });
  }
});

// ── GET /api/museum/:id ──
// Get single exhibit
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }

    const exhibit = await MuseumExhibit.findById(req.params.id);
    if (!exhibit) {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }

    res.json({ success: true, data: exhibit });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }
    console.error('Error fetching museum exhibit:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ── POST /api/museum/admin ──
// Create new exhibit
router.post('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      title, subtitle, room, category, author, era, keyWorks, quote,
      language, ageGroup, description, content, imageUrl, audioUrl,
      accentColor, tags, featured, order, isPublished
    } = req.body;

    if (!title || !room) {
      return res.status(400).json({ success: false, message: 'Title and Room are required' });
    }

    const payload = {
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      room: room.trim(),
      category: category ? category.trim() : 'Classics',
      author: author ? author.trim() : '',
      era: era ? era.trim() : '',
      keyWorks: Array.isArray(keyWorks) ? keyWorks : (keyWorks ? keyWorks.split(',').map(s => s.trim()).filter(Boolean) : []),
      quote: quote ? quote.trim() : '',
      language: language || 'English',
      ageGroup: ageGroup || 'all',
      description: description ? description.trim() : '',
      content: Array.isArray(content) ? content : (content ? content.split('\n\n').map(p => p.trim()).filter(Boolean) : []),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
      audioUrl: audioUrl || '',
      accentColor: accentColor || '#F59E0B',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean) : []),
      featured: Boolean(featured),
      order: parseInt(order) || 0,
      isPublished: isPublished !== false,
      createdBy: req.user._id
    };

    const exhibit = await MuseumExhibit.create(payload);
    res.status(201).json({ success: true, message: 'Museum exhibit added successfully', data: exhibit });
  } catch (error) {
    console.error('Error creating museum exhibit:', error);
    res.status(500).json({ success: false, message: 'Unable to create exhibit', error: error.message });
  }
});

// ── PATCH /api/museum/admin/:id/toggle ──
// Toggle active/published status
router.patch('/admin/:id/toggle', protect, authorize('admin'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }

    const exhibit = await MuseumExhibit.findById(req.params.id);
    if (!exhibit) {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }

    exhibit.isPublished = !exhibit.isPublished;
    await exhibit.save();

    res.json({
      success: true,
      message: `Exhibit "${exhibit.title}" is now ${exhibit.isPublished ? 'published & visible' : 'saved as draft'}.`,
      data: exhibit
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }
    console.error('Error toggling museum exhibit status:', error);
    res.status(500).json({ success: false, message: 'Unable to toggle status', error: error.message });
  }
});

// ── PATCH /api/museum/admin/:id ──
// Update exhibit
router.patch('/admin/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }

    const exhibit = await MuseumExhibit.findById(req.params.id);
    if (!exhibit) {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }

    const {
      title, subtitle, room, category, author, era, keyWorks, quote,
      language, ageGroup, description, content, imageUrl, audioUrl,
      accentColor, tags, featured, order, isPublished
    } = req.body;

    if (title !== undefined) exhibit.title = title.trim();
    if (subtitle !== undefined) exhibit.subtitle = subtitle.trim();
    if (room !== undefined) exhibit.room = room.trim();
    if (category !== undefined) exhibit.category = category.trim();
    if (author !== undefined) exhibit.author = author.trim();
    if (era !== undefined) exhibit.era = era.trim();
    if (keyWorks !== undefined) exhibit.keyWorks = Array.isArray(keyWorks) ? keyWorks : keyWorks.split(',').map(s => s.trim()).filter(Boolean);
    if (quote !== undefined) exhibit.quote = quote.trim();
    if (language !== undefined) exhibit.language = language;
    if (ageGroup !== undefined) exhibit.ageGroup = ageGroup;
    if (description !== undefined) exhibit.description = description.trim();
    if (content !== undefined) exhibit.content = Array.isArray(content) ? content : content.split('\n\n').map(p => p.trim()).filter(Boolean);
    if (imageUrl !== undefined) exhibit.imageUrl = imageUrl;
    if (audioUrl !== undefined) exhibit.audioUrl = audioUrl;
    if (accentColor !== undefined) exhibit.accentColor = accentColor;
    if (tags !== undefined) exhibit.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
    if (featured !== undefined) exhibit.featured = Boolean(featured);
    if (order !== undefined) exhibit.order = parseInt(order) || 0;
    if (isPublished !== undefined) exhibit.isPublished = Boolean(isPublished);

    await exhibit.save();

    res.json({ success: true, message: 'Museum exhibit updated successfully', data: exhibit });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }
    console.error('Error updating museum exhibit:', error);
    res.status(500).json({ success: false, message: 'Unable to update exhibit', error: error.message });
  }
});

// ── DELETE /api/museum/admin/:id ──
// Delete exhibit
router.delete('/admin/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }

    const exhibit = await MuseumExhibit.findById(req.params.id);
    if (!exhibit) {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }

    await exhibit.deleteOne();
    res.json({ success: true, message: `Museum exhibit "${exhibit.title}" deleted successfully.` });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Museum exhibit not found' });
    }
    console.error('Error deleting museum exhibit:', error);
    res.status(500).json({ success: false, message: 'Unable to delete exhibit', error: error.message });
  }
});

module.exports = router;
