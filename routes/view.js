import { Router } from 'express';

import viewController from '../controller/view.js';
import { accessAuthorizedToken } from '../validator/valid.js'

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

// GET /
router.get('/', viewController.getMainPage);// 1. 메인페이지 == 오픈 채널 컨텐츠가 있는 페이지

// GET /
// router.get('/:channelId', viewController.getOpenChannelDetailPage);// 1-1. 오픈 채널 세부 정보 페이지

//GET /myprofile
router.get('/myprofile', accessAuthorizedToken, viewController.getMyProfile); // 2. 내 프로필 관리 페이지

// GET /mychannels
router.get('/mychannels', accessAuthorizedToken, viewController.getMyChannelListPage);// 3. 나의 채널 페이지

// GET /channel
router.get('/channel', accessAuthorizedToken, viewController.getAddChannelPage);// 4. 채널 추가 페이지

// GET /wishchannels
router.get('/wishchannels', accessAuthorizedToken, viewController.getMyWishChannelListPage);// 5. 나의 관심 채널 목록 페이지

//GET /mychannel/:channelId
router.get('/mychannel/:channelId', viewController.getEnterMyChannelPage);// 6. 채널입장 -> 채널 내부 페이지

//GET /channel/chat/:channelId/:chatRoomId
router.get('/channel/chat/:channelId/:chatRoomId', viewController.getEnterChatRoomPage);// 7. 채팅방 입장 -> 채팅방 페이지

//GET /channel/workspace/:channelId/:chatRoomId
router.get('/channel/workspace/:channelId/:workspaceId', viewController.getEnterWorkSpacePage);// 8. 워크스페이스 입장 -> 워크스페이스 페이지


export default router;
