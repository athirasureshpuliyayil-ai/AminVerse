const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Video Generation Routes
router.post('/generate', videoController.generateVideo);
router.get('/status/:taskId', videoController.getVideoStatus);
router.post('/scene-prompt', videoController.buildScenePrompt);
router.post('/generate-scene', videoController.generateSceneVideo);

module.exports = router;
