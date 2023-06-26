import { Router } from 'express';

import clientController from '../controller/channel.js';

const router = Router();

//GET /client/mychannels/:channelId
router.get('/mychannels/:channelId', clientController.getEnterMyChannel);// 해당의 채널에 접속하도록 요청

//POST /client/channel/create
router.post('/channel/create', clientController.postCreateChannel);// 채널 생성

//POST /client/channel/exit/:channelId
router.post('/channel/exit/:channelId', clientController.postExitChannel);//채널 퇴장

//POST client/channel/invite/:channelId
router.post('/channel/invite/:channelId',clientController.postInviteUserToChannel);// 채널에 친구 초대

//POST /client/chat/:channelId
router.post('/chat/:channelId', clientController.postCreateChatRoom);// 채팅방 생성

//GET /client/chat/:channelId/:chatRoomId
router.get('/chat/:channelId/:chatRoomId', clientController.getMyChatRoombyChannelId);// 채팅룸 로딩

//POST /client/chat/:channelId/:chatRoomId
router.post('/chat/:channelId/:chatRoomId', clientController.postSendChat);// 실시간 채팅 및 채팅창 실시간 업데이트

// POST /client/chat/upload-file/:channelId/:chatRoomId
router.post('/chat/upload-file/:channelId/:chatRoomId', clientController.postUploadFileToChatRoom);// 실시간 채팅 및 채팅창 실시간 업데이트

//POST /client/chat/invite/:channelId/:chatRoomId
router.post('/chat/invite/:channelId/:chatRoomId', clientController.postInviteUsersToChatRoom);// 채팅방에 친구 초대

export default router;
