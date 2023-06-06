import { Router } from 'express';

import viewController from '../controller/view.js';
import { accessAuthorizedToken } from '../validator/valid.js'

const router = Router();

// GET /
router.get('/', viewController.getMainPage);// 메인페이지

// GET /channel
router.get('/channel', accessAuthorizedToken, viewController.getAddChannelPage);// 채널 추가 페이지

// GET /mychannels
router.get('/mychannels', accessAuthorizedToken, viewController.getMyChannelList);// 나의 참여 채널 목록 페이지

export default router;
