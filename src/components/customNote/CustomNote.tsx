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
                    className="absolute left-0  top-full translate-y-[.5rem] -left-full ml-3 bg-white border border-gray-300 rounded-xl shadow-lg p-3 text-sm text-gray-700 w-fit z-50"
                >
                    <p className="min-w-[150px]">{noteContent}</p>
                    
                </div>
            )}
        </div>
    )
}

export default CustomNote;