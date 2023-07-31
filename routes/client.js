import { Router } from 'express';

import clientController from '../controller/client.js';
import { accessAuthorizedToken } from '../validator/valid.js'

const router = Router();

/**
 * 1. 채널 생성
 * 2. 채널 퇴장
 * 3. 해당 채널에 유저 초대
 * 4. 채팅방 생성
 * 5. 해당 채널에 속한 선택된 유저들을 초대
 * 6. 실시간 채팅
 * 7. 실시간 파일(자료) 업로드
 * 8. 워크 스페이스 생성
 * 9. 워크스페이스에 게시물 생성
 * 10. 워크스페이스에서 해당 게시물에 댓글 달기
 * 11. 워크 스페이스에 유저 초대 -> 전체공개 or 초대한 유저만 이용
 * 12. 해당 게시물 댓글 조회
 * 13. 해당 게시물에 댓글 달기
 * 14. 관심채널 추가 또는 삭제(토글 관계)
 * 15. 채팅방 퇴장
 * 16. 공용기능: 채널에있는 유저 목록 불러오기
 */

//POST /client/channel/create
router.post('/channel/create', accessAuthorizedToken, clientController.postCreateChannel);// 1. 채널 생성

//POST /client/channel/exit/:channelId
router.get('/channel/exit/:channelId', accessAuthorizedToken, clientController.postExitChannel);// 2. 채널 퇴장

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

// POST /client/workspace/:channelId
router.post('/workspace/:channelId', accessAuthorizedToken, clientController.postCreateWorkSpace);// 8. 워크스페이스 생성

// POST /client/workspace/create-post/:channelId/:workSpaceId
router.post('/workspace/create-post/:channelId/:workSpaceId', accessAuthorizedToken, clientController.postCreatePostToWorkSpace);// 9. 워크스페이스에 게시물 생성

// POST /client/workspace/create-post/:channelId/:workSpaceId
router.post('/workspace/invite/:channelId/:workSpaceId', accessAuthorizedToken, clientController.postInviteUsersToWorkSpace);// 11. 워크 스페이스에 유저 초대 -> 전체공개 or 초대한 유저만 이용

// POST /client/workspace/:channelId/:workSpaceId/post/replies
router.post('/workspace/:channelId/:workSpaceId/post/replies', accessAuthorizedToken, clientController.postGetReplyToPost);// 12. 해당 게시물 댓글 조회

// POST /client/workspace/:channelId/:workSpaceId/post/create-reply
router.post('/workspace/:channelId/:workSpaceId/post/create-reply', accessAuthorizedToken, clientController.postCreateReplyToPost);// 13. 해당 게시물에 댓글 달기

// POST /client/add-or-remove-wishchannel
router.post('/add-or-remove-wishchannel', accessAuthorizedToken, clientController.postAddOpenChannelToWishChannel);// 14. 관심채널 추가 또는 삭제(토글 관계)

// POST /client/chat/exit-chat-room/:channelId/:chatRoomId
router.patch('/chat/exit-chat-room/:channelId/:chatRoomId', accessAuthorizedToken, clientController.patchExitChatRoom);// 15. 채팅방 퇴장

// GET /client/channel/member-list/:channelId
router.get('/channel/member-list/:channelId', accessAuthorizedToken, clientController.getMemberListOnChannel);// 16. 공용기능: 채널에있는 유저 목록 불러오기

export default router;
