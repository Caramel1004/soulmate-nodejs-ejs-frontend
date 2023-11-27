import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const staticDataAPI = {
    getCategoryData: async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/v1/static-data/category`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    }
}

export default staticDataAPI;