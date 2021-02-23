import axios from 'axios';

const url = 'http://192.168.1.139:3000/v1/user/';

export function postData(endpoint, data) {
    return axios.post(url + endpoint, data);
}

