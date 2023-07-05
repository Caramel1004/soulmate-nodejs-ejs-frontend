import staticDataAPI from '../API/static-data.js'

export const getCategoryData = async next => {
    try {
        const resData = await staticDataAPI.getCategoryData(next);

        return resData;
    } catch (err) {
        next(err);
    }
}