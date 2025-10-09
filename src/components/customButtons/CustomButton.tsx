import { forwardRef } from "react";
import "./CustomButton.css";

interface CustomButtonProps {
    label: string;
    width?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
    variant: "type-1" | "type-2" | "type-3" | "type-4" | "type-5" | "type-6" | "type-7";
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
    ({ label, variant, width = "auto", type = "button", onClick, className = "" }, ref) => {
        return (
            <button
                ref={ref}
                type={type}
                onClick={onClick}
                className={`custom-button ${variant} relative inline-flex items-center justify-center p-0.5 overflow-hidden font-semibold rounded-[.875rem] group ${className}`}
                style={{ width }}
            >
                <span className="custom-button-inner relative py-3 px-6 transition-all ease-in duration-75 rounded-[.75rem]">
                    {label}
                </span>
            </button>
        );
    }
);

export default CustomButton;
