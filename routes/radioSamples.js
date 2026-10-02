const MUSIC_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const LANGUAGES = ['English', 'Malayalam', 'Hindi'];

const SAMPLE_PROGRAMS = [
  {
    category: 'Music',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    programs: [
      {
        title: 'Quiet Pages: Reading Room Instrumental',
        description: 'A gentle instrumental soundtrack for reading, writing, and quiet evenings.',
        creatorName: 'AnimVerse Music Studio',
        duration: '4:00',
        durationSeconds: 240,
        audioType: 'file',
        audioUrl: MUSIC_URL
      },
      {
        title: 'മഴയും നിലാവും: വായനാസംഗീതം',
        description: 'വായനയ്ക്കും എഴുത്തിനുമായി ഒരുക്കിയ ശാന്തമായ വാദ്യസംഗീതം.',
        creatorName: 'AnimVerse Music Studio',
        duration: '4:00',
        durationSeconds: 240,
        audioType: 'file',
        audioUrl: MUSIC_URL
      },
      {
        title: 'चाँदनी में किताबें: वाद्य संगीत',
        description: 'पढ़ने और लिखने के लिए एक शांत वाद्य संगीत रचना।',
        creatorName: 'AnimVerse Music Studio',
        duration: '4:00',
        durationSeconds: 240,
        audioType: 'file',
        audioUrl: MUSIC_URL
      }
    ]
  },
  {
    category: 'Stories',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    programs: [
      {
        title: 'The Lantern at the Old Ferry',
        description: 'A village child follows a mysterious lantern and discovers the kindness behind it.',
        creatorName: 'Mira Thomas',
        narrationText: 'At the old ferry, a lantern appeared every rainy evening. Leela followed its warm light and found an elderly boatman waiting for travelers who had missed the last crossing. She brought him tea, and from that night the village took turns keeping the lantern bright.',
        duration: '0:35',
        durationSeconds: 35
      },
      {
        title: 'പഴയ കടവിലെ വിളക്ക്',
        description: 'ഒരു പഴയ കടവിൽ തെളിയുന്ന വിളക്കിന് പിന്നിലെ കരുണ നിറഞ്ഞ കഥ.',
        creatorName: 'മീര തോമസ്',
        narrationText: 'പഴയ കടവിൽ മഴയുള്ള ഓരോ വൈകുന്നേരവും ഒരു വിളക്ക് തെളിഞ്ഞിരുന്നു. ലീല അതിന്റെ വെളിച്ചം പിന്തുടർന്ന് വഴിതെറ്റിയ യാത്രക്കാർക്കായി കാത്തിരുന്ന ഒരു വൃദ്ധനായ തോണിക്കാരനെ കണ്ടു. അവൾ അദ്ദേഹത്തിന് ചായ നൽകി. അന്നുമുതൽ ഗ്രാമവാസികൾ മാറിമാറി ആ വിളക്ക് തെളിച്ചു.',
        duration: '0:35',
        durationSeconds: 35
      },
      {
        title: 'पुराने घाट का दीपक',
        description: 'एक पुराने घाट पर जलते दीपक के पीछे छिपी दयालुता की कहानी।',
        creatorName: 'मीरा थॉमस',
        narrationText: 'पुराने घाट पर हर बरसाती शाम एक दीपक जलता था। लीला उसकी रोशनी के पीछे चली और वहाँ एक बूढ़े नाविक को पाया, जो आख़िरी नाव छूट जाने वाले यात्रियों की प्रतीक्षा करता था। लीला उसके लिए चाय लाई। उस रात के बाद गाँव वालों ने बारी-बारी से दीपक जलाना शुरू किया।',
        duration: '0:35',
        durationSeconds: 35
      }
    ]
  },
  {
    category: 'Mini Novels',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    programs: [
      {
        title: 'The Mapmaker’s Hidden Room',
        description: 'An apprentice discovers that each map in her mentor’s study marks a real untold journey.',
        creatorName: 'Arun Dev',
        narrationText: 'When Nila inherited the map shop, she found a narrow door behind the oldest atlas. Inside were letters from travelers whose routes had vanished from every chart. The first letter ended with a warning: the next blank place on the map was her own town.',
        duration: '0:40',
        durationSeconds: 40
      },
      {
        title: 'ഭൂപടകാരന്റെ രഹസ്യമുറി',
        description: 'ഗുരുവിന്റെ മുറിയിലെ ഓരോ ഭൂപടവും മറന്നുപോയൊരു യാത്രയുടെ അടയാളമാണെന്ന് ശിഷ്യ കണ്ടെത്തുന്നു.',
        creatorName: 'അരുൺ ദേവ്',
        narrationText: 'നീല ഭൂപടക്കട ഏറ്റെടുത്തപ്പോൾ പഴയ അറ്റ്ലസിന് പിന്നിൽ ഒരു രഹസ്യവാതിൽ കണ്ടെത്തി. അവിടെ ഭൂപടങ്ങളിൽ നിന്ന് മാഞ്ഞുപോയ വഴികളിലൂടെ സഞ്ചരിച്ചവരുടെ കത്തുകളുണ്ടായിരുന്നു. ആദ്യത്തെ കത്തിന്റെ അവസാനം ഒരു മുന്നറിയിപ്പുണ്ടായിരുന്നു: അടുത്ത ശൂന്യസ്ഥലം അവളുടെ സ്വന്തം പട്ടണമാണ്.',
        duration: '0:40',
        durationSeconds: 40
      },
      {
        title: 'नक्शानवीस का गुप्त कमरा',
        description: 'शागिर्द को गुरु के हर नक्शे में एक भूली हुई यात्रा का संकेत मिलता है।',
        creatorName: 'अरुण देव',
        narrationText: 'नीला को नक्शों की दुकान विरासत में मिली तो पुराने एटलस के पीछे एक छोटा दरवाज़ा मिला। वहाँ उन यात्रियों के पत्र थे जिनके रास्ते हर नक्शे से मिट चुके थे। पहले पत्र के अंत में चेतावनी थी: नक्शे की अगली खाली जगह उसका अपना शहर था।',
        duration: '0:40',
        durationSeconds: 40
      }
    ]
  },
  {
    category: 'Poetry',
    coverImage: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=600&q=80',
    programs: [
      {
        title: 'Small Rain, Wide Sky',
        description: 'An original spoken-word poem about finding room to begin again.',
        creatorName: 'Elena Vance',
        narrationText: 'A small rain taps the roof, the wide sky makes room. One seed turns in its sleep, one window opens to blue. Begin with the breath you have, begin with the light that arrives.',
        duration: '0:20',
        durationSeconds: 20
      },
      {
        title: 'ചെറുമഴ, വിശാലാകാശം',
        description: 'വീണ്ടും തുടങ്ങാനുള്ള ഇടം കണ്ടെത്തുന്ന ഒരു സ്വതന്ത്ര കവിത.',
        creatorName: 'എലീന വാൻസ്',
        narrationText: 'ചെറുമഴ മേൽക്കൂരയിൽ താളം തട്ടുന്നു, വിശാലമായ ആകാശം ഇടം നൽകുന്നു. ഒരു വിത്ത് ഉറക്കത്തിൽ തിരിയുന്നു, ഒരു ജനൽ നീലിമയിലേക്ക് തുറക്കുന്നു. ഉള്ള ശ്വാസത്തോടെ തുടങ്ങൂ, എത്തുന്ന വെളിച്ചത്തോടെ തുടങ്ങൂ.',
        duration: '0:20',
        durationSeconds: 20
      },
      {
        title: 'हल्की बारिश, खुला आसमान',
        description: 'फिर से शुरुआत करने की जगह खोजती एक मौलिक कविता।',
        creatorName: 'एलेना वेंस',
        narrationText: 'छोटी बारिश छत पर दस्तक देती है, खुला आकाश जगह बनाता है। एक बीज नींद में करवट लेता है, एक खिड़की नीले रंग की ओर खुलती है। अपनी साँस से शुरुआत करो, आती हुई रोशनी से शुरुआत करो।',
        duration: '0:20',
        durationSeconds: 20
      }
    ]
  },
  {
    category: 'Author Stories',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    programs: [
      {
        title: 'The Notebook That Would Not Close',
        description: 'A young writer learns how a daily page became the beginning of a lifelong craft.',
        creatorName: 'Sana Rahman',
        narrationText: 'Every morning, writer Anaya filled one page before the city woke. Most pages were crossed out, but she kept them. Years later, a story grew from one of those discarded lines. She said the notebook taught her that a writer does not wait for a perfect beginning.',
        duration: '0:32',
        durationSeconds: 32
      },
      {
        title: 'അടയാത്ത കുറിപ്പുപുസ്തകം',
        description: 'ദിവസവും ഒരു പേജ് എഴുതിയ ശീലം ഒരു എഴുത്തുകാരിയുടെ ജീവിതം മാറ്റിയ കഥ.',
        creatorName: 'സന റഹ്മാൻ',
        narrationText: 'നഗരം ഉണരുന്നതിന് മുമ്പ് അനയ എല്ലാ രാവിലെയും ഒരു പേജ് എഴുതുമായിരുന്നു. പലതും അവൾ വെട്ടിക്കളഞ്ഞെങ്കിലും സൂക്ഷിച്ചു. വർഷങ്ങൾക്കുശേഷം ആ വരികളിലൊന്നിൽ നിന്ന് ഒരു കഥ പിറന്നു. പൂർണ്ണമായ തുടക്കത്തിനായി കാത്തിരിക്കരുതെന്ന് ആ കുറിപ്പുപുസ്തകം തന്നെ പഠിപ്പിച്ചുവെന്ന് അവൾ പറഞ്ഞു.',
        duration: '0:32',
        durationSeconds: 32
      },
      {
        title: 'वह डायरी जो बंद नहीं हुई',
        description: 'हर दिन एक पन्ना लिखने की आदत एक लेखिका की ज़िंदगी की शुरुआत बनी।',
        creatorName: 'सना रहमान',
        narrationText: 'शहर के जागने से पहले अनाया हर सुबह एक पन्ना लिखती थी। कई पन्नों को उसने काट दिया, फिर भी सँभालकर रखा। वर्षों बाद उन्हीं पंक्तियों में से एक कहानी निकली। उसने कहा कि डायरी ने सिखाया, लेखक किसी परिपूर्ण शुरुआत की प्रतीक्षा नहीं करता।',
        duration: '0:32',
        durationSeconds: 32
      }
    ]
  },
  {
    category: 'Famous Lives',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    programs: [
      {
        title: 'A. P. J. Abdul Kalam: The Power of a Dream',
        description: 'A short biography of the scientist and president whose curiosity inspired generations.',
        creatorName: 'Siddharth Nair',
        narrationText: 'Avul Pakir Jainulabdeen Abdul Kalam grew up in Rameswaram and went on to study aeronautical engineering. His work in aerospace science and India’s space and missile programmes made him widely respected. As President, he continued to encourage young people to learn, imagine, and serve.',
        duration: '0:35',
        durationSeconds: 35
      },
      {
        title: 'എ. പി. ജെ. അബ്ദുൾ കലാം: സ്വപ്നങ്ങളുടെ കരുത്ത്',
        description: 'ശാസ്ത്രജ്ഞനും രാഷ്ട്രപതിയുമായ കലാമിന്റെ ജീവിതവും യുവാക്കളെ പ്രചോദിപ്പിച്ച ദർശനവും.',
        creatorName: 'സിദ്ധാർത്ഥ് നായർ',
        narrationText: 'അവുൽ പകീർ ജൈനുലാബ്ദീൻ അബ്ദുൾ കലാം രാമേശ്വരത്ത് വളർന്നു, തുടർന്ന് എയറോനോട്ടിക്കൽ എഞ്ചിനീയറിംഗ് പഠിച്ചു. ബഹിരാകാശ ശാസ്ത്രത്തിലും ഇന്ത്യയുടെ ബഹിരാകാശ, മിസൈൽ പദ്ധതികളിലുമുള്ള അദ്ദേഹത്തിന്റെ പ്രവർത്തനം വലിയ അംഗീകാരം നേടി. രാഷ്ട്രപതിയായ ശേഷവും പഠിക്കാനും സങ്കൽപ്പിക്കാനും രാജ്യത്തിനായി പ്രവർത്തിക്കാനും അദ്ദേഹം യുവാക്കളെ പ്രേരിപ്പിച്ചു.',
        duration: '0:35',
        durationSeconds: 35
      },
      {
        title: 'ए. पी. जे. अब्दुल कलाम: सपनों की शक्ति',
        description: 'वैज्ञानिक और राष्ट्रपति कलाम का जीवन, जिसने पीढ़ियों को जिज्ञासु बनने की प्रेरणा दी।',
        creatorName: 'सिद्धार्थ नायर',
        narrationText: 'अवुल पाकिर जैनुलाब्दीन अब्दुल कलाम का बचपन रामेश्वरम में बीता और उन्होंने वैमानिकी अभियांत्रिकी की पढ़ाई की। अंतरिक्ष विज्ञान और भारत के अंतरिक्ष तथा मिसाइल कार्यक्रमों में उनके काम को व्यापक सम्मान मिला। राष्ट्रपति रहते हुए भी वे युवाओं को सीखने, कल्पना करने और देश की सेवा करने के लिए प्रेरित करते रहे।',
        duration: '0:35',
        durationSeconds: 35
      }
    ]
  },
  {
    category: 'Scientists',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    programs: [
      {
        title: 'Marie Curie and the Search for Radium',
        description: 'How careful experiments led Marie and Pierre Curie to discover two new elements.',
        creatorName: 'Dr. Aris Vance',
        narrationText: 'Marie Curie studied the faint energy released by uranium ores. Working with Pierre Curie, she carried out years of painstaking measurements and identified polonium and radium. Her research changed the study of radioactivity and earned her two Nobel Prizes in different sciences.',
        duration: '0:34',
        durationSeconds: 34
      },
      {
        title: 'മേരി ക്യൂറിയും റേഡിയത്തിന്റെ കണ്ടെത്തലും',
        description: 'ശ്രദ്ധാപൂർവമായ പരീക്ഷണങ്ങളിലൂടെ മേരി, പിയറി ക്യൂറി എന്നിവർ പുതിയ മൂലകങ്ങൾ കണ്ടെത്തിയ കഥ.',
        creatorName: 'ഡോ. ആരിസ് വാൻസ്',
        narrationText: 'യുറേനിയം ധാതുക്കളിൽ നിന്ന് പുറപ്പെടുന്ന സൂക്ഷ്മ ഊർജത്തെ മേരി ക്യൂറി പഠിച്ചു. പിയറി ക്യൂറിയോടൊപ്പം വർഷങ്ങളോളം നടത്തിയ കൃത്യമായ അളവെടുപ്പുകൾക്കൊടുവിൽ അവർ പൊളോണിയവും റേഡിയവും തിരിച്ചറിഞ്ഞു. റേഡിയോആക്റ്റിവിറ്റിയുടെ പഠനം മാറ്റിമറിച്ച ഈ ഗവേഷണത്തിന് അവർക്ക് രണ്ട് വ്യത്യസ്ത ശാസ്ത്രശാഖകളിൽ നോബൽ സമ്മാനം ലഭിച്ചു.',
        duration: '0:34',
        durationSeconds: 34
      },
      {
        title: 'मैरी क्यूरी और रेडियम की खोज',
        description: 'सावधानी से किए प्रयोगों ने मैरी और पियरे क्यूरी को नए तत्वों तक पहुँचाया।',
        creatorName: 'डॉ. एरिस वेंस',
        narrationText: 'मैरी क्यूरी ने यूरेनियम खनिजों से निकलने वाली ऊर्जा का अध्ययन किया। पियरे क्यूरी के साथ वर्षों तक सटीक माप करने के बाद उन्होंने पोलोनियम और रेडियम की पहचान की। उनके शोध ने रेडियोधर्मिता के अध्ययन को बदल दिया और उन्हें दो अलग-अलग विज्ञानों में नोबेल पुरस्कार मिले।',
        duration: '0:34',
        durationSeconds: 34
      }
    ]
  },
  {
    category: 'Astronauts & Space',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    programs: [
      {
        title: 'Chandrayaan-3: A Landing Near the Lunar South Pole',
        description: 'A guided listen through India’s historic soft landing and the experiments that followed.',
        creatorName: 'Astro Cosmos',
        narrationText: 'On the twenty-third of August, 2023, India’s Chandrayaan-3 mission landed near the Moon’s south polar region. The Vikram lander and Pragyan rover began studying the lunar surface. Their instruments sent back measurements that help scientists understand the Moon and plan future exploration.',
        duration: '0:32',
        durationSeconds: 32
      },
      {
        title: 'ചന്ദ്രയാൻ-3: ചന്ദ്രന്റെ ദക്ഷിണധ്രുവത്തിനരികിലെ ലാൻഡിംഗ്',
        description: 'ഇന്ത്യയുടെ ചരിത്രപരമായ ചന്ദ്രയാൻ ലാൻഡിംഗും തുടർന്നുള്ള ശാസ്ത്രീയ പരീക്ഷണങ്ങളും.',
        creatorName: 'ആസ്ട്രോ കോസ്മോസ്',
        narrationText: '2023 ഓഗസ്റ്റ് 23-ന് ഇന്ത്യയുടെ ചന്ദ്രയാൻ-3 ദൗത്യം ചന്ദ്രന്റെ ദക്ഷിണധ്രുവ പ്രദേശത്തിനടുത്ത് ഇറങ്ങി. വിക്രം ലാൻഡറും പ്രഗ്യാൻ റോവറും ചന്ദ്രോപരിതലം പഠിക്കാൻ തുടങ്ങി. അവയുടെ ഉപകരണങ്ങൾ ശേഖരിച്ച വിവരങ്ങൾ ചന്ദ്രനെ മനസ്സിലാക്കാനും ഭാവിയിലെ ബഹിരാകാശ യാത്രകൾ ആസൂത്രണം ചെയ്യാനും ശാസ്ത്രജ്ഞരെ സഹായിക്കുന്നു.',
        duration: '0:32',
        durationSeconds: 32
      },
      {
        title: 'चंद्रयान-3: चंद्रमा के दक्षिणी ध्रुव के पास अवतरण',
        description: 'भारत की ऐतिहासिक चंद्र लैंडिंग और उसके बाद हुए वैज्ञानिक प्रयोगों की एक झलक।',
        creatorName: 'एस्ट्रो कॉसमॉस',
        narrationText: 'तेईस अगस्त, 2023 को भारत का चंद्रयान-3 मिशन चंद्रमा के दक्षिणी ध्रुव के पास उतरा। विक्रम लैंडर और प्रज्ञान रोवर ने चंद्र सतह का अध्ययन शुरू किया। उनके उपकरणों से मिले आँकड़े वैज्ञानिकों को चंद्रमा समझने और भविष्य की अंतरिक्ष यात्राओं की योजना बनाने में मदद करते हैं।',
        duration: '0:32',
        durationSeconds: 32
      }
    ]
  },
  {
    category: 'Literature Talks',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    programs: [
      {
        title: 'Why We Return to the Stories We Love',
        description: 'A book-club conversation about familiar characters, fresh readings, and shared memory.',
        creatorName: 'AnimVerse Book Club',
        narrationText: 'Why do readers return to a book they already know? A familiar story can feel different as our lives change. In tonight’s book-club conversation, we compare the details we noticed as children with the meanings we find now, and ask what makes a story worth sharing.',
        duration: '0:31',
        durationSeconds: 31
      },
      {
        title: 'ഇഷ്ടകഥകളിലേക്ക് നാം മടങ്ങുന്നതെന്തിന്?',
        description: 'പരിചിതമായ കഥാപാത്രങ്ങളും പുതിയ വായനാനുഭവങ്ങളും പങ്കിടുന്ന പുസ്തകചർച്ച.',
        creatorName: 'ആനിമ്വേഴ്സ് പുസ്തകവേദി',
        narrationText: 'നമുക്കറിയാവുന്ന ഒരു പുസ്തകത്തിലേക്ക് വായനക്കാർ വീണ്ടും മടങ്ങുന്നത് എന്തുകൊണ്ടാണ്? നമ്മുടെ ജീവിതം മാറുമ്പോൾ പരിചിതമായ കഥയ്ക്കും പുതിയ അർത്ഥം ലഭിക്കും. ഇന്നത്തെ പുസ്തകചർച്ചയിൽ കുട്ടിക്കാലത്ത് കണ്ട കാര്യങ്ങളും ഇപ്പോൾ കണ്ടെത്തുന്ന ആശയങ്ങളും താരതമ്യം ചെയ്ത്, പങ്കുവെക്കാൻ യോഗ്യമായ കഥയെന്തെന്ന് നാം ചോദിക്കുന്നു.',
        duration: '0:31',
        durationSeconds: 31
      },
      {
        title: 'हम अपनी प्रिय कहानियों पर फिर क्यों लौटते हैं?',
        description: 'पहचाने पात्रों और नए अर्थों पर एक पुस्तक-चर्चा।',
        creatorName: 'एनिमवर्स पुस्तक मंडली',
        narrationText: 'पाठक उस किताब पर फिर क्यों लौटते हैं जिसे वे पहले से जानते हैं? हमारा जीवन बदलता है तो परिचित कहानी भी नया अर्थ देने लगती है। आज की पुस्तक-चर्चा में हम बचपन में देखी बातों की तुलना आज मिलने वाले अर्थों से करते हैं और पूछते हैं कि कौन-सी कहानी साझा करने लायक बनती है।',
        duration: '0:31',
        durationSeconds: 31
      }
    ]
  }
];

const LANGUAGE_CODES = {
  English: 'en-GB',
  Malayalam: 'ml-IN',
  Hindi: 'hi-IN'
};

const LEGACY_SEED_TITLES = [
  'Serenade of the Midnight Moon',
  'The Golden Phoenix of Malabar',
  'Vikramaditya and the Celestial Sword',
  'Ode to the Evening Star (Poetry Recital)',
  'The Life & Vision of Rabindranath Tagore',
  'APJ Abdul Kalam: Wings of Fire Journey',
  'Marie Curie: Radiant Discoveries',
  'Voyage of Voyager 1: Into the Interstellar Void',
  'Future of Storytelling in the AI Era'
];

const RADIO_SAMPLE_TRACKS = SAMPLE_PROGRAMS.flatMap(({ category, coverImage, programs }) =>
  programs.map((program, index) => ({
    ...program,
    seedKey: `${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${LANGUAGES[index].toLowerCase()}`,
    category,
    language: LANGUAGES[index],
    languageCode: LANGUAGE_CODES[LANGUAGES[index]],
    audioType: program.audioType || 'speech',
    audioUrl: program.audioUrl || 'speech-synthesis',
    coverImage,
    creatorRole: 'author',
    status: 'approved',
    isActive: true,
    isFeatured: index === 0,
    ageGroup: 'all',
    likesCount: 0,
    playsCount: 0,
    viewsCount: 0
  }))
);

module.exports = { RADIO_SAMPLE_TRACKS, LEGACY_SEED_TITLES };
