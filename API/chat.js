import fetch from 'node-fetch';
import { successType, errorType } from '../util/status.js';
import dotenv from 'dotenv';

dotenv.config();

const chatAPI = {
    // 1. 채팅방 세부정보 요청
    getLoadChatRoom: async (token, refreshToken, channelId, chatRoomId, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/v1/chat/${channelId}/${chatRoomId}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                }
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 6. 실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트 요청
    postSendChatAndUploadFilesToChatRoom: async (token, refreshToken, channelId, chatRoomId, formData, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/v1/chat/${channelId}/${chatRoomId}`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken
                },
                body: formData
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 4. 해당 채널에 속한 선택된 유저들을 초대
    postInviteUsersToChatRoom: async (token, refreshToken, body, channelId, chatRoomId) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/v1/chat/invite/${channelId}/${chatRoomId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 5. 채팅방 퇴장
    patchExitChatRoom: async (token, refreshToken, channelId, chatRoomId, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/v1/chat/exit/${channelId}/${chatRoomId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId,
                    chatRoomId: chatRoomId
                })
            });
            return await response.json();
        } catch (err) {
            next(err);
        }
    },
    getLoadFilesInChatRoom: async (token, refreshToken, channelId, chatRoomId, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/v1/chat/file-list/${channelId}/${chatRoomId}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                }
            });
            const resData = await response.json();
            
            return resData;
        } catch (err) {
            next(err);
        }
    }
}

export default chatAPI;