const VideoProvider = require('./videoProvider');

/**
 * 8Scale Wan 2.2 Video Generation Provider
 * Handles text-to-video, image-to-video, and multi-scene generation through 8Scale Wan 2.2 API.
 */
class EightScaleWanProvider extends VideoProvider {
  constructor() {
    super('8Scale Wan 2.2');
    this.inMemoryTasks = new Map();
  }

  getApiKey() {
    return process.env.WAN_API_KEY || process.env.EIGHTSCALE_API_KEY || process.env.EIGHT_SCALE_API_KEY || '';
  }

  getBaseUrl() {
    return (process.env.WAN_BASE_URL || 'https://8scale.run').replace(/\/+$/, '');
  }

  getDefaultModel() {
    return process.env.WAN_MODEL || 'wan-2.2';
  }

  getDefaultResolution() {
    return process.env.WAN_RESOLUTION || '480p';
  }

  getDefaultAspectRatio() {
    return process.env.WAN_ASPECT_RATIO || '16:9';
  }

  /**
   * Build a rich cinematic prompt incorporating character consistency and scene parameters.
   * @param {Object} params - { prompt, character, environment, action, camera, style, lighting, mood }
   * @returns {string} - Combined prompt for Wan 2.2
   */
  buildPrompt(params = {}) {
    const parts = [];

    // 1. Character Identity & Visual Attributes (Ensures Character Consistency)
    if (params.character) {
      if (typeof params.character === 'string') {
        parts.push(`Character: ${params.character.trim()}`);
      } else if (typeof params.character === 'object') {
        const charDetails = [];
        if (params.character.name) charDetails.push(`Name: ${params.character.name}`);
        if (params.character.appearance) charDetails.push(`${params.character.appearance}`);
        if (params.character.clothing) charDetails.push(`wearing ${params.character.clothing}`);
        if (params.character.personality) charDetails.push(`personality: ${params.character.personality}`);
        if (charDetails.length > 0) {
          parts.push(`Character: ${charDetails.join(', ')}`);
        }
      }
    }

    // 2. Action & Core Scene Narrative
    const corePrompt = params.action || params.prompt || params.description || '';
    if (corePrompt) {
      parts.push(`Action: ${corePrompt.trim()}`);
    }

    // 3. Environment & Setting
    if (params.environment) {
      parts.push(`Environment: ${params.environment.trim()}`);
    }

    // 4. Camera Dynamics
    if (params.camera) {
      parts.push(`Camera: ${params.camera.trim()}`);
    } else {
      parts.push(`Camera: Smooth cinematic motion, stable composition`);
    }

    // 5. Visual Art Style
    const style = params.style || 'High-quality 3D cinematic animated film style, 8k render, octane render';
    parts.push(`Style: ${style}`);

    // 6. Lighting & Atmosphere
    if (params.lighting) {
      parts.push(`Lighting: ${params.lighting.trim()}`);
    } else {
      parts.push(`Lighting: Volumetric cinematic lighting, soft ambient glow`);
    }

    // 7. Mood & Emotion
    if (params.mood) {
      parts.push(`Mood: ${params.mood.trim()}`);
    }

    return parts.join('. ') + '.';
  }

  /**
   * Map provider-specific statuses to standard frontend states:
   * 'queued' | 'processing' | 'completed' | 'failed'
   */
  normalizeStatus(statusStr) {
    if (!statusStr) return 'processing';
    const s = String(statusStr).toLowerCase();
    if (s.includes('succeed') || s.includes('complete') || s.includes('success') || s === 'done') {
      return 'completed';
    }
    if (s.includes('fail') || s.includes('error') || s.includes('cancel') || s.includes('timeout')) {
      return 'failed';
    }
    if (s.includes('queue') || s.includes('pending') || s.includes('wait')) {
      return 'queued';
    }
    return 'processing';
  }

  /**
   * Submit video generation request to 8Scale Wan 2.2 API
   */
  async generateVideo(params = {}) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      const err = new Error('WAN_API_KEY is not configured on the backend server. Please add WAN_API_KEY to your .env file.');
      err.statusCode = 500;
      err.code = 'MISSING_API_KEY';
      throw err;
    }

    const fullPrompt = this.buildPrompt(params);
    const resolution = params.resolution || this.getDefaultResolution();
    const aspectRatio = params.aspectRatio || this.getDefaultAspectRatio();
    const duration = Number(params.duration || 5);
    const imageUrl = params.image || params.imageUrl || null;

    const baseUrl = this.getBaseUrl();
    const isImageToVideo = Boolean(imageUrl);

    // Primary endpoint targets for 8Scale Wan 2.2
    const endpointPath = isImageToVideo
      ? '/wan-2.2/14b/image-to-video'
      : '/wan-2.2/14b/text-to-video';

    const url = `${baseUrl}${endpointPath}`;

    const requestBody = {
      prompt: fullPrompt,
      resolution: resolution,
      aspect_ratio: aspectRatio,
      duration: duration
    };

    if (isImageToVideo) {
      requestBody.image = imageUrl;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-API-Key': apiKey
    };

    console.log(`[Wan 2.2 Service] Submitting video request to ${url} (Prompt length: ${fullPrompt.length} chars)`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        console.warn(`[Wan 2.2 Service] Non-JSON response from 8Scale: ${responseText.slice(0, 200)}`);
      }

      if (!response.ok) {
        console.error(`[Wan 2.2 Service] 8Scale API Error (${response.status}):`, data);
        
        // Handle common API failure statuses with friendly error messages
        let message = data.message || data.error || `8Scale Wan 2.2 API error (${response.status})`;
        if (response.status === 401 || response.status === 403) {
          message = 'Invalid or expired 8Scale API key. Please check your WAN_API_KEY in the backend configuration.';
        } else if (response.status === 402) {
          message = 'Insufficient 8Scale credits. Please check your 8Scale account balance.';
        } else if (response.status === 429) {
          message = '8Scale rate limit reached. Please wait a few seconds before trying again.';
        }

        const err = new Error(message);
        err.statusCode = response.status;
        err.details = data;
        throw err;
      }

      // Handle Task ID response
      const taskId = data.task_id || data.taskId || data.id || data.request_id || `wan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const rawStatus = data.status || (data.video_url || data.videoUrl ? 'completed' : 'processing');
      const normalized = this.normalizeStatus(rawStatus);
      const videoUrl = data.video_url || data.videoUrl || data.url || data.output?.video_url || null;

      const taskRecord = {
        taskId,
        provider: '8scale',
        model: 'wan-2.2',
        prompt: fullPrompt,
        resolution,
        aspectRatio,
        duration,
        status: normalized,
        progress: normalized === 'completed' ? 100 : 15,
        videoUrl: videoUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.inMemoryTasks.set(taskId, taskRecord);

      return {
        success: true,
        taskId,
        provider: '8scale',
        model: 'wan-2.2',
        status: normalized,
        videoUrl,
        prompt: fullPrompt,
        message: normalized === 'completed' ? 'Video generated successfully!' : 'Video generation queued with Wan 2.2.'
      };
    } catch (networkOrApiErr) {
      if (networkOrApiErr.statusCode) {
        throw networkOrApiErr;
      }

      console.error('[Wan 2.2 Service] Network or Fetch Error:', networkOrApiErr.message);
      const err = new Error('Could not connect to the 8Scale Wan 2.2 video generation service. Check your network or API endpoint.');
      err.statusCode = 502;
      err.originalMessage = networkOrApiErr.message;
      throw err;
    }
  }

  /**
   * Poll status of an ongoing video generation task
   */
  async getVideoStatus(taskId) {
    if (!taskId) {
      const err = new Error('Task ID is required to check status.');
      err.statusCode = 400;
      throw err;
    }

    const apiKey = this.getApiKey();
    const baseUrl = this.getBaseUrl();

    // Check in-memory state first
    const cached = this.inMemoryTasks.get(taskId) || {
      taskId,
      status: 'processing',
      progress: 40,
      createdAt: new Date().toISOString()
    };

    // If already completed or failed in memory and has videoUrl, return immediately
    if (cached.status === 'completed' && cached.videoUrl) {
      return {
        taskId,
        status: 'completed',
        progress: 100,
        videoUrl: cached.videoUrl,
        model: 'wan-2.2',
        provider: '8scale'
      };
    }

    if (!apiKey) {
      return {
        taskId,
        status: cached.status || 'processing',
        progress: cached.progress || 50,
        videoUrl: cached.videoUrl,
        model: 'wan-2.2',
        provider: '8scale'
      };
    }

    // Poll 8Scale status endpoint
    const statusUrls = [
      `${baseUrl}/status/${taskId}`,
      `${baseUrl}/tasks/${taskId}`,
      `${baseUrl}/v1/tasks/${taskId}`
    ];

    let lastError = null;

    for (const url of statusUrls) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-API-Key': apiKey,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const rawStatus = data.status || (data.video_url || data.videoUrl ? 'completed' : 'processing');
          const normalized = this.normalizeStatus(rawStatus);
          const videoUrl = data.video_url || data.videoUrl || data.url || data.output?.video_url || cached.videoUrl || null;
          const progress = normalized === 'completed' ? 100 : (data.progress || (cached.progress ? Math.min(cached.progress + 15, 90) : 50));

          const updated = {
            ...cached,
            status: normalized,
            progress,
            videoUrl,
            error: data.error || null,
            updatedAt: new Date().toISOString()
          };
          this.inMemoryTasks.set(taskId, updated);

          return {
            taskId,
            status: normalized,
            progress,
            videoUrl,
            error: data.error || null,
            model: 'wan-2.2',
            provider: '8scale'
          };
        }
      } catch (err) {
        lastError = err;
      }
    }

    // Fallback if remote status polling endpoint is asynchronous/delayed
    const currentProgress = Math.min((cached.progress || 20) + 10, 95);
    cached.progress = currentProgress;
    cached.updatedAt = new Date().toISOString();
    this.inMemoryTasks.set(taskId, cached);

    return {
      taskId,
      status: cached.status || 'processing',
      progress: currentProgress,
      videoUrl: cached.videoUrl,
      model: 'wan-2.2',
      provider: '8scale'
    };
  }
}

// Export singleton instance and class
const wanServiceInstance = new EightScaleWanProvider();

module.exports = {
  wanVideoService: wanServiceInstance,
  eightScaleWanProvider: wanServiceInstance,
  buildWanScenePrompt: (params) => wanServiceInstance.buildPrompt(params),
  EightScaleWanProvider
};
