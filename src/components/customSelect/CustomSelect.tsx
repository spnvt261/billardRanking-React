import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

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
    spanMaxWidth?: string;
    search?: boolean; // ✅ bật/tắt ô tìm kiếm
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    placeholder = "",
    value = [],
    onChange,
    multiple = false,
    className,
    spanMaxWidth,
    search = false
}) => {
    const [isOpenListSelect, setIsOpenListSelect] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const selectRef = useRef<HTMLDivElement>(null);

    // Danh sách label các giá trị đã chọn
    const selectedLabels = options
        .filter((opt) => value.includes(opt.value))
        .map((opt) => opt.label);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpenListSelect(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Ngăn cuộn lan ra ngoài
    useEffect(() => {
        const dropdown = selectRef.current?.querySelector("ul");
        if (!dropdown) return;

        const handleTouchMove = (e: TouchEvent) => {
            e.stopPropagation();
        };

        dropdown.addEventListener("touchmove", handleTouchMove, { passive: false });
        return () => dropdown.removeEventListener("touchmove", handleTouchMove);
    }, [isOpenListSelect]);

    // Xử lý chọn option
    const handleSelect = (option: Option) => {
        if (!multiple) {
            onChange?.([option.value]);
            setIsOpenListSelect(false);
        } else {
            const newValues = value.includes(option.value)
                ? value.filter((v) => v !== option.value)
                : [...value, option.value];
            onChange?.(newValues);
        }
    };

    // Lọc danh sách khi có searchTerm
    const filteredOptions = search
        ? options.filter((opt) =>
              opt.label.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : options;

    return (
        <div ref={selectRef} className={`relative w-full ${className || ""}`}>
            <button
                type="button"
                onClick={() => {
                    setIsOpenListSelect(!isOpenListSelect);
                    setSearchTerm(""); // reset khi mở dropdown
                }}
                className="w-full min-w-0 flex justify-between items-center bg-white border border-gray-300 rounded-[0.5rem] px-4 py-2 text-left hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
                <span
                    className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis"
                    style={spanMaxWidth ? { maxWidth: `${spanMaxWidth}` } : {}}
                >
                    {selectedLabels.length > 0
                        ? selectedLabels.join(", ")
                        : placeholder}
                </span>
                <FaChevronDown
                    className={`w-4 h-4 flex-shrink-0 transform transition-transform ${
                        isOpenListSelect ? "rotate-180" : "rotate-0"
                    }`}
                />
            </button>

            {isOpenListSelect && (
                <ul className="absolute mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10 overflow-hidden max-h-64 overflow-y-auto">
                    {search && (
                        <div className="p-2 border-b border-gray-200 bg-gray-50 sticky top-0">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm..."
                                className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                            />
                        </div>
                    )}

                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => {
                            const isSelected = value.includes(option.value);
                            return (
                                <li
                                    key={option.value}
                                    className={`px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${
                                        isSelected ? "bg-gray-200 font-semibold" : ""
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
                        })
                    ) : (
                        <li className="px-4 py-2 text-gray-500 italic">Không tìm thấy</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
