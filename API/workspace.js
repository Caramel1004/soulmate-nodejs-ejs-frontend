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
}

export default workspaceAPI;