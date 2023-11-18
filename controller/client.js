import fetch from 'node-fetch';
import { FormData } from 'formdata-node';

import workspaceService from '../service/workspace.js';
import channelService from '../service/channel.js'
import chatService from '../service/chat.js';
import userService from '../service/user.js';

import chatAPI from '../API/chat.js'

import { hasError } from '../validator/valid.js';

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
 * 10. 워크스페이스에서 해당 유저의 게시물 삭제
 * 11. 워크스페이스에서 해당 유저의 게시물 내용 수정 
 * 12. 해당 게시물 댓글 조회
 * 13. 해당 게시물에 댓글 달기
 * 14. 관심채널 추가 또는 삭제(토글 관계)
 * 15. 채팅방 퇴장
 * 16. 공용기능: 채널에있는 유저 목록 불러오기
 * 17. 워크스페이스 퇴장
 * 18. 워크스페이스 설명 스크립트 편집
 * 19. 워크 스페이스에 유저 초대 -> 전체공개 or 초대한 유저만 이용
 */

const clientControlller = {
    // 1. 채널 생성
    postCreateChannel: async (req, res, next) => {
        try {
            const jsonWebToken = req.signedCookies.token;
            const refreshToken = req.signedCookies.refreshToken;
            const channelName = req.body.channelName;// 채널 명
            const thumbnail = req.file;// 채널 썸네일
            const category = req.body.category;// 카테고리
            const comment = req.body.comment;// 채널 멘트
            const open = req.body.open;

            const formData = new FormData();
            formData.append('channelName', channelName);
            formData.append('thumbnail', JSON.stringify(thumbnail));
            formData.append('category', category);
            formData.append('comment', comment);
            formData.append('open', open);

            const response = await fetch('http://localhost:8080/v1/channel/create', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    RefreshToken: refreshToken
                },
                body: formData
            });

            const data = await response.json();
            hasError(data.error);
            req.session.userChannels.push(data.channel);

            res.status(data.status.code).json({
                status: data.status,
                channelId: data.channel._id
            })
        } catch (err) {
            next(err);
        }
    },
    // 2. 채널 퇴장
    postExitChannel: async (req, res, next) => {
        try {
            const jsonWebToken = req.signedCookies.token;
            const refreshToken = req.signedCookies.refreshToken;
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

            //세션에 저징된 채널 목록 업데이트
            req.session.userChannels = [...data.updatedChannels];

            res.redirect('/mychannels');
        } catch (err) {
            next(err);
        }
    },
    //3. 해당 채널에 유저 초대
    postInviteUserToChannel: async (req, res, next) => {
        try {
            const jsonWebToken = req.signedCookies.token;
            const channelId = req.params.channelId;
            const invitedUserId = req.body.invitedUserId;

            console.log('invitedUserId: ', invitedUserId);
            console.log('channelId: ', channelId);

            const data = await channelService.postInviteUserToChannel(jsonWebToken, req.signedCookies.refreshToken, channelId, invitedUserId, next);
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
            const jsonWebToken = req.signedCookies.token;
            const channelId = req.params.channelId
            const roomName = req.body.roomName;

            const data = await channelService.postCreateChatRoom(jsonWebToken, req.signedCookies.refreshToken, channelId, roomName, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status,
                chatRoom: data.chatRoom
            })
        } catch (err) {
            next(err);
        }
    },
    // 5. 해당 채널에 속한 선택된 유저들을 채팅방에 초대
    postInviteUsersToChatRoom: async (req, res, next) => {
        try {
            const jsonWebToken = req.signedCookies.token;
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

            const data = await chatAPI.postInviteUsersToChatRoom(jsonWebToken, req.signedCookies.refreshToken, body, channelId, chatRoomId, next);
            hasError(data.error);

            res.redirect('http://localhost:3000/channel/chat/' + channelId + '/' + chatRoomId);
        } catch (err) {
            next(err);
        }
    },
    // 6. 실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트
    postSendChatAndUploadFilesToChatRoom: async (req, res, next) => {
        try {
            const { token, refreshToken } = req.signedCookies;
            const { channelId, chatRoomId } = req.params;

            const formData = new FormData();
            formData.append('chat', req.body.chat);
            formData.append('files', JSON.stringify(req.files));

            const data = await chatService.postSendChatAndUploadFilesToChatRoom(token, refreshToken, channelId, chatRoomId, formData, next);
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
            const { token, refreshToken } = req.signedCookies;
            const { channelId, chatRoomId } = req.params;

            const formData = new FormData();
            formData.set('content', req.body.content);
            formData.set('files', JSON.stringify(req.files));

            const data = await chatService.postUploadFileToChatRoom(token, refreshToken, channelId, chatRoomId, formData, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 8. 워크스페이스 생성
    postCreateWorkSpace: async (req, res, next) => {
        try {
            console.log(req.body.open);
            const token = req.signedCookies.token;
            const open = req.body.open;
            const workSpaceName = req.body.workSpaceName;
            const comment = req.body.comment;

            const data = await channelService.postCreateWorkSpace(token, req.signedCookies.refreshToken, req.params.channelId, open, workSpaceName, comment, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status,
                workSpace: data.workSpace
            })
        } catch (err) {
            next(err);
        }
    },
    // 9. 워크스페이스에 게시물 생성
    postCreatePostToWorkSpace: async (req, res, next) => {
        try {
            const { token, refreshToken } = req.signedCookies;
            const { channelId, workSpaceId } = req.params;

            console.log(req.files);
            const formData = new FormData();
            formData.set('content', req.body.content);
            formData.set('files', JSON.stringify(req.files));

            const data = await workspaceService.postCreatePostToWorkSpace(token, refreshToken, channelId, workSpaceId, formData, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 10. 워크스페이스에서 해당 유저의 게시물 삭제
    deletePostByCreatorInWorkSpace: async (req, res, next) => {
        try {
            const token = req.signedCookies.token;
            console.log(req.params.postId);
            const data = await workspaceService.deletePostByCreatorInWorkSpace(token, req.signedCookies.refreshToken, req.params.channelId, req.params.workSpaceId, req.params.postId, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 11. 워크스페이스에서 해당 유저의 게시물 내용 수정
    patchEditPostByCreatorInWorkSpace: async (req, res, next) => {
        try {
            const token = req.signedCookies.token;
            const formData = new FormData();
            formData.set('postId', req.body.postId);
            formData.set('content', req.body.content);
            formData.set('files', JSON.stringify(req.files));

            const data = await workspaceService.patchEditPostByCreatorInWorkSpace(token, req.signedCookies.refreshToken, req.params.channelId, req.params.workSpaceId, formData, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 12. 해당 게시물 댓글 조회
    postGetReplyToPost: async (req, res, next) => {
        try {
            const token = req.signedCookies.token;

            const data = await workspaceService.getReplyToPost(token, req.signedCookies.refreshToken, req.body.postId, req.params.channelId, req.params.workSpaceId, next);
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
            console.log(req.body);
            const token = req.signedCookies.token;
            const formData = new FormData();
            formData.append('postId', req.body.postId);
            formData.append('content', req.body.content);

            const data = await workspaceService.postCreateReplyToPost(token, req.signedCookies.refreshToken, req.params.channelId, req.params.workSpaceId, formData, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 댓글 수정
    patchEditReplyByCreatorInPost: async (req, res, next) => {
        try {
            const { token, refreshToken } = req.signedCookies;
            const { channelId, workSpaceId } = req.params;
            const formData = new FormData();
            formData.append('postId', req.body.postId);
            formData.append('replyId', req.body.replyId);
            formData.append('content', req.body.content);

            const data = await workspaceService.patchEditReplyByCreatorInPost(token, refreshToken, channelId, workSpaceId, formData, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status,
                updatedReply: data.updatedReply
            });
        } catch (err) {
            next(err);
        }
    },
    deleteReplyByCreatorInPost: async (req, res, next) => {
        try {
            const { token, refreshToken } = req.signedCookies;
            const { channelId, workSpaceId, postId, replyId } = req.params;

            const data = await workspaceService.deleteReplyByCreatorInPost(token, refreshToken, channelId, workSpaceId, postId, replyId, next);
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
            const token = req.signedCookies.token;

            const data = await channelService.postAddOpenChannelToWishChannel(token, req.signedCookies.refreshToken, req.body.channelId, next);
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
            const token = req.signedCookies.token;
            const { channelId, chatRoomId } = req.body;

            const data = await chatService.patchExitChatRoom(token, req.signedCookies.refreshToken, channelId, chatRoomId, next);
            hasError(data.error);
            console.log(data)
            res.status(data.status.code).json({
                status: data.status,
                channelId: channelId
            });
        } catch (err) {
            next(err);
        }
    },
    // 16. 공용기능: 채널에있는 유저 목록 불러오기
    getMemberListOnChannel: async (req, res, next) => {
        try {
            const data = await channelService.getChannelDetailByChannelId(req.signedCookies.token, req.signedCookies.refreshToken, req.params.channelId, next);
            hasError(data.error);
            console.log(data);
            res.status(data.status.code).json({
                status: data.status,
                members: data.channel.members
            });
        } catch (err) {
            next(err)
        }
    },
    // 17. 워크스페이스 퇴장
    patchExitWorkSpace: async (req, res, next) => {
        try {
            console.log('퇴장');
            const token = req.signedCookies.token;

            const data = await workspaceService.patchExitWorkSpace(token, req.signedCookies.refreshToken, req.body.channelId, req.body.workSpaceId, next);
            hasError(data.error);

            res.status(data.status.code).json({
                workSpace: data.workSpace
            });
        } catch (err) {
            next(err);
        }
    },
    //18. 워크스페이스 설명 스크립트 편집
    patchEditCommentScript: async (req, res, next) => {
        try {
            const data = await workspaceService.patchEditCommentScript(req.signedCookies.token, req.signedCookies.refreshToken, req.body, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 19. 워크 스페이스에 유저 초대 -> 전체공개 or 초대한 유저만 이용
    postInviteUsersToWorkSpace: async (req, res, next) => {
        try {
            const jsonWebToken = req.signedCookies.token;
            const channelId = req.params.channelId
            const workSpaceId = req.params.workSpaceId;

            const data = await workspaceService.postInviteUsersToWorkSpace(jsonWebToken, req.signedCookies.refreshToken, req.body, channelId, workSpaceId, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    patchEditMyProfileByReqUser: async (req, res, next) => {
        try {
            const { token, refreshToken } = req.signedCookies;
            const formData = new FormData();
            if (req.files.length > 0) {
                formData.append('photo', JSON.stringify(req.files));
            } else {
                formData.append('data', req.body.data);
            }
            formData.append('hasNameToBeEdit', req.body.hasNameToBeEdit);
            formData.append('hasPhotoToBeEdit', req.body.hasPhotoToBeEdit);
            formData.append('hasPhoneToBeEdit', req.body.hasPhoneToBeEdit);

            const data = await userService.patchEditMyProfileByReqUser(token, refreshToken, formData, req.body.hasPhotoToBeEdit, next);
            hasError(data.error);
            console.log(data);
            if (data.updatedData.photo) {
                res.cookie('photo', data.updatedData.photo, {
                    httpOnly: true,
                    secure: false,
                    signed: true
                });
            } else if (data.updatedData.hasNameToBeEdit == 'true') {
                console.log(req.body.hasNameToBeEdit);
                res.cookie('clientName', data.updatedData.data, {
                    httpOnly: true,
                    secure: false,
                    signed: true
                });
            }

            res.status(data.status.code).json({
                status: data.status,
                updatedData: data.updatedData
            });
        } catch (err) {
            next(err);
        }
    },
    postCreateFeedToChannel: async (req, res, next) => {
        try {
            const { token, refreshToken } = req.signedCookies;
            const { files } = req;
            const { title, content } = req.body;
            const { channelId } = req.params;

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('files', JSON.stringify(files));

            const data = await channelService.postCreateFeedToChannel(token, refreshToken, channelId, formData, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status,
                feed: data.feed
            });
        } catch (err) {
            next(err)
        }
    },
    patchEditFeedToChannel: async (req, res, next) => {
        try {
            const { token, refreshToken } = req.signedCookies;
            const { files } = req;
            const { title, content, existFileUrls } = req.body;
            const { channelId, feedId } = req.params;
            console.log('existFileUrls: ', existFileUrls);
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('existFileUrls', JSON.stringify(existFileUrls));
            formData.append('files', JSON.stringify(files));

            const data = await channelService.patchEditFeedToChannel(token, refreshToken, channelId, feedId, formData, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status,
                feed: data.feed
            });
        } catch (err) {
            next(err)
        }
    },
    deleteRemoveFeedByReqUser: async (req, res, next) => {
        try {
            const { token, refreshToken } = req.signedCookies;
            const { channelId, feedId } = req.params;

            const data = await channelService.deleteRemoveFeedByReqUser(token, refreshToken, channelId, feedId, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err)
        }
    },
    // 피드 좋아요
    patchPlusOrMinusNumberOfLikeInFeed: async (req, res, next) => {
        try {
            const { token, refreshToken } = req.signedCookies;
            const { channelId, feedId } = req.body;

            const data = await channelService.patchPlusOrMinusNumberOfLikeInFeed(token, refreshToken, channelId, feedId, next);
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status,
                numberOfLikeInFeed: data.numberOfLikeInFeed
            })
        } catch (err) {
            next(err);
        }
    },
    getLoadFilesInChatRoom: async (req, res, next) => {
        try {
            const { token, refreshToken } = req.signedCookies;
            const { channelId, chatRoomId } = req.params;

            const data = await chatService.getLoadFilesInChatRoom(token, refreshToken, channelId, chatRoomId, next);
            hasError(data.error);
            console.log(data.chatsWithFileUrlsInChatRoom);
            res.status(data.status.code).json({
                status: data.status,
                chatsWithFileUrlsInChatRoom: data.chatsWithFileUrlsInChatRoom
            })
        } catch (err) {
            next(err);
        }
    },
    patchEditChannelByReqUser: async (req, res, next) => {
        try {
            const { token, refreshToken } = req.signedCookies;
            const { channelId } = req.params;

            const data = await channelService.patchEditChannelByReqUser(token, refreshToken, channelId, req.body, next);
            hasError(data.error);
    
            res.status(data.status.code).json({
                status: data.status
            })
        } catch (err) {
            next(err);
        }
    }
}

export default clientControlller;