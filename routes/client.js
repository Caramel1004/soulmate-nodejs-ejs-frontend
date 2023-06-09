import { Router } from 'express';

import clientController from '../controller/client.js';
import { accessAuthorizedToken } from '../validator/valid.js'

const router = Router();

/**
 * 1. 채널 생성
 * 2. 채널 퇴장
 * 3. 해당 채널에 유저 초대
 * 4. 채팅방 생성
 * 5. 채팅방에 유저 초대
 * 6. 실시간 채팅
 * 7. 실시간 파일(자료) 업로드
 * 8. 워크스페이스에 자료 업로드
 * 9. 워크스페이스에서 해당 게시물에 댓글
 * 6. 워크 스페이스 생성
 * 7. 워크 스페이스에 유저 초대 -> 전체공개 or 초대한 유저만 이용
 */

//POST /client/channel/create
router.post('/channel/create', accessAuthorizedToken, clientController.postCreateChannel);// 1. 채널 생성

//POST /client/channel/exit/:channelId
router.post('/channel/exit/:channelId', accessAuthorizedToken, clientController.postExitChannel);// 2. 채널 퇴장

//POST /client/channel/invite/:channelId
router.post('/channel/invite/:channelId', accessAuthorizedToken, clientController.postInviteUserToChannel);// 3. 해당 채널에 유저 초대

//POST /client/chat/:channelId
router.post('/chat/:channelId', accessAuthorizedToken, clientController.postCreateChatRoom);// 4. 채팅방 생성

//POST /client/chat/invite/:channelId/:chatRoomId
router.post('/chat/invite/:channelId/:chatRoomId', accessAuthorizedToken, clientController.postInviteUsersToChatRoom);// 5. 채팅방에 유저 초대

//POST /client/chat/:channelId/:chatRoomId
router.post('/chat/:channelId/:chatRoomId', accessAuthorizedToken, clientController.postSendChat);// 6. 실시간 채팅 및 채팅창 실시간 업데이트

// POST /client/chat/upload-file/:channelId/:chatRoomId
router.post('/chat/upload-file/:channelId/:chatRoomId', accessAuthorizedToken, clientController.postUploadFileToChatRoom);// 7. 실시간 채팅 및 채팅창 실시간 업데이트

export default router;
