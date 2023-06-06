import { Router } from 'express';

import viewController from '../controller/view.js';

const router = Router();

// GET /
router.get('/',viewController.getMainPage);// 메인페이지

// GET /create
router.get('/channel',viewController.getAddChannelPage);// 채널 추가 페이지

// GET /mychannels
router.get('/mychannels',viewController.getMyChannelList);// 나의 참여 채널 목록 페이지

export default router;
