import workspaceAPI from '../API/workspace.js'
import { hasError, hasNewAuthToken } from '../validator/valid.js';
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
const workspaceService = {
    // 1. 워크스페이스 입장 -> 워크스페이스 페이지
    getLoadWorkspace: async (token, refreshToken, channelId, workspaceId, query, next) => {
        try {
            const data = await workspaceAPI.getLoadWorkspace(token, refreshToken, channelId, workspaceId, query, next);
            hasError(data.error);
            const postObjList = data.workSpace.posts;
            const postFormattedCreatedAt = new Date(data.workSpace.createdAt).toLocaleDateString('ko', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
            data.workSpace.createdAt = postFormattedCreatedAt;//워크스페이스 생성일
            if (postObjList.length > 0) {
                let year;
                let month;
                let day;
                postObjList.map(post => {
                    year = new Date(post.createdAt).getFullYear();
                    month = new Date(post.createdAt).getMonth() + 1;
                    day = new Date(post.createdAt).getDate();
                    const timestamp = new Date(post.createdAt).toTimeString().split(' ')[0];//ex)09:51:35 GMT+0900 (한국 표준시)

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

                    post.fomatDate = `${year}-${month}-${day}  ${when} ${hour}:${min}`;

                    return post;
                });
            }
            return data;
        } catch (err) {
            next(err);
        }
    },
    // 2. 워크스페이스에 게시물 생성
    postCreatePostToWorkSpace: async (token, refreshToken, channelId, workSpaceId, formData, next) => {
        try {
            const data = await workspaceAPI.postCreatePostToWorkSpace(token, refreshToken, channelId, workSpaceId, formData, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 3. 워크스페이스에서 해당 유저의 게시물 삭제
    deletePostByCreatorInWorkSpace: async (token, refreshToken, channelId, workSpaceId, postId, next) => {
        try {
            const data = await workspaceAPI.deletePostByCreatorInWorkSpace(token, refreshToken, channelId, workSpaceId, postId, next);
            hasError(data.error);

            return data
        } catch (err) {
            next(err);
        }
    },
    // 4. 워크스페이스에서 해당 유저의 게시물 내용 수정 
    patchEditPostByCreatorInWorkSpace: async (token, refreshToken, channelId, workSpaceId, formData, next) => {
        try {
            const data = await workspaceAPI.patchEditPostByCreatorInWorkSpace(token, refreshToken, channelId, workSpaceId, formData, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 5. 워크스페이스에 팀원 초대
    postInviteUsersToWorkSpace: async (token, refreshToken, body, channelId, workSpaceId, next) => {
        try {
            const data = await workspaceAPI.postInviteUsersToWorkSpace(token, refreshToken, body, channelId, workSpaceId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 6. 댓글 보기
    getRepliesToPost: async (token, refreshToken, postId, channelId, workSpaceId, next) => {
        try {
            const data = await workspaceAPI.getRepliesToPost(token, refreshToken, postId, channelId, workSpaceId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 7. 해당 게시물에 댓글 달기
    postCreateReplyToPost: async (token, refreshToken, channelId, workSpaceId, formData, next) => {
        try {
            const data = await workspaceAPI.postCreateReplyToPost(token, refreshToken, channelId, workSpaceId, formData, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    patchEditReplyByCreatorInPost: async (token, refreshToken, channelId, workSpaceId, formData, next) => {
        try {
            const data = await workspaceAPI.patchEditReplyByCreatorInPost(token, refreshToken, channelId, workSpaceId, formData, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    deleteReplyByCreatorInPost: async (token, refreshToken, channelId, workSpaceId, postId, replyId, next) => {
        try {
            const data = await workspaceAPI.deleteReplyByCreatorInPost(token, refreshToken, channelId, workSpaceId, postId, replyId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 8. 워크스페이스 퇴장
    patchExitWorkSpace: async (token, refreshToken, channelId, workSpaceId, next) => {
        try {
            const data = await workspaceAPI.patchExitWorkSpace(token, refreshToken, channelId, workSpaceId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 9. 워크스페이스 설명 스크립트 편집
    patchEditCommentScript: async (token, refreshToken, params, next) => {
        try {
            const data = await workspaceAPI.patchEditCommentScript(token, refreshToken, params, next);

            return data;
        } catch (err) {
            next(err);
        }
    }
}

export default workspaceService