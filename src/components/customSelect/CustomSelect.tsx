import React, { useState, useRef, useEffect } from "react";

export interface Option {
    label: string;
    value: any;
}

interface CustomSelectProps {
    options: Option[];
    placeholder?: string;
    value?: string[];
    onChange?: (values: string[]) => void;
    multiple?: boolean;
    className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    placeholder = "",
    value = [],
    onChange,
    multiple = false,
    className
}) => {
    const [isOpenListSelect, setIsOpenListSelect] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    // Lấy danh sách label của các giá trị đã chọn
    const selectedLabels = options
        .filter((opt) => value.includes(opt.value))
        .map((opt) => opt.label);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpenListSelect(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: Option) => {
        if (!multiple) {
            // single select
            onChange?.([option.value]);
            setIsOpenListSelect(false);
        } else {
            // multi select
            const newValues = value.includes(option.value)
                ? value.filter((v) => v !== option.value) // bỏ chọn nếu đã chọn
                : [...value, option.value]; // thêm vào nếu chưa chọn
            onChange?.(newValues);
        }
    };

    return (
        <div ref={selectRef} className={`relative w-full mb-[1rem] ${className ? className : ''}`}>
            <button
                type="button"
                onClick={() => setIsOpenListSelect(!isOpenListSelect)}
                className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-[0.5rem] px-4 py-2 text-left hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
                <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-[290px]">
                    {selectedLabels.length > 0
                        ? selectedLabels.join(", ")
                        : placeholder}
                </span>
                <svg
                    className={`w-4 h-4 flex-shrink-0 transform transition-transform ${isOpenListSelect ? "rotate-180" : "rotate-0"
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpenListSelect && (
                <ul className="absolute mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10 overflow-hidden max-h-56 overflow-y-auto">
                    {options.map((option) => {
                        const isSelected = value.includes(option.value);
                        return (
                            <li
                                key={option.value}
                                className={`px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${isSelected ? "bg-gray-200 font-semibold" : ""
                                    }`}
                                onClick={() => handleSelect(option)}
                            >
                                {multiple && (
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className="accent-gray-500"
                                    />
                                )}
                                {option.label}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
