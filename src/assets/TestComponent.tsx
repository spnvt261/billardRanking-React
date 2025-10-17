import { useState } from "react";
import axios from "axios";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../constants/localStorage";

export default function ImageUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState<string>("");

    const handleUpload = async () => {
        if (!file) return;

        const form = new FormData();
        form.append("file", file);

        let token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        if (token && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
        }

        if (!token) {
            throw new Error('No access token found');
        }

        const res = await axios.post(
            "http://localhost:8080/api/images/upload",
            form, // ← gửi FormData trực tiếp
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setUrl(res.data.url); // ← Axios trả data trong res.data
    };


    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleUpload}>Upload</button>
            {url && (
                <div>
                    <p>Ảnh đã upload:</p>
                    <img src={url} alt="Uploaded" width="200" />
                </div>
            )}
        </div>
    );
}
