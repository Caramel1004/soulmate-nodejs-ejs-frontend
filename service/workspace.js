import workspaceAPI from '../API/workspace.js'

/**
 * 1. 워크스페이스 입장 -> 워크스페이스 페이지
 * 2. 게시물 생성
 * 3. 댓글 달기 -> 게시물이 있어야 함
 * 4. 워크스페이스에 팀원 초대
 * 5. 스크랩 따기
 * 6. 댓글 보기
 * 7. 워크스페이스 설명 코멘트 편집
 */
const workspaceService = {
    // 1. 워크스페이스 입장 -> 워크스페이스 페이지
    getLoadWorkspace: async (token, channelId, workspaceId, next) => {
        try {
            const data = await workspaceAPI.getLoadWorkspace(token, channelId, workspaceId, next);

            const postObjList = data.workSpace.posts;
            const postFormattedCreatedAt = new Date(data.workSpace.createdAt).toLocaleDateString('ko',{
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
            data.workSpace.createdAt = postFormattedCreatedAt;
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
    postCreatePostToWorkSpace: async (token, channelId, workSpaceId, formData, next) => {
        try {
            const data = await workspaceAPI.postCreatePostToWorkSpace(token, channelId, workSpaceId, formData, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 6. 댓글 보기
    getReplyToPost: async (token, postId, channelId, workSpaceId, next) => {
        try {
            const data = await workspaceAPI.getReplyToPost(token, postId, channelId, workSpaceId, next);

            return data;
        } catch (err) {
            next(err);
        }
    }
}

export default workspaceService