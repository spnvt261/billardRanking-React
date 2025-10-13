import { useEffect, useRef, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

interface Props {
    noteContent: string;
    className?: string;
}
const CustomNote = ({ noteContent, className }: Props) => {
    const [showNote, setShowNote] = useState(false);
    const noteRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (noteRef.current && !noteRef.current.contains(e.target as Node)) {
                setShowNote(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);
    return (
        <div className={`relative h-full flex items-center ${className ? className : ""}`}>
            <FaQuestionCircle
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowNote(!showNote);
                }}
            />
            {showNote && (
                <div
                    ref={noteRef}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-white border border-gray-300 rounded-xl shadow-lg p-3 text-sm text-gray-700 w-56 z-50"
                >
                    {noteContent}
                </div>
            )}
        </div>
    )
}

export default CustomNote;