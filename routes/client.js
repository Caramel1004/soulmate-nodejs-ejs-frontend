import { Router } from 'express';
import clientController from '../controller/client.js';

const router = Router();

// GET /client/mychannels
router.get('/mychannels', clientController.getMyChannelList);// 해당 유저의 채널 목록을 모두 가져오도록 요청

//GET /client/mychannels/:channelId
router.get('/mychannels/:channelId', clientController.getEnterMyChannel);// 해당의 채널에 접속하도록 요청

//GET /client/:channelId/:chatRoomId/?
router.get('/:channelId/:chatRoomId', clientController.getMyChatRoombyChannelId);// 해당 채널에 접속할때 채팅 목록 가져오도록 요청

//POST /client/channel/create
router.post('/channel/create', clientController.postCreateChannel);// 채널 생성

//POST /client/channel/exit/:channelId
router.post('/channel/exit/:channelId', clientController.postExitChannel);//채널 퇴장

//GET /client/:channelId/chat/:chatRoomId
router.get('/chat/:channelId/:chatRoomId', clientController.getMyChatRoombyChannelId);// 채팅룸 로딩

//POST /client/chat
router.post('/chat/:channelId/:chatRoomId/send', clientController.postSendChat);
export default router;
