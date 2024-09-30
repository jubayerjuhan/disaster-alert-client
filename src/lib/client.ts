import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000", // Replace with your API base URL
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
