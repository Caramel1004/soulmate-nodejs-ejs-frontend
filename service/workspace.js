import workspaceAPI from '../API/workspace.js'

const workspaceService = {
    // 1. 워크스페이스 입장 -> 워크스페이스 페이지
    getLoadWorkspace: async (token, channelId, workspaceId, next) => {
        try {
            const data = await workspaceAPI.getLoadWorkspace(token, channelId, workspaceId, next);

            return data;
        } catch (err) {
            next(err);
        }
    }
}

export default workspaceService