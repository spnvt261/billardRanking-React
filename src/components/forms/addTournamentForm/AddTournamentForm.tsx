import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import CustomButton from '../../customButtons/CustomButton'
import CustomTextField from '../../customTextField/CustomTextField'
import './AddTournamentForm.css'
import { AnimatePresence, motion } from 'framer-motion'
import CustomSelect from '../../customSelect/CustomSelect'
import { listplayerSelect, listTypeTournament } from '../../../data/tournamentData'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

const AddTournamentForm = () => {
    console.log('Add Tournament Form');
    const [newTourNament, setNewTournament] = useState<object>({})
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [listPlayerSelected, setListPlayerSelected] = useState<string[]>([]);
    const [listTypeTournamentSelected, setListTypeTournamentSelected] = useState<string[]>([]);
    const originRef = useRef<HTMLDivElement>(null);;
    const formRef = useRef<HTMLDivElement>(null);
    const btnAddTournament = () => {
        if (originRef.current) {
            const rect = originRef.current.getBoundingClientRect();
            setOrigin({ x: rect.x, y: rect.y, width: rect.width, height: rect.height })
        }
        setIsOpen(true);
    }
    const textFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTournament({
            ...newTourNament,
            [e.target.name]: e.target.value,
        })
        console.log(e.target.name);

    }
    const btnCancelForm = () => {
        setListPlayerSelected([]);
        setIsOpen(false);
    }
    const btnConfirmAddTournament = () => {
        console.log(newTourNament);
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
        <div className='relative w-fit h-fit'>
            <div className='mb-4 w-fit h-fit'
                ref={originRef}
            >
                <CustomButton
                    label='Thêm giải đấu mới'
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
                        className='add-tournament-form fixed inset-0 flex items-center justify-center z-50 p-3 overflow-y-auto'
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
                            <div className='add-tournament-wrapper'>
                                <div className=' p-6 rounded-2xl shadow-2xl'>
                                    <h3 className='text-xl font-bold mb-2'>Tạo giải đấu</h3>
                                    <div className='p-2'>
                                        <form className='flex flex-col'>
                                            <CustomTextField
                                                label='Tên giải đấu*'
                                                name='name'
                                                onChange={textFieldChange}
                                            />
                                            <CustomTextField
                                                label='Banner'
                                                name='banner'
                                                type='file'
                                                onChange={textFieldChange}
                                            />
                                            <CustomTextField
                                                label='Ngày bắt đầu*'
                                                name='date'
                                                type='date'
                                                onChange={textFieldChange}
                                            />
                                            <CustomTextField
                                                label='Địa điểm'
                                                name='location'
                                                type='text'
                                                onChange={textFieldChange}
                                            />
                                            <CustomTextField
                                                label='Tổng giải thưởng'
                                                name='prize'
                                                type='money'
                                                onChange={textFieldChange}
                                            />
                                            <div className='flex mb-4 max-h-[40px]'>
                                                <div className='flex items-center mr-[0.3rem]'>
                                                    <p>Players* </p>
                                                </div>
                                                <CustomSelect
                                                    options={listplayerSelect}
                                                    value={listPlayerSelected}
                                                    onChange={setListPlayerSelected}
                                                    multiple
                                                    placeholder='Thêm người chơi'
                                                    className='mb-[0] flex-1 w-[70%]'
                                                    spanMaxWidth='150px'
                                                />
                                            </div>
                                            <div className='flex mb-4 max-h-[40px]'>
                                                <div className='flex items-center mr-[0.3rem]'>
                                                    <p>Thể thức* </p>
                                                </div>
                                                <CustomSelect
                                                    options={listTypeTournament}
                                                    value={listTypeTournamentSelected}
                                                    onChange={setListTypeTournamentSelected}
                                                    multiple
                                                    placeholder='Chọn thể thức'
                                                    className='mb-[0] flex-1 w-[70%]'
                                                    spanMaxWidth='150px'
                                                />
                                            </div>

                                            <div className='flex justify-end mt-[7rem]'>
                                                <CustomButton
                                                    label='Hủy'
                                                    variant='type-4'
                                                    className='mr-2'
                                                    onClick={btnCancelForm}
                                                />
                                                <CustomButton
                                                    label='Tạo'
                                                    variant='type-2'
                                                    onClick={btnConfirmAddTournament}
                                                    needPermission
                                                />
                                            </div>


                                        </form>
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

export default AddTournamentForm