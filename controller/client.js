import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import channelService from '../service/channel.js'
import chatAPI from '../API/chat.js'
import chatService from '../service/chat.js';
import { hasError } from '../validator/valid.js';
import workspaceService from '../service/workspace.js';

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
 * 10. 워크스페이스에서 해당 게시물에 댓글 달기
 * 11. 워크 스페이스에 유저 초대 -> 전체공개 or 초대한 유저만 이용
 * 12. 해당 게시물 댓글 조회
 * 13. 해당 게시물에 댓글 달기
 * 14. 관심채널 추가 또는 삭제(토글 관계)
 * 15. 채팅방 퇴장
 * 16. 공용기능: 채널에있는 유저 목록 불러오기
 */

const clientControlller = {
    // 1. 채널 생성
    postCreateChannel: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const refreshToken = req.cookies.refreshToken;
            const channelName = req.body.channelName;// 채널 명
            const thumbnail = req.body.thumbnail;// 채널 썸네일
            const category = req.body.category;// 카테고리
            const contents = req.body.contents;// 채널 멘트
            const open = req.body.open;

            const response = await fetch('http://localhost:8080/v1/channel/create', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    RefreshToken: refreshToken,
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

            const data = await response.json();
            hasError(data.error);

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
                    RefreshToken: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId
                })
            });

            const data = await response.json();
            hasError(data.error);

            res.redirect('/mychannels');
        } catch (err) {
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

            const data = await channelService.postInviteUserToChannel(jsonWebToken, req.cookies.refreshToken, channelId, invitedUserId, next);
            hasError(data.error);

            console.log(data);
            res.redirect('/mychannel/' + data.channelId + '?searchWord=member');
        } catch (err) {
            next(err);
        }
    },
    // 4. 채팅방 생성
    postCreateChatRoom: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId
            const roomName = req.body.roomName;

            const data = await channelService.postCreateChatRoom(jsonWebToken, req.cookies.refreshToken, channelId, roomName, next);
            hasError(data.error);

            res.redirect('/channel/chat/' + data.chatRoom.channelId + '/' + data.chatRoom._id);
        } catch (err) {
            next(err);
        }
    },
    // 5. 해당 채널에 속한 선택된 유저들을 채팅방에 초대
    postInviteUsersToChatRoom: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId
            const chatRoomId = req.params.chatRoomId;
            const usersJson = req.body.users;
            let checkedUsersId = [];

            // console.log('chatRoomId: ',chatRoomId);
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
            // console.log(checkedUsersId);

            const data = await chatAPI.postInviteUsersToChatRoom(jsonWebToken, req.cookies.refreshToken, body, channelId, chatRoomId, next);
            hasError(data.error);

            res.redirect('http://localhost:3000/channel/chat/' + channelId + '/' + chatRoomId);
        } catch (err) {
            next(err);
        }
    },
    // 6. 실시간 채팅
    postSendChat: async (req, res, next) => {
        try {
            const token = req.cookies.token;//jwt

            const formData = new FormData();
            formData.append('chat', req.body.chat);

            const data = await chatService.postSendChat(token, req.cookies.refreshToken, req.params.channelId, req.params.chatRoomId, formData, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 7. 채팅방 실시간 파일 업로드
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
            // const resData = await chatAPI.postUploadFileToChatRoom(token, req.cookies.refreshToken,req.params.channelId, req.params.chatRoomId, formData);

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
            next(err);
        }
    },
    // 8. 워크스페이스 생성
    postCreateWorkSpace: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            const open = req.body.open;
            const workSpaceName = req.body.workSpaceName;
            const comment = req.body.comment;

            const data = await channelService.postCreateWorkSpace(token, req.cookies.refreshToken, req.params.channelId, open, workSpaceName, comment, next);
            hasError(data.error);

            res.redirect(`/channel/workspace/${data.workSpace.channelId}/${data.workSpace._id}`);
        } catch (err) {
            next(err);
        }
    },
    // 9. 워크스페이스에 게시물 생성
    postCreatePostToWorkSpace: async (req, res, next) => {
        try {
            const token = req.cookies.token;

            const formData = new FormData();
            formData.append('content', req.body.content);

            const data = await workspaceService.postCreatePostToWorkSpace(token, req.cookies.refreshToken, req.params.channelId, req.params.workSpaceId, formData, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 11. 워크 스페이스에 유저 초대 -> 전체공개 or 초대한 유저만 이용
    postInviteUsersToWorkSpace: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId
            const workSpaceId = req.params.workSpaceId;

            const data = await workspaceService.postInviteUsersToWorkSpace(jsonWebToken, req.cookies.refreshToken, req.body, channelId, workSpaceId, next);
            hasError(data.error);

            res.redirect('http://localhost:3000/channel/chat/' + channelId + '/' + chatRoomId);
        } catch (err) {
            next(err);
        }
    },
    // 12. 해당 게시물 댓글 조회
    postGetReplyToPost: async (req, res, next) => {
        try {
            const token = req.cookies.token;

            const data = await workspaceService.getReplyToPost(token, req.cookies.refreshToken, req.body.postId, req.params.channelId, req.params.workSpaceId, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status,
                post: data.post
            });
        } catch (err) {
            next(err);
        }
    },
    // 13. 해당 게시물에 댓글 달기
    postCreateReplyToPost: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            const formData = new FormData();
            formData.append('postId', req.body.postId);
            formData.append('content', req.body.content);

            const data = await workspaceService.postCreateReplyToPost(token, req.cookies.refreshToken, req.params.channelId, req.params.workSpaceId, formData, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 14. 관심채널 추가 또는 삭제(토글 관계)
    postAddOpenChannelToWishChannel: async (req, res, next) => {
        try {
            const token = req.cookies.token;

            const data = await channelService.postAddOpenChannelToWishChannel(token, req.cookies.refreshToken, req.body.channelId, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status,
                action: data.action
            });
        } catch (err) {
            next(err)
        }
    },
    // 15. 채팅방 퇴장
    patchExitChatRoom: async (req, res, next) => {
        try {
            const token = req.cookies.token;

            const data = await chatService.patchExitChatRoom(token, req.cookies.refreshToken, req.body.channelId, req.body.chatRoomId, next);
            hasError(data.error);

            res.status(data.status.code).json({
                removedChatRoom: data.removedChatRoom
            });
        } catch (err) {
            next(err);
        }
    },
    // 16. 공용기능: 채널에있는 유저 목록 불러오기
    getMemberListOnChannel: async (req, res, next) => {
        try {
            const data = await channelService.getChannelDetailByChannelId(req.cookies.token, req.cookies.refreshToken, req.params.channelId, next);
            hasError(data.error);
            console.log(data);
            res.status(data.status.code).json({
                status: data.status,
                members: data.channel.members
            });
        } catch (err) {
            next(err)
        }
    }
}

export default clientControlller;