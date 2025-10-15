import './CustomKeyField.css'
import { useEffect, useState } from "react";

interface Props {
    name?: string;
    value?: string;
    error?: string | null;
    errorText?: string | null;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    handleConfirm?: () => void;
}
const CustomKeyField = ({ name = "key", error, onChange, onBlur,handleConfirm, value:propsValue,errorText,disabled }: Props) => {
    const [value, setValue] = useState(""); // lưu số đã nhập (raw)
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && value.length === 8) {
            handleConfirm?handleConfirm():null;
        }

        if (e.key === "Backspace") {
            const newValue = value.slice(0, -1);
            setValue(newValue);
            e.preventDefault();

            if (onChange) {
                onChange({
                    target: { name, value: newValue }
                } as React.ChangeEvent<HTMLInputElement>);
            }
        }

        if (/^[0-9]$/.test(e.key) && value.length < 8) {
            const newValue = value + e.key;
            setValue(newValue);
            e.preventDefault();

            if (onChange) {
                onChange({
                    target: { name, value: newValue }
                } as React.ChangeEvent<HTMLInputElement>);
            }
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

    useEffect(()=>{
        setValue(propsValue?propsValue:"")
    },[propsValue])
    return (
        <div className="relative w-fit">
            <div
                className={`flex items-center justify-start text-3xl p-1 pl-[2rem] pr-[2rem] rounded-[1rem] bg-white border font-mono tracking-[0.5rem] text-lg
                                 ${isFocused ? (error || errorText ? "border-red-500 ring-2 ring-red-300" : "border-gray-500 ring-2 ring-gray-300") : (error || errorText ? "border-red-500" : "border-gray-300")}
                                
                                `}
            >
                {renderMask()}
            </div>
            <input
                type="text"
                name={name}
                inputMode="numeric"
                value=""
                onChange={() => { }}
                onKeyDown={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                    setIsFocused(false);
                    if (onBlur) onBlur(e);
                }}
                className={`absolute inset-0 w-full h-full opacity-0`}
                disabled={disabled}
            />
            {errorText && <p className="text-sm max-w-[200px] text-red-500 break-words whitespace-normal">{errorText}</p>}
        </div>
    )
}

export default CustomKeyField