import { Router } from 'express';
import clientController from '../controller/client.js';

const router = Router();

// GET /client/mychannels
router.get('/mychannels', clientController.getMyChannelList);

//GET /client/mychannels/:channelId
router.get('/mychannels/:channelId', clientController.getEnterMyChannel);

//GET /client/mychannels/chat
router.get('/test/chat', clientController.getMyChatRoombyChannelId);

//POST /client/channel/create
router.post('/channel/create', clientController.postCreateChannel);

//POST /client/channel/exit/:channelId
router.post('/channel/exit/:channelId', clientController.postExitChannel);

export default router;
