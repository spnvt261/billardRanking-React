// import axios from "axios";
// import axiosRetry from "axios-retry";

// // Instance cho các API cần retry
// export const axiosWithRetry = axios.create({
//     // baseURL: 'https://billardranking-sever.onrender.com', // URL của BE
//     baseURL: 'http://localhost:8080', // URL của BE
// });

// export const axiosNoRetry = axios.create({
//     baseURL: 'http://localhost:8080', // URL của BE
// });
// // Cấu hình axios-retry
// axiosRetry(axiosWithRetry, {
//     retries: 3, // Số lần thử lại
//     retryDelay: (retryCount: number) => retryCount * 1000, // Delay 1s, 2s, 3s
//     retryCondition: (error): boolean => {
//         // Chỉ retry cho lỗi mạng hoặc lỗi server (5xx), không retry cho lỗi 400
//         return (
//             !!axiosRetry.isNetworkOrIdempotentRequestError(error) ||
//             (error.response?.status ? error.response.status >= 500 : false)
//         );
//     },
// });