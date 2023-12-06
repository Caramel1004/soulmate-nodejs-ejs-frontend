import fetch from 'node-fetch';
import dotenv from 'dotenv';

/**
 * 1. 워크스페이스 입장 -> 워크스페이스 페이지
 * 2. 게시물 생성
 * 3. 워크스페이스에서 해당 유저의 게시물 삭제
 * 4. 워크스페이스에서 해당 유저의 게시물 내용 수정
 * 5. 워크스페이스에 팀원 초대
 * 6. 댓글 보기
 * 7. 해당 게시물에 댓글 달기
 * 8. 워크스페이스 퇴장
 * 9. 워크스페이스 설명 스크립트 편집
*/

dotenv.config();

const workspaceAPI = {
    // 1. 워크스페이스 입장 -> 워크스페이스 페이지
    getLoadWorkspace: async (token, refreshToken, channelId, workspaceId, query, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/workspace/${channelId}/${workspaceId}?sortType=${query.sortType}&&sortNum=${query.sortNum}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken
                }
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 2. 워크스페이스에 게시물 생성
    postCreatePostToWorkSpace: async (token, refreshToken, channelId, workSpaceId, formData, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/workspace/create-post/${channelId}/${workSpaceId}`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken,
                },
                body: formData
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 3. 워크스페이스에서 해당 유저의 게시물 삭제
    deletePostByCreatorInWorkSpace: async (token, refreshToken, channelId, workSpaceId, postId, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/workspace/delete-post/${channelId}/${workSpaceId}/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken,
                    'Content-Type': 'application/json'
                }
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 4. 워크스페이스에서 해당 유저의 게시물 내용 수정
    patchEditPostByCreatorInWorkSpace: async (token, refreshToken, channelId, workSpaceId, formData, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/workspace/edit-post/${channelId}/${workSpaceId}`, {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken
                },
                body: formData
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 5. 워크스페이스에 팀원 초대
    postInviteUsersToWorkSpace: async (token, refreshToken, body, channelId, workSpaceId, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/workspace/invite/${channelId}/${workSpaceId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            return await response.json();
        } catch (err) {
            next(err);
        }
    },
    // 6. 댓글 보기
    getRepliesToPost: async (token, refreshToken, postId, channelId, workSpaceId, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/workspace/post/replies/${channelId}/${workSpaceId}/${postId}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken
                }
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 7. 해당 게시물에 댓글 달기
    postCreateReplyToPost: async (token, refreshToken, channelId, workSpaceId, formData, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/workspace/post/create-reply/${channelId}/${workSpaceId}`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken,
                },
                body: formData
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    patchEditReplyByCreatorInPost: async (token, refreshToken, channelId, workSpaceId, formData, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/workspace/post/edit-reply/${channelId}/${workSpaceId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken
                },
                body: formData
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    deleteReplyByCreatorInPost: async (token, refreshToken, channelId, workSpaceId, postId, replyId, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/workspace/post/delete-reply/${channelId}/${workSpaceId}/${postId}/${replyId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken,
                    'Content-Type': 'application/json'
                }
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 8. 워크스페이스 퇴장
    patchExitWorkSpace: async (token, refreshToken, channelId, workSpaceId, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/workspace/exit`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId,
                    workSpaceId: workSpaceId
                })
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 9. 워크스페이스 설명 스크립트 편집
    patchEditCommentScript: async (token, refreshToken, params, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/workspace/edit-comment/${params.channelId}/${params.workSpaceId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    }
}

export default workspaceAPI;