import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://ecommerce-store-2021.herokuapp.com'      //'http://localhost:8080'
});

export default instance;