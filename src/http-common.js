import axios from "axios";

export default axios.create({
    baseURL: "https://us-west-2.aws.data.mongodb-api.com/app/wordleapplication-cjdfv/endpoint/get_random_word",
    headers: {
        "Content-type":"application/json"
    }
});