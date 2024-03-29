import chatAPI from '../API/chat.js'

const chatService = {
    // 1. 채팅룸 로딩
    getLoadChatRoom: async (jsonWebToken, refreshToken, channelId, chatRoomId, next) => {
        try {
            const data = await chatAPI.getLoadChatRoom(jsonWebToken, refreshToken, channelId, chatRoomId, next);

            let chatObjList = data.chatRoom.chats;
            const chatSetList = [];
            if (chatObjList.length > 0) {
                let tmp = chatObjList;
                while (tmp.length > 0) {
                    let startDate = new Date(tmp[0].createdAt).toLocaleDateString('ko', { year: 'numeric', month: 'long', day: 'numeric' });
                    const sameDateList = chatObjList.filter(chat => new Date(chat.createdAt).toLocaleDateString('ko', { year: 'numeric', month: 'long', day: 'numeric' }) == startDate);
                    console.log('sameDateList: ', sameDateList);
                    chatSetList.push(sameDateList);
                    tmp = [...tmp.filter(chat => new Date(chat.createdAt).toLocaleDateString('ko', { year: 'numeric', month: 'long', day: 'numeric' }) != startDate)];
                    console.log('tmp: ', tmp);
                }
                console.log('chatSetList: ', chatSetList);
            }

            if (chatSetList.length > 0) {
                let year;
                let month;
                let day;
                for (const set of chatSetList) {
                    set.map(chat => {
                        year = new Date(chat.createdAt).getFullYear();
                        month = new Date(chat.createdAt).getMonth() + 1;
                        day = new Date(chat.createdAt).getDate();
                        const timestamp = new Date(chat.createdAt).toTimeString().split(' ')[0];//ex)09:51:35 GMT+0900 (한국 표준시)

                        let hour = parseInt(timestamp.split(':')[0]);

                        const when = hour >= 12 ? '오후' : '오전';

                        if (month < 10) {
                            month = '0' + month;
                        } else if (month > 12) {
                            month = '0' + 1;
                        }

                        if (day < 10) {
                            day = '0' + day
                        }
                        if (when === '오후' && hour > 12) {
                            hour %= 12;
                        }

                        const min = timestamp.split(':')[1];

                        chat.fomatDate = `${year}년 ${month}월 ${day}일`;
                        chat.fomatTime = `${when} ${hour}:${min}`;

                        return chat;
                    });
                }
            }
            data.chatRoom.chats = [...chatSetList];
            console.log('data.chatRoom.chats: ', data.chatRoom.chats);
            return data;
        } catch (err) {
            next(err);
        }
    },
    // 2. 실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트
    postSendChatAndUploadFilesToChatRoom: async (token, refreshToken, channelId, chatRoomId, formData, next) => {
        try {
            const data = await chatAPI.postSendChatAndUploadFilesToChatRoom(token, refreshToken, channelId, chatRoomId, formData, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 3. 실시간으로 채팅방에 파일 업로드(이미지, 문서등) 요청
    postUploadFileToChatRoom: async (token, refreshToken, channelId, chatRoomId, formData, next) => {
        try {
            const data = await chatAPI.postUploadFileToChatRoom(token, refreshToken, channelId, chatRoomId, formData, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 4. 채팅방 퇴장
    patchExitChatRoom: async (token, refreshToken, channelId, chatRoomId, next) => {
        try {
            const data = await chatAPI.patchExitChatRoom(token, refreshToken, channelId, chatRoomId, next);

            return data;
        } catch (err) {
            next(err)
        }
    },
    getLoadFilesInChatRoom: async (token, refreshToken, channelId, chatRoomId, next) => {
        try {
            const data = await chatAPI.getLoadFilesInChatRoom(token, refreshToken, channelId, chatRoomId, next);
            let chatObjList = data.chatsWithFileUrlsInChatRoom;
            const chatSetList = [];
            if (chatObjList.length > 0) {
                let tmp = chatObjList;
                while (tmp.length > 0) {
                    let startDate = new Date(tmp[0].createdAt).toLocaleDateString('ko', { year: 'numeric', month: 'long', day: 'numeric' });
                    const sameDateList = chatObjList.filter(chat => new Date(chat.createdAt).toLocaleDateString('ko', { year: 'numeric', month: 'long', day: 'numeric' }) == startDate);
                    console.log('sameDateList: ', sameDateList);
                    chatSetList.push(sameDateList);
                    tmp = [...tmp.filter(chat => new Date(chat.createdAt).toLocaleDateString('ko', { year: 'numeric', month: 'long', day: 'numeric' }) != startDate)];
                }
            }

            if (chatSetList.length > 0) {
                for (const set of chatSetList) {
                    set.map(chat => {
                        chat.createdAt = new Date(chat.createdAt).toLocaleDateString('ko', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            weekday: 'long'
                        });
                        return chat;
                    });
                }
            }

            data.chatsWithFileUrlsInChatRoom = [...chatSetList];
            return data;
        } catch (err) {
            next(err);
        }
    }
}

export default chatService