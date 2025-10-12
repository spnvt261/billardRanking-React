import './CustomKeyField.css'
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { VscLoading } from "react-icons/vsc";
import { FaCheck } from "react-icons/fa6";
import { workspaces } from "../../data/workspaces";
import PATHS from "../../router/path";
import { Navigate } from "react-router-dom";
import { useWorkspace } from '../../context/WorkspaceContext';

const CustomKeyField = () => {
    const [value, setValue] = useState(""); // lưu số đã nhập (raw)
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const {setWorkspaceKey} = useWorkspace();
    
    const handleConfirm = () => {
        if (value.length !== 8) return;
        // console.log(value);

        setLoading(true);
        setError("");

        const numberValue = Number(value);

        setTimeout(() => {
            const ws = workspaces.find((w) => w.share_key === numberValue);
            if (!ws) {
                setLoading(false);
                setError("Workspace không tồn tại");
                return;
            }

            setWorkspaceKey(value);

            setLoading(false);
            setSuccess(true);

            setTimeout(() => {
                <Navigate to={PATHS.RANKINGS} />;
            }, 500);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setError("");
        setSuccess(false);

        if (e.key === "Enter" && value.length === 8 && !loading) {
            handleConfirm();
        }

        if (e.key === "Backspace") {
            setValue((prev) => prev.slice(0, prev.length - 1));
            e.preventDefault();
        }

        if (/^[0-9]$/.test(e.key) && value.length < 8) {
            setValue((prev) => prev + e.key);
            e.preventDefault();
        }
    };

    // Tạo mask "xxxx-xxxx" với số đã nhập
    const renderMask = () => {
        let mask = [];
        for (let i = 0; i < 8; i++) {
            const isEntered = i < value.length;
            const isNext = i === value.length && isFocused;
            const char = isEntered ? value[i] : "x";

            mask.push(
                <span
                    key={i}
                    className={`${isEntered ? "text-gray-900" : "text-gray-400"} ${isNext ? "relative" : ""
                        }`}
                >
                    {char}
                    {isNext && <span className="blinking absolute left-0 -bottom-[0.1rem]">_</span>}
                </span>
            );

            if (i === 3) mask.push(<span key="space" className="text-gray-400">-</span>);
        }
        return mask;
    };
    return (
        <div className="relative w-fit">
            <div
                className={`flex items-center justify-start text-3xl p-1 pl-[2rem] pr-[2rem] rounded-[1rem] bg-white border font-mono tracking-[0.5rem] text-lg
                                ${isFocused ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300"}`}
            >
                {renderMask()}
            </div>
            <input
                type="text"
                inputMode="numeric"
                value=""
                onChange={() => { }}
                onKeyDown={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="absolute inset-0 w-full h-full opacity-0"
            />

            <button
                onClick={handleConfirm}
                disabled={value.length !== 8 || loading}
                className={`absolute -right-2 top-1/2 transform -translate-y-1/2 translate-x-full w-10 h-10 rounded-full flex items-center justify-center z-30
                                ${value.length === 8
                        ? "hover:opacity-90 bg-gradient-to-br from-gray-700 to-gray-400 text-white"
                        : " text-gray-500 cursor-not-allowed"
                    }`}
            >
                {loading ? (
                    <VscLoading className="animate-spin w-5 h-5 text-[1.5rem]" />
                ) : success ? (
                    <FaCheck className="w-5 h-5 text-green-500" />
                ) : (
                    value.length === 8 && <FiArrowRight className="w-5 h-5" />
                )}
            </button>

            {error && <p className="text-sm text-red-500 mt-2 absolute left-0">{error}</p>}
        </div>
    )
}

export default CustomKeyField