import { AnimatePresence, motion } from 'framer-motion'
import './FormToggle.css'
import CustomButton from '../customButtons/CustomButton'
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import WithLoading from '../loading/WithLoading';
interface FormToggleProps {
    btnLabel: string;
    formTitle: string;
    btnVariant?: "type-1" | "type-2" | "type-3" | "type-4" | "type-5" | "type-6" | "type-7";
    needPermission?: boolean;
    // element: ComponentType<{ btnCancel: () => void }>;
    element: ComponentType<any>;
    formWidth?: string;
    className?: string;
    onConfirm?:()=>void;
}
const FormToggle = ({ btnLabel, formTitle, element: Element, btnVariant, className, needPermission,onConfirm,formWidth }: FormToggleProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const originRef = useRef<HTMLDivElement>(null);;
    const formRef = useRef<HTMLDivElement>(null);
    const btnAddTournament = () => {
        if (originRef.current) {
            const rect = originRef.current.getBoundingClientRect();
            setOrigin({ x: rect.x, y: rect.y, width: rect.width, height: rect.height })
        }
        setIsOpen(true);
    }
    const btnCancelForm = () => {
        setIsOpen(false);
    }
    useEffect(() => {
        if (isOpen && formRef.current) {
            disableBodyScroll(formRef.current, {
                allowTouchMove: (el) => {
                    // Cho phép cuộn trong chính form hoặc con của nó
                    while (el && el !== document.body) {
                        if (el === formRef.current) return true;
                        el = el.parentElement as HTMLElement;
                    }
                    return false;
                },
            });
            document.body.classList.add('scroll-lock-fixed');
        } else if (formRef.current) {
            enableBodyScroll(formRef.current);
            document.body.classList.remove('scroll-lock-fixed');
        }

        return () => {
            clearAllBodyScrollLocks();
            document.body.classList.remove('scroll-lock-fixed');
        };
    }, [isOpen]);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    return (
        <div className={`form-toggle relative flex justify-center items-center w-fit h-fit ${className ? className : ''}`}>
            <div className='w-fit h-fit'
                ref={originRef}
            >
                <CustomButton
                    label={btnLabel}
                    variant={btnVariant ? btnVariant : 'type-7'}
                    onClick={btnAddTournament}
                    needPermission={needPermission}
                />
            </div>
            <AnimatePresence>
                {
                    isOpen &&

                    <motion.div
                        className='form flex items-center justify-center z-50 p-3'
                        style={{
                            // top:'env(safe-area-inset-top)',
                            // bottom:'calc(-1 * env(safe-area-inset-bottom))',
                            // color:'red'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, pointerEvents: 'none' }}
                    >
                        <motion.div
                            ref={formRef}
                            className={`w-full`}
                            initial={{
                                scale: 0,
                                x: origin.x - window.innerWidth / 2 + origin.width / 2,
                                y: origin.y - vh / 2 + origin.height / 2,
                            }}
                            animate={{ scale: 1, x: 0, y: 0 }}
                            exit={{
                                scale: 0,
                                x: origin.x - window.innerWidth / 2 + origin.width / 2,
                                y: origin.y - vh / 2 + origin.height / 2,
                            }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            style={{maxWidth:formWidth?formWidth:'600px'}}
                        >
                            <div className='content-wrapper'>
                                <div className={` p-6 rounded-2xl shadow-2xl max-h-[600px] overflow-y-auto hide-scrollbar`}>
                                    <h3 className='text-xl font-bold mb-2'>{formTitle}</h3>
                                    <div className='p-2'>
                                        {WithLoading ? (
                                            (() => {
                                                const ElementWithLoading = WithLoading(Element);
                                                return <ElementWithLoading btnCancel={btnCancelForm} onConfirm={onConfirm} />;
                                            })()
                                        ) : (
                                            <Element btnCancel={btnCancelForm} onConfirm={onConfirm}  />
                                        )}

                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}

export default FormToggle;