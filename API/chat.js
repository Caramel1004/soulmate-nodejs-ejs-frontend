import fetch from 'node-fetch';
import { successType, errorType } from '../util/status.js';

const chatAPI = {
    // 해당 유저의 채널목록 API요청
    postSendChat: async (token, channelId, chatRoomId, formData) => {
        try {
            const response = await fetch('http://localhost:8080/v1/chat/' + channelId + '/' + chatRoomId, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: formData
            });

            const resData = await response.json();
            console.log('resData api', resData);

            return resData;
        } catch (err) {
            throw err;
        }
    }
}

export default chatAPI;