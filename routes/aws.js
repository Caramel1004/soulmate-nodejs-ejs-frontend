import { Router } from 'express';

import viewController from '../controller/view.js';

const router = Router();

router.get('/health-checker', (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        msg: '정상'
    });
});


export default router;