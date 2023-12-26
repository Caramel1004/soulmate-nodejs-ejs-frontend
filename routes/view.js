import { Router } from 'express';

import viewController from '../controller/view.js';
import { hasAuthorizedToken } from '../validator/valid.js'

const router = Router();

/**
 * 1. 메인 페이지 == 오픈 채널 목록 페이지
 *  1-1. 오픈채널 세부 정보 페이지
 * 2. 내 프로필 관리 페이지
 * 3. 나의 채널 목록 페이지
 * 4. 채널 추가 페이지
 * 5. 관심 채널 목록 페이지
 * 6. 채널입장 -> 채널 내부 페이지
 * 7. 채팅방 입장 -> 채팅방 페이지
 */

router.get('/copyright', viewController.getCopyrightPage);

// GET /
router.get('/', viewController.getMainPage);// 1. 메인페이지 == 오픈 채널 컨텐츠가 있는 페이지

// GET /open/:channelId
router.get('/open/:channelId', viewController.getOpenChannelDetailPage); // 1-1. 오픈 채널 세부 정보 페이지

//GET /myprofile
router.get('/myprofile', hasAuthorizedToken, viewController.getMyProfilePage); // 2. 내 프로필 관리 페이지

// GET /mychannels
router.get('/mychannels', hasAuthorizedToken, viewController.getMyChannelListPage);// 3. 나의 채널 페이지

// GET /channel
router.get('/channel', hasAuthorizedToken, viewController.getAddChannelPage);// 4. 채널 추가 페이지

// GET /wishchannels
router.get('/wishchannels', hasAuthorizedToken, viewController.getMyWishChannelListPage);// 5. 나의 관심 채널 목록 페이지

//GET /mychannel/:channelId
router.get('/mychannel/:channelId', hasAuthorizedToken, viewController.getEnterMyChannelPage);// 6. 채널입장 -> 채널 내부 페이지

//GET /channel/chat/:channelId/:chatRoomId
router.get('/channel/chat/:channelId/:chatRoomId', hasAuthorizedToken, viewController.getEnterChatRoomPage);// 7. 채팅방 입장 -> 채팅방 페이지

//GET /channel/workspace/:channelId/:workspaceId
router.get('/channel/workspace/:channelId/:workspaceId', hasAuthorizedToken, viewController.getEnterWorkSpacePage);// 8. 워크스페이스 입장 -> 워크스페이스 페이지


export default router;
