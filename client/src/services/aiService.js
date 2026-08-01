/**
 * AnimVerse AI - Generative AI Service Abstraction
 * Supports Provider Architecture (Mock & Production AI APIs)
 */

export const AI_MODE = 'mock'

export const aiService = {
  // Step 1 & 2: Story Generation / Understanding
  generateStory: async ({ prompt, length = 'medium', audience = 'general', style = 'Cartoon', tone = 'Adventurous', language = 'English' }) => {
    await new Promise(r => setTimeout(r, 1200)) // simulate pipeline latency

    const promptClean = prompt.trim() || 'A magical adventure story'
    
    return {
      title: `The Legend of ${promptClean.split(' ').slice(0, 4).join(' ').replace(/[^a-zA-Z0-9 ]/g, '')}`,
      summary: `An epic ${tone.toLowerCase()} story created for ${audience} in ${style} animation style.`,
      genre: tone,
      targetAudience: audience,
      language: language,
      animationStyle: style,
      fullText: `${promptClean}.

Once upon a time in a land filled with wonder, our journey began. The atmosphere was charged with quiet anticipation as morning light crested over the horizon.

Suddenly, a surprise event shifted everything! Characters faced unexpected choices that tested their courage and camaraderie.

Through perseverance, teamwork, and clever thinking, harmony was restored. The lessons learned here will be remembered for generations to come.`
    }
  },

  // Step 3: Character Extraction & Consistency References
  extractCharacters: async (storyText) => {
    await new Promise(r => setTimeout(r, 1000))
    return [
      {
        id: 'char-1',
        name: 'Hero Protagonist',
        species: 'Human/Hero',
        age: 'Young Adult',
        gender: 'Protagonist',
        appearance: 'Bright expressive eyes, signature red jacket, adventurous posture',
        clothing: 'Casual adventure attire with golden accents',
        personality: 'Brave, optimistic, determined',
        voiceProfile: 'Male Youth - Enthusiastic',
        emotionDefault: 'Happy',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'char-2',
        name: 'Wise Companion',
        species: 'Magical Creature/Guide',
        age: 'Ancient',
        gender: 'Companion',
        appearance: 'Luminous fur/aura, gentle eyes, carries an ancient scroll',
        clothing: 'Mystic orb pendant',
        personality: 'Wise, calm, protective',
        voiceProfile: 'Female Elder - Warm & Gentle',
        emotionDefault: 'Calm',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },

  // Step 4 & 5: Scene Division & Prompts
  generateScenes: async (storyText) => {
    await new Promise(r => setTimeout(r, 1200))
    return [
      {
        number: 1,
        title: 'The Beginning Journey',
        location: 'Enchanted Forest Edge',
        emotion: 'Wonder',
        camera: 'Wide Cinematic Shot',
        lighting: 'Golden Hour Sunset',
        prompt: 'Vibrant enchanted forest edge at golden hour, detailed animation style, warm ambient lighting, 8k resolution',
        dialogue: '"Look over there! The adventure is finally starting!"',
        narration: 'Every great journey begins with a single step into the unknown.',
        sfx: 'Birds chirping, gentle breeze',
        musicMood: 'Adventure',
        durationSec: 5,
        image: 'https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&w=800&q=80'
      },
      {
        number: 2,
        title: 'The Mysterious Discovery',
        location: 'Crystal Cave Entrance',
        emotion: 'Mystery',
        camera: 'Medium Tracking Shot',
        lighting: 'Bioluminescent Glow',
        prompt: 'Mysterious crystal cave entrance glowing with soft blue and purple light, cinematic style',
        dialogue: '"Stay close! I hear something glowing deep inside."',
        narration: 'Darkness gave way to luminous crystals whispering ancient secrets.',
        sfx: 'Footsteps on stone, cave echo, water droplets',
        musicMood: 'Mystery',
        durationSec: 6,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      },
      {
        number: 3,
        title: 'Triumph & Celebration',
        location: 'Sunlit Mountain Peak',
        emotion: 'Joy',
        camera: 'High Angle Panorama',
        lighting: 'Bright Daylight',
        prompt: 'Heroic triumph on mountain peak overlooking a vast magical world, vibrant colors, Pixar animation style',
        dialogue: '"We did it together! The horizon is ours!"',
        narration: 'With hearts full of courage, they looked toward a bright new tomorrow.',
        sfx: 'Cheering wind, triumphant fanfares',
        musicMood: 'Happy',
        durationSec: 5,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },

  // Step 6: Render MP4 Video Simulation
  renderVideo: async (projectData, onProgress) => {
    const steps = [
      'Compiling Scene Assets...',
      'Applying Ken Burns Motion Effects...',
      'Generating Voiceover Audio Tracks...',
      'Mixing Background Music & SFX...',
      'Rendering Subtitles (.SRT)...',
      'Finalizing MP4 Video Output...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 800))
      if (onProgress) onProgress(((i + 1) / steps.length) * 100, steps[i])
    }

    return {
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      storyboardPdfUrl: '#',
      scriptUrl: '#',
      srtUrl: '#'
    }
  }
}
