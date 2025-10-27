import { forwardRef, type ReactNode } from "react";
import "./CustomButton.css";
import { useLocalStorage } from "../../customhook/useLocalStorage";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../../constants/localStorage";

interface CustomButtonProps {
    label: string;
    width?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
    variant: "type-1" | "type-2" | "type-3" | "type-4" | "type-5" | "type-6" | "type-7" | "type-8" ;
    needPermission?: boolean;
    textPadding?:string
    disabled?:boolean
    Icon?: ReactNode;
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
    ({ label, variant, width = "auto", type = "button", onClick, className = "",textPadding,
        needPermission, disabled, Icon
    }, ref) => {
        const [accessToken] = useLocalStorage<string | null>(LOCAL_STORAGE_ACCESS_TOKEN, '');
        const hasAccess = Boolean(accessToken);
        const shouldShowButton = !needPermission || hasAccess;
        return (
            <>
                {
                    shouldShowButton &&
                    <button
                        ref={ref}
                        type={type}
                        onClick={onClick}
                        className={`custom-button ${variant} relative inline-flex items-center justify-center p-0.5 overflow-hidden font-semibold rounded-[.875rem] group ${className} ${disabled?"cursor-not-allowed":""}`}
                        style={{ width }}
                        disabled = {disabled} 
                    >
                        <span className="flex gap-1 custom-button-inner relative py-3 px-6 transition-all ease-in duration-75 rounded-[.75rem]"
                            style={{padding:textPadding}}
                        >
                            {label}  {Icon && (
                                <span className="icon">{Icon}</span>
                            )}
                        </span>
                    </button>
                }
            </>

        );
    }
);

export default CustomButton;
