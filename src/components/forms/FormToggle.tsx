import { AnimatePresence, motion } from 'framer-motion'
import './FormToggle.css'
import CustomButton from '../customButtons/CustomButton'
import { useEffect, useRef, useState, type ComponentType} from 'react';
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
interface FormToggleProps{
    btnLabel:string;
    formTitle:string;
    element:ComponentType<{ btnCancel: () => void }>;
}
const FormToggle = ({btnLabel,formTitle,element:Element}:FormToggleProps) => {
    console.log('Add Tournament Form');
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
            disableBodyScroll(formRef.current); // khóa background, vẫn cho scroll trong form
        } else if (formRef.current) {
            enableBodyScroll(formRef.current);
        }

        return () => {
            clearAllBodyScrollLocks(); // dọn dẹp khi component unmount
        };
    }, [isOpen]);
    return (
        <div className='form-toggle relative w-fit h-fit'>
            <div className='mb-4 w-fit h-fit'
                ref={originRef}
            >
                <CustomButton
                    label={btnLabel}
                    variant='type-7'
                    onClick={btnAddTournament}
                    needPermission
                />
            </div>
            <div
                className={`add-tournament-wrapper bg-white rounded-2xl shadow-2xl`}
            >
            </div>
            <AnimatePresence>
                {
                    isOpen &&
                    <motion.div
                        className='form fixed inset-0 flex items-center justify-center z-50 p-3 overflow-y-auto'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, pointerEvents: 'none' }}
                    >
                        <motion.div
                            ref={formRef}
                            className='w-full max-w-[600px]'
                            initial={{
                                scale: 0,
                                x: origin.x - window.innerWidth / 2 + origin.width / 2,
                                y: origin.y - window.innerHeight / 2 + origin.height / 2,
                            }}
                            animate={{ scale: 1, x: 0, y: 0 }}
                            exit={{
                                scale: 0,
                                x: origin.x - window.innerWidth / 2 + origin.width / 2,
                                y: origin.y - window.innerHeight / 2 + origin.height / 2,
                            }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        >
                            <div className='content-wrapper'>
                                <div className=' p-6 rounded-2xl shadow-2xl'>
                                    <h3 className='text-xl font-bold mb-2'>{formTitle}</h3>
                                    <div className='p-2'>
                                        <Element
                                            btnCancel={btnCancelForm}
                                        />
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
export default FormToggle