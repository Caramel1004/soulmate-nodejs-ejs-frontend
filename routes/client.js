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
 * 10. 워크스페이스에서 해당 유저의 게시물 삭제
 * 11. 워크스페이스에서 해당 유저의 게시물 내용 수정
 * 12. 해당 게시물 댓글 조회
 * 13. 해당 게시물에 댓글 달기
 * 14. 관심채널 추가 또는 삭제(토글 관계)
 * 15. 채팅방 퇴장
 * 16. 공용기능: 채널에있는 유저 목록 불러오기
 * 17. 워크스페이스 퇴장
 * 18. 워크스페이스 설명 스크립트 편집
 * 19. 워크 스페이스에 유저 초대 -> 전체공개 or 초대한 유저만 이용
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

// DELETE /client/workspace/delete-post/:channelId/:workSpaceId
router.delete('/workspace/delete-post/:channelId/:workSpaceId/:postId', accessAuthorizedToken, clientController.deletePostByCreatorInWorkSpace);//10. 워크스페이스에서 해당 유저의 게시물 삭제

//  PATCH/client/workspace/edit-post/:channelId/:workSpaceId
router.patch('/workspace/edit-post/:channelId/:workSpaceId', accessAuthorizedToken, clientController.patchEditPostByCreatorInWorkSpace);//11. 워크스페이스에서 해당 유저의 게시물 내용 수정

// POST /client/workspace/:channelId/:workSpaceId/post/replies
router.post('/workspace/:channelId/:workSpaceId/post/replies', accessAuthorizedToken, clientController.postGetReplyToPost);// 12. 해당 게시물 댓글 조회

// POST /client/workspace/post/create-reply/:channelId/:workSpaceId
router.post('/workspace/post/create-reply/:channelId/:workSpaceId', accessAuthorizedToken, clientController.postCreateReplyToPost);// 13. 해당 게시물에 댓글 달기

// PATCH /client/workspace/post/edit-reply/:channelId/:workSpaceId
router.patch('/workspace/post/edit-reply/:channelId/:workSpaceId', accessAuthorizedToken, clientController.patchEditReplyByCreatorInPost);// 13. 해당 게시물에 댓글 수정

// DELETE /client/workspace/post/delete-reply/:channelId/:workSpaceId/:postId/:replyId
router.delete('/workspace/post/delete-reply/:channelId/:workSpaceId/:postId/:replyId', accessAuthorizedToken, clientController.deleteReplyByCreatorInPost);// 13. 해당 게시물에서 해당 댓글삭제 

// POST /client/add-or-remove-wishchannel
router.post('/add-or-remove-wishchannel', accessAuthorizedToken, clientController.postAddOpenChannelToWishChannel);// 14. 관심채널 추가 또는 삭제(토글 관계)

// PATCH /client/chat/exit-chat-room/:channelId/:chatRoomId
router.patch('/chat/exit-chat-room/:channelId/:chatRoomId', accessAuthorizedToken, clientController.patchExitChatRoom);// 15. 채팅방 퇴장

// GET /client/channel/member-list/:channelId
router.get('/channel/member-list/:channelId', accessAuthorizedToken, clientController.getMemberListOnChannel);// 16. 공용기능: 채널에있는 유저 목록 불러오기

// PATCH /client/workspace/exit/:channelId/:workSpaceId
router.patch('/workspace/exit/:channelId/:workSpaceId', accessAuthorizedToken, clientController.patchExitWorkSpace);// 17. 워크스페이스 퇴장

// PATCH /client/workspace/edit-comment/:channelId/:workSpaceId
router.patch('/workspace/edit-comment/:channelId/:workSpaceId', accessAuthorizedToken, clientController.patchEditCommentScript);// 18. 워크스페이스 설명 스크립트 편집

// PATCH /client/workspace/invite/:channelId/:workSpaceId
router.patch('/workspace/invite/:channelId/:workSpaceId', accessAuthorizedToken, clientController.postInviteUsersToWorkSpace);// 19. 워크 스페이스에 유저 초대 -> 전체공개 or 초대한 유저만 이용

// PATCH /client/edit-myprofile
router.patch('/edit-myprofile', accessAuthorizedToken, clientController.patchEditMyProfileByReqUser);// 나의 프로필 수정

export default router;
