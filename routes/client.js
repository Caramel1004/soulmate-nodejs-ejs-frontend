import { Router } from 'express';
import clientController from '../controller/client.js';

const router = Router();

// GET /client/mychannels
router.get('/mychannels', clientController.getMyChannelList);

//GET /client/mychannel/:channelId
// router.get('/:channelId', clientController.getChannelById);

//POST /client/channel/create
router.post('/channel/create',clientController.postCreateChannel);

export default router;
