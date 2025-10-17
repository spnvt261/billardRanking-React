import type { Dispatch } from "redux";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../../constants/localStorage";
import axios from "axios";

export const CLEAR_CACHE = 'CLEAR_CACHE';

export const UPLOAD_IMAGE_SUCCESS = 'UPLOAD_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_FAIL = 'UPLOAD_IMAGE_FAIL';
export const UPLOAD_IMAGE_REQUEST = 'UPLOAD_IMAGE_REQUEST';

export const GET_LIST_PLAYERS_SELECT_SUCCESS = 'GET_LIST_PLAYERS_SELECT_SUCCESS';
export const GET_LIST_PLAYERS_SELECT_FAIL = 'GET_LIST_PLAYERS_SELECT_FAIL';
export const GET_LIST_PLAYERS_SELECT_REQUEST = 'GET_LIST_PLAYERS_SELECT_REQUEST';


export const clearCache = () => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: CLEAR_CACHE,
            payload: null
        })

        // console.log("✅ Logged out successfully");
    } catch (err) {
        // console.error("❌ Error during logout:", err);
    }
};

export const upLoadImages = (file: File) => async (dispatch: Dispatch) => {
    dispatch({ type: UPLOAD_IMAGE_REQUEST, payload: null });
    try {
        if (!file) throw new Error("No file provided");
        if (!(file instanceof File)) throw new Error("Invalid file object");
        // Tạo FormData từ file
        const form = new FormData();
        form.append("file", file);

        // Lấy token
        let token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        if (token && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
        }
        if (!token) throw new Error("No access token found");

        // Gửi request upload
        const res = await axios.post(
            "/api/images/upload",
            form, // FormData trực tiếp
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Không set Content-Type, Axios tự set multipart/form-data
                },
            }
        );

        // Ví dụ dispatch kết quả URL ảnh
        const imageUrl = res.data.url;
        dispatch({ type: UPLOAD_IMAGE_SUCCESS, payload: imageUrl });

        return imageUrl; // trả về để dùng trực tiếp nếu cần

    } catch (err: any) {
        console.error("Upload image error:", err);
        dispatch({ type: UPLOAD_IMAGE_FAIL, payload: err.message });
        throw err; // ném ra để component xử lý nếu muốn
    }
};

export const getListPlayerSelect =(workspaceId:string) => async (dispatch: Dispatch)=>{
    dispatch({ type: GET_LIST_PLAYERS_SELECT_REQUEST, payload: null });
    try{
          let token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        if (token && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
        }
        if (!token) throw new Error("No access token found");

        // Gửi request upload
        const response = await axios.get("/api/players/get-list?workspaceId=" + workspaceId);
        dispatch({ type: GET_LIST_PLAYERS_SELECT_SUCCESS, payload: response.data });
    }
    catch(err:any){
        dispatch({ type: GET_LIST_PLAYERS_SELECT_FAIL, payload: err.message});
    }
}