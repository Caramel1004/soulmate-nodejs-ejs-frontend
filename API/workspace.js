import fetch from 'node-fetch';

/**
 * 1. 워크스페이스 입장 -> 워크스페이스 페이지
 * 2. 게시물 생성
 * 3. 댓글 달기 -> 게시물이 있어야 함
 * 4. 워크스페이스에 팀원 초대
 * 5. 스크랩 따기
 * 6. 댓글 보기
 * 7. 해당 게시물에 댓글 달기
 * 8. 워크스페이스 퇴장
 * 9. 워크스페이스 설명 스크립트 편집
 */

const workspaceAPI = {
    // 1. 워크스페이스 입장 -> 워크스페이스 페이지
    getLoadWorkspace: async (token, refreshToken, channelId, workspaceId, query, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/workspace/${channelId}/${workspaceId}?sort=${query.sort}&&sortNum=${query.sortNum}`, {
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
            const response = await fetch(`http://localhost:8080/v1/workspace/create-post/${channelId}/${workSpaceId}`, {
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
    // 4. 워크스페이스에 팀원 초대
    postInviteUsersToWorkSpace: async (token, refreshToken, body, channelId, workSpaceId, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/workspace/invite/${channelId}/${workSpaceId}`, {
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
    getReplyToPost: async (token, refreshToken, postId, channelId, workSpaceId, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/workspace/${channelId}/${workSpaceId}/post/replies`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postId: postId
                })
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
            const response = await fetch(`http://localhost:8080/v1/workspace/${channelId}/${workSpaceId}/post/create-reply`, {
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
    // 8. 워크스페이스 퇴장
    patchExitWorkSpace: async (token, refreshToken, channelId, workSpaceId, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/workspace/exit/${channelId}/${workSpaceId}`, {
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
    patchEditCommentScript: async (token, refreshToken, body, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/workspace/edit-comment/${body.channelId}/${body.workSpaceId}`, {
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