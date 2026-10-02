const { wanVideoService } = require('../services/wanVideoService');
const AnimationProject = require('../models/AnimationProject');

/**
 * Controller for Video Generation Endpoints
 */

// POST /api/video/generate
exports.generateVideo = async (req, res) => {
  try {
    const { prompt, aspectRatio, resolution, duration, image, imageUrl, character, characterInfo, style, lighting, mood, environment, action } = req.body;

    if (!prompt && !action) {
      return res.status(400).json({
        success: false,
        message: 'A prompt or action description is required for video generation.'
      });
    }

    // Allowed parameter validation
    const allowedAspectRatios = ['16:9', '9:16', '1:1', '4:3', '21:9'];
    const allowedResolutions = ['480p', '580p', '720p', '1080p'];

    const validAspectRatio = allowedAspectRatios.includes(aspectRatio) ? aspectRatio : '16:9';
    const validResolution = allowedResolutions.includes(resolution) ? resolution : '480p';

    const result = await wanVideoService.generateVideo({
      prompt,
      action,
      character: character || characterInfo,
      environment,
      style,
      lighting,
      mood,
      aspectRatio: validAspectRatio,
      resolution: validResolution,
      duration: duration || 5,
      image: image || imageUrl
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      taskId: result.taskId,
      provider: result.provider,
      model: result.model,
      status: result.status,
      videoUrl: result.videoUrl,
      prompt: result.prompt
    });
  } catch (error) {
    console.error('[VideoController] generateVideo error:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Unable to generate the animation right now. Please try again.',
      code: error.code || 'GENERATION_FAILED'
    });
  }
};

// GET /api/video/status/:taskId
exports.getVideoStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'taskId parameter is required.'
      });
    }

    const statusResult = await wanVideoService.getVideoStatus(taskId);

    return res.status(200).json({
      success: true,
      taskId: statusResult.taskId,
      status: statusResult.status,
      progress: statusResult.progress,
      videoUrl: statusResult.videoUrl,
      provider: statusResult.provider || '8scale',
      model: statusResult.model || 'wan-2.2',
      error: statusResult.error || null
    });
  } catch (error) {
    console.error('[VideoController] getVideoStatus error:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Unable to check video status right now.',
      status: 'failed'
    });
  }
};

// POST /api/video/scene-prompt
exports.buildScenePrompt = async (req, res) => {
  try {
    const { prompt, character, environment, action, camera, style, lighting, mood } = req.body;
    const combined = wanVideoService.buildPrompt({
      prompt,
      character,
      environment,
      action,
      camera,
      style,
      lighting,
      mood
    });

    return res.status(200).json({
      success: true,
      prompt: combined
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to build scene prompt.'
    });
  }
};

// POST /api/video/generate-scene (Scene-Specific Generator with Project update)
exports.generateSceneVideo = async (req, res) => {
  try {
    const { projectId, sceneNumber, sceneIndex, prompt, character, style, aspectRatio, resolution, duration } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Scene prompt is required.'
      });
    }

    const result = await wanVideoService.generateVideo({
      prompt,
      character,
      style,
      aspectRatio: aspectRatio || '16:9',
      resolution: resolution || '480p',
      duration: duration || 5
    });

    // Optionally update MongoDB AnimationProject if projectId provided
    if (projectId && (sceneNumber !== undefined || sceneIndex !== undefined)) {
      try {
        const project = await AnimationProject.findById(projectId);
        if (project && project.scenes) {
          const idx = sceneIndex !== undefined ? sceneIndex : project.scenes.findIndex(s => s.sceneNumber === sceneNumber || s.number === sceneNumber);
          if (idx !== -1 && project.scenes[idx]) {
            project.scenes[idx].videoStatus = result.status;
            project.scenes[idx].taskId = result.taskId;
            project.scenes[idx].provider = '8scale-wan-2.2';
            project.scenes[idx].model = 'wan-2.2';
            project.scenes[idx].videoPrompt = result.prompt;
            if (result.videoUrl) {
              project.scenes[idx].videoUrl = result.videoUrl;
            }
            await project.save();
          }
        }
      } catch (dbErr) {
        console.warn('[VideoController] Note: Could not update project record in DB:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      taskId: result.taskId,
      status: result.status,
      videoUrl: result.videoUrl,
      prompt: result.prompt,
      provider: result.provider,
      model: result.model
    });
  } catch (error) {
    console.error('[VideoController] generateSceneVideo error:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to generate scene video.'
    });
  }
};
