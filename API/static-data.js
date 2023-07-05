import fetch from 'node-fetch';

const staticDataAPI = {
    getCategoryData: async () => {
        try {
            const response = await fetch('http://localhost:8080/v1/static-data/category', {
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