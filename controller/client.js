import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import channelService from '../service/channel.js'
import chatAPI from '../API/chat.js'

/**
 * 1. 채널 생성
 * 2. 채널 퇴장
 * 3. 해당 채널에 유저 초대
 * 4. 채팅방 생성
 * 5. 채팅방에 유저 초대
 * 6. 실시간 채팅
 * 7. 실시간 파일(자료) 업로드
 * 8. 워크스페이스에 자료 업로드
 * 9. 워크스페이스에서 해당 게시물에 댓글
 * 6. 워크 스페이스 생성
 * 7. 워크 스페이스에 유저 초대 -> 전체공개 or 초대한 유저만 이용
 */

const clientControlller = {
    //채팅 방 접속
    getMyChatRoombyChannelId: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId;
            const chatRoomId = req.params.chatRoomId;
            // console.log(`channelId: ${channelId}, chatRoomId: ${chatRoomId}`);
            const response = await fetch('http://localhost:8080/v1/chat/' + channelId + '/' + chatRoomId, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();//동기화 해줘야해!!
            // console.log('data: ', data);
            const userChatRooms = data.chatRooms;//네이브바에 채팅목록 데이터
            const chatRoomData = data.chatRoomData;// 채팅 박스
            const userList = data.userList;// 참여자 보드에 들어갈 참여자 데이터

            // console.log('chatRoomData: ', chatRoomData);
            // console.log('userChatRooms: ', userChatRooms);

            const dateGroup = [];
            let year;
            const chatObjList = chatRoomData.chatList;

            chatObjList.map(chat => {
                const data = {};
                year = new Date(chat.createdAt).getFullYear();
                const timestamp = new Date(chat.createdAt).toTimeString().split(' ')[0];//ex)09:51:35 GMT+0900 (한국 표준시)

                let hour = parseInt(timestamp.split(':')[0]);

                const when = hour >= 12 ? '오후' : '오전';

                if (when === '오후') {
                    hour %= 12;
                }

                const min = timestamp.split(':')[1];

                chat.createdAt = when + ' ' + hour + ':' + min;

                return chat;
            });

            res.render('chat/chat-board', {
                path: '채팅방',
                title: chatRoomData.roomName,
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                chatRooms: userChatRooms,
                chatList: chatObjList,
                userList: userList,
                channel: { _id: channelId },
                chatRoomId: chatRoomData._id,
                state: 'on'
            });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 1. 채널 생성
    postCreateChannel: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelName = req.body.channelName;// 채널 명
            const thumbnail = req.body.thumbnail;// 채널 썸네일
            const category = req.body.category;// 카테고리
            const contents = req.body.contents;// 채널 멘트
            const open = req.body.open;

            console.log('category: ', category);
            const response = await fetch('http://localhost:8080/v1/channel/create', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelName: channelName,
                    thumbnail: thumbnail,
                    category: category,
                    contents: contents,
                    open: open
                })
            });

            const resData = await response.json();

            // console.log(resData);

            res.redirect('/mychannels?searchWord=all');

        } catch (err) {
            next(err);
        }
    },
    // 2. 채널 퇴장
    postExitChannel: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId;
            console.log(channelId);
            const response = await fetch('http://localhost:8080/v1/channel/exit/' + channelId, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId
                })
            });

            const data = await response.json();
            res.redirect('http://localhost:3000/client/mychannels');

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    //3. 해당 채널에 유저 초대
    postInviteUserToChannel: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId;
            const invitedUserId = req.body.invitedUserId;

            console.log('invitedUserId: ', invitedUserId);
            console.log('channelId: ', channelId);

            const response = await fetch('http://localhost:8080/v1/channel/invite/' + channelId, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId,
                    invitedUserId: invitedUserId
                })
            });

            const data = await response.json();

            res.redirect('http://localhost:3000/client/mychannels/' + data.channel._id);
        } catch (error) {

        }
    },
    // 4. 채팅방 생성
    postCreateChatRoom: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId
            const roomName = req.body.roomName;

            const data = await channelService.postCreateChatRoom(jsonWebToken, channelId, roomName, next);
            

            res.redirect('http://localhost:3000/client/chat/' + data.chatRoom.channelId + '/' + data.chatRoom._id);
        } catch (err) {
            next(err);
        }
    },
    // 5. 채팅방 유저 초대
    postInviteUsersToChatRoom: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId
            const chatRoomId = req.params.chatRoomId;
            const usersJson = req.body.users;
            const checkedUsersId = [];

            console.log(usersJson);
            if (!usersJson) {
                return res.redirect('http://localhost:3000/client/chat/' + channelId + '/' + chatRoomId);;
            }

            if (Array.isArray(usersJson)) {
                const ids = usersJson.map(user => {
                    const parsingData = JSON.parse(user);
                    return parsingData._id;
                });
                checkedUsersId = [...ids];
            } else {
                checkedUsersId.push(JSON.parse(usersJson)._id);
            }

            const body = {
                channelId: channelId,
                chatRoomId: chatRoomId,
                selectedId: checkedUsersId
            }
            console.log(checkedUsersId);

            const resData = await chatAPI.postInviteUsersToChatRoom(jsonWebToken, body, channelId, chatRoomId);

            res.redirect('http://localhost:3000/client/chat/' + channelId + '/' + chatRoomId);
        } catch (err) {
            throw err;
        }
    },
    //실시간 채팅
    postSendChat: async (req, res, next) => {
        try {
            const token = req.cookies.token;//jwt

            const formData = new FormData();
            formData.append('chat', req.body.chat);

            const resData = await chatAPI.postSendChat(token, req.params.channelId, req.params.chatRoomId, formData);

            console.log(resData);
            res.status(resData.status.code).json({
                status: resData.state
            });
        } catch (err) {
            throw err
        }
    },
    // 채팅방 실시간 파일 업로드
    postUploadFileToChatRoom: async (req, res, next) => {
        try {
            const token = req.cookies.token;//jwt

            console.log(req.file);
            console.log(req.file.buffer);
            const formData = new FormData();
            const blob = new Blob([req.file.originalname], { type: 'multipart/form-data' });

            formData.set('file', req.file.buffer, req.file.originalname);
            const filenameBlob = formData.get('file');

            // const getAll = formData.getAll();
            // console.log('getAll: ', getAll);
            // const resData = await chatAPI.postUploadFileToChatRoom(token, req.params.channelId, req.params.chatRoomId, formData);

            // if(resData.error) {
            //     return res.status(resData.error.errReport.code).json({
            //         errReport: resData.error.errReport
            //     })
            // }
            // console.log(resData);
            res.status(200).json({
                status: 'test'
            });
        } catch (err) {
            throw err;
        }
    }
}

export default clientControlller;