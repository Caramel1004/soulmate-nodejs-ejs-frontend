import fetch from 'node-fetch';

const workspaceAPI = {
    // 1. 워크스페이스 입장 -> 워크스페이스 페이지
    getLoadWorkspace: async (token, channelId, workspaceId, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/workspace/${channelId}/${workspaceId}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 2. 워크스페이스에 게시물 생성
    postCreatePostToWorkSpace: async (token, channelId, workSpaceId, formData, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/workspace/create-post/${channelId}/${workSpaceId}`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: formData
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 6. 댓글 보기
    getReplyToPost: async (token, postId, channelId, workSpaceId, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/workspace/${channelId}/${workSpaceId}/post/replies`,{
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
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
    }
}

export default workspaceAPI;