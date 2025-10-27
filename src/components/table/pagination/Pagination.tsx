import React, { useState, useRef, useEffect } from "react";

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    maxPagesToShow?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    maxPagesToShow = 5,
}) => {
    
    const totalPages = Math.ceil(totalItems / pageSize);

    const [dropdownPages, setDropdownPages] = useState<number[] | null>(null);
    const [dropdownPos, setDropdownPos] = useState<{ left: number } | null>(null);
    const [leftEllips, setLeftEllips] = useState<boolean>(false)
    const [righteEllips, setRightEllips] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown nếu click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setDropdownPages(null);
                setDropdownPos(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const getPages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            const left = Math.max(2, currentPage - 1);
            const right = Math.min(totalPages - 1, currentPage + 1);

            pages.push(1);
            if (left > 2) pages.push("left-ellipsis");
            for (let i = left; i <= right; i++) pages.push(i);
            if (right < totalPages - 1) pages.push("right-ellipsis");
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPages();
    if (totalPages <= 1) return null;
    // Khi click vào ...
    const handleEllipsisClick = (
        start: number,
        end: number,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation(); // ngăn bubble lên document
        const rect = (e.target as HTMLButtonElement).getBoundingClientRect();

        // Tạo danh sách các page cần hiển thị
        const list: number[] = [];
        for (let i = start; i <= end; i++) list.push(i);

        setDropdownPages(list);
        setDropdownPos({ left: rect.left }); // vị trí của nút ...
    };

    const handleEllipsLeftClick = (
        start: number,
        end: number,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        handleEllipsisClick(start, end, e);
        setLeftEllips(true)
        setRightEllips(false)
    }
    const handleEllipsRightClick = (
        start: number,
        end: number,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        handleEllipsisClick(start, end, e);
        setLeftEllips(false)
        setRightEllips(true)
    }

    return (
        <div ref={containerRef} className="relative flex justify-center items-center gap-1 mt-2 mb-2">
            {/* Prev */}
            <button
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
                &lt;
            </button>

            {pages.map((page, idx) => {
                if (page === "left-ellipsis") {
                    return (
                        <button
                            key={idx}
                            onClick={(e) => handleEllipsLeftClick(2, currentPage - 2, e)}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 relative"
                        >
                            ...
                            {dropdownPages && dropdownPos && leftEllips && (
                                <div
                                    className="absolute bg-white bottom-full border shadow-md rounded flex flex-col z-10"
                                    style={{
                                        // left: dropdownPos.left,
                                        left: 0,
                                        // top: dropdownPos.top - 40, // 40px phía trên nút ... bạn có thể chỉnh
                                        minWidth: 50,
                                    }}
                                    onClick={(e) => e.stopPropagation()} // cho phép click trong dropdown
                                >
                                    {dropdownPages.map((p) => (
                                        <button
                                            key={`page-${p}`}
                                            onClick={() => {
                                                onPageChange(p);
                                                setDropdownPages(null);
                                                setDropdownPos(null);
                                            }}
                                            className={`px-3 py-1 text-left bg-gray-100 border-b hover:bg-gray-200 ${p === currentPage ? "font-bold" : ""
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                }

                if (page === "right-ellipsis") {
                    return (
                        <button
                            key={idx}
                            onClick={(e) => handleEllipsRightClick(currentPage + 2, totalPages - 1, e)}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 relative"
                        >
                            ...
                            {dropdownPages && dropdownPos && righteEllips && (
                                <div
                                    className="absolute bg-white bottom-full border shadow-md rounded flex flex-col z-10"
                                    style={{
                                        // left: dropdownPos.left,
                                        left: 0,
                                        // top: dropdownPos.top - 40, // 40px phía trên nút ... bạn có thể chỉnh
                                        minWidth: 50,
                                    }}
                                    onClick={(e) => e.stopPropagation()} // cho phép click trong dropdown
                                >
                                    {dropdownPages.map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => {
                                                onPageChange(p);
                                                setDropdownPages(null);
                                                setDropdownPos(null);
                                            }}
                                            className={`px-3 py-1 text-left bg-gray-100 border-b hover:bg-gray-200 ${p === currentPage ? "font-bold" : ""
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                }
                if (typeof page === "number") {
                    return (
                        <button
                            key={idx}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 rounded ${page === currentPage
                                ? "bg-gray-400 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {page}
                        </button>
                    );
                }

            })}

            {/* Next */}
            <button
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
                &gt;
            </button>

            {/* Dropdown chung */}
            {/* {dropdownPages && dropdownPos && (
                <div
                    className="absolute bg-white bottom-full border shadow-md rounded flex flex-col z-10"
                    style={{
                        left: dropdownPos.left,
                        // top: dropdownPos.top - 40, // 40px phía trên nút ... bạn có thể chỉnh
                        minWidth: 50,
                    }}
                    onClick={(e) => e.stopPropagation()} // cho phép click trong dropdown
                >
                    {dropdownPages.map((p) => (
                        <button
                            key={p}
                            onClick={() => {
                                onPageChange(p);
                                setDropdownPages(null);
                                setDropdownPos(null);
                            }}
                            className={`px-3 py-1 text-left hover:bg-gray-200 ${p === currentPage ? "font-bold" : ""
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )} */}
        </div>
    );
};

export default Pagination;
