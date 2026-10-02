/**
 * Abstract Video Provider Base Class
 * Allows seamless switching between 8Scale Wan 2.2, Pollo AI, LTX, or future providers.
 */
class VideoProvider {
  constructor(name) {
    if (new.target === VideoProvider) {
      throw new TypeError("Cannot construct VideoProvider instances directly");
    }
    this.name = name;
  }

  /**
   * Submit a video generation request
   * @param {Object} params - { prompt, aspectRatio, resolution, duration, image, characterInfo, style }
   * @returns {Promise<{ taskId: string, status: string, videoUrl?: string, raw?: any }>}
   */
  async generateVideo(params) {
    throw new Error("Method 'generateVideo()' must be implemented.");
  }

  /**
   * Check status of an asynchronous video generation task
   * @param {string} taskId
   * @returns {Promise<{ taskId: string, status: 'queued'|'processing'|'completed'|'failed', progress?: number, videoUrl?: string, error?: string }>}
   */
  async getVideoStatus(taskId) {
    throw new Error("Method 'getVideoStatus()' must be implemented.");
  }
}

module.exports = VideoProvider;
