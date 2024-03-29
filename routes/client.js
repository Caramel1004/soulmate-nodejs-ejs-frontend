import { Router } from 'express';
import multer from 'multer';

import clientController from '../controller/client.js';
import {
    hasAuthorizedToken,
    validationChainToCheckRequestedValidBodyFromChannelAddPage,
    validationChainToCheckRequestedValidBodyFromFeedUploadModal,
    validationChainToCheckRequestedValidBodyFromWorkspaceAddModal,
    validationChainToCheckRequestedValidBodyFromChatRoomAddModal
} from '../validator/valid.js'

const router = Router();

// 파일 data를 백엔드 서버로 보내기 위한 임시메모리에 저장 => 버퍼형태로 저장(formData)
const memoryStorage = multer.memoryStorage();

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
router.post('/channel/create',
    hasAuthorizedToken,
    multer({ storage: memoryStorage }).single('thumbnail'),
    validationChainToCheckRequestedValidBodyFromChannelAddPage,
    clientController.postCreateChannel);// 1. 채널 생성

//POST /client/channel/exit/:channelId
router.get('/channel/exit/:channelId', hasAuthorizedToken, clientController.postExitChannel);// 2. 채널 퇴장

//PATCH /client/channel/invite/:channelId
router.patch('/channel/invite/:channelId', hasAuthorizedToken, clientController.patchInviteUserToChannel);// 3. 해당 채널에 유저 초대

//PATCH /client/channel/edit/:channelId
router.patch('/channel/edit-channel/:channelId',
    hasAuthorizedToken,
    multer({ storage: memoryStorage }).single('thumbnail'),
    clientController.patchEditChannelByReqUser);// 채널 정보 수정

//POST /client/chat/:channelId
router.post('/chat/:channelId',
    hasAuthorizedToken,
    validationChainToCheckRequestedValidBodyFromChatRoomAddModal,
    clientController.postCreateChatRoom);// 4. 채팅방 생성

//POST /client/chat/invite/:channelId/:chatRoomId
router.post('/chat/invite/:channelId/:chatRoomId', hasAuthorizedToken, clientController.postInviteUsersToChatRoom);// 5. 채팅방에 유저 초대

//POST /client/chat/:channelId/:chatRoomId
router.post('/chat/:channelId/:chatRoomId', hasAuthorizedToken, multer({ storage: memoryStorage }).array('files', 12), clientController.postSendChatAndUploadFilesToChatRoom);// 6. 실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트

// POST /client/chat/upload-file/:channelId/:chatRoomId
router.post('/chat/upload-file/:channelId/:chatRoomId', hasAuthorizedToken, multer({ storage: memoryStorage }).array('files', 12), clientController.postUploadFileToChatRoom);// 7. 파일 업로드

// POST /client/workspace/:channelId
router.post('/workspace/:channelId',
    hasAuthorizedToken,
    validationChainToCheckRequestedValidBodyFromWorkspaceAddModal,
    clientController.postCreateWorkSpace);// 8. 워크스페이스 생성

// POST /client/workspace/create-post/:channelId/:workSpaceId
router.post('/workspace/create-post/:channelId/:workSpaceId', hasAuthorizedToken, multer({ storage: memoryStorage }).array('files', 12), clientController.postCreatePostToWorkSpace);// 9. 워크스페이스에 게시물 생성

// DELETE /client/workspace/delete-post/:channelId/:workSpaceId
router.delete('/workspace/delete-post/:channelId/:workSpaceId/:postId', hasAuthorizedToken, clientController.deletePostByCreatorInWorkSpace);//10. 워크스페이스에서 해당 유저의 게시물 삭제

// PATCH /client/workspace/edit-post/:channelId/:workSpaceId
router.patch('/workspace/edit-post/:channelId/:workSpaceId', hasAuthorizedToken, multer({ storage: memoryStorage }).array('files', 12), clientController.patchEditPostByCreatorInWorkSpace);//11. 워크스페이스에서 해당 유저의 게시물 내용 수정

// POST /client/workspace/post/replies/:channelId/:workSpaceId/:postId
router.get('/workspace/post/replies/:channelId/:workSpaceId/:postId', hasAuthorizedToken, clientController.getRepliesToPost);// 12. 해당 게시물 댓글 조회

// POST /client/workspace/post/create-reply/:channelId/:workSpaceId
router.post('/workspace/post/create-reply/:channelId/:workSpaceId', hasAuthorizedToken, multer({ storage: memoryStorage }).single('file'), clientController.postCreateReplyToPost);// 13. 해당 게시물에 댓글 달기

// PATCH /client/workspace/post/edit-reply/:channelId/:workSpaceId
router.patch('/workspace/post/edit-reply/:channelId/:workSpaceId', hasAuthorizedToken, multer({ storage: memoryStorage }).single('file'), clientController.patchEditReplyByCreatorInPost);// 13. 해당 게시물에 댓글 수정

// DELETE /client/workspace/post/delete-reply/:channelId/:workSpaceId/:postId/:replyId
router.delete('/workspace/post/delete-reply/:channelId/:workSpaceId/:postId/:replyId', hasAuthorizedToken, clientController.deleteReplyByCreatorInPost);// 13. 해당 게시물에서 해당 댓글삭제 

// POST /client/add-or-remove-wishchannel
router.post('/add-or-remove-wishchannel', hasAuthorizedToken, clientController.postAddOpenChannelToWishChannel);// 14. 관심채널 추가 또는 삭제(토글 관계)

// PATCH /client/chat/exit-chat-room/:channelId/:chatRoomId
router.patch('/chat/exit-chat-room/:channelId/:chatRoomId', hasAuthorizedToken, clientController.patchExitChatRoom);// 15. 채팅방 퇴장

// GET /client/channel/member-list/:channelId
router.get('/channel/member-list/:channelId', hasAuthorizedToken, clientController.getMemberListOnChannel);// 16. 공용기능: 채널에있는 유저 목록 불러오기

// GET /client/channel/chat-room/channel-members/:channelId/:chatRoomId
router.get('/channel/chat-room/channel-members/:channelId/:chatRoomId', hasAuthorizedToken, clientController.getMemberListFromChannelToChatRoom);// 16-2. 공용기능: 채널에있는 유저 목록 불러오기

// PATCH /client/workspace/exit
router.patch('/workspace/exit', hasAuthorizedToken, clientController.patchExitWorkSpace);// 17. 워크스페이스 퇴장

// PATCH /client/workspace/edit-comment/:channelId/:workSpaceId
router.patch('/workspace/edit-comment/:channelId/:workSpaceId', hasAuthorizedToken, clientController.patchEditCommentScript);// 18. 워크스페이스 설명 스크립트 편집

// PATCH /client/workspace/invite/:channelId/:workSpaceId
router.patch('/workspace/invite/:channelId/:workSpaceId', hasAuthorizedToken, clientController.postInviteUsersToWorkSpace);// 19. 워크 스페이스에 유저 초대 -> 전체공개 or 초대한 유저만 이용

// PATCH /client/edit-myprofile
router.patch('/edit-myprofile', hasAuthorizedToken, multer({ storage: memoryStorage }).array('data', 1), clientController.patchEditMyProfileByReqUser);// 나의 프로필 수정

// POST /client/channel/create-feed/:channelId
router.post('/channel/create-feed/:channelId',
    hasAuthorizedToken,
    multer({ storage: memoryStorage }).array('files', 5),
    validationChainToCheckRequestedValidBodyFromFeedUploadModal,
    clientController.postCreateFeedToChannel);// 20. 홈채널에 내피드 생성

// PATCH /client/channel/edit-feed/:channelId/:feedId
router.patch('/channel/edit-feed/:channelId/:feedId',
    hasAuthorizedToken,
    multer({ storage: memoryStorage }).array('files', 5),
    validationChainToCheckRequestedValidBodyFromFeedUploadModal,
    clientController.patchEditFeedToChannel);// 21. 홈채널에 내피드 수정

// DELETE /client/channel/delete-feed/:channelId/:feedId
router.delete('/channel/delete-feed/:channelId/:feedId', hasAuthorizedToken, clientController.deleteRemoveFeedByReqUser);// 22. 홈채널에 내피드 삭제

// PATCH /client/channel/plus-or-minus-feed-like
router.patch('/channel/plus-or-minus-feed-like', hasAuthorizedToken, clientController.patchPlusOrMinusNumberOfLikeInFeed);// 22. 홈채널에 내피드 삭제

// GET /client/chat/file-list/:channelId/:chatRoomId
router.get('/chat/file-list/:channelId/:chatRoomId', hasAuthorizedToken, clientController.getLoadFilesInChatRoom);// 22. 홈채널에 내피드 삭제

// POST /client/user/search/:searchWord
router.post('/user/search/:searchWord', hasAuthorizedToken, clientController.getSearchUserByKeyWord);

export default router;
