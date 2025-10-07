import { motion, AnimatePresence } from "framer-motion";
import React, { useState, type ChangeEvent } from "react";
import './AddPlayerForm.css'
import CustomTextField from "../../customTextField/CustomTextField";
import CustomButton from "../../customButtons/CustomButton";
 "../../customInput/CustomTextField";
interface AddPlayerFormProps {
    isOpen: boolean;
    onClose: () => void;
    origin: { x: number; y: number; width: number; height: number };
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ isOpen, onClose, origin }) => {
    // console.log('AddplayerForm');
    const [obj,setObj]=useState<object |null>(null);
    const _onChangeInput=(e: ChangeEvent<HTMLInputElement>)=>{
        setObj({
            ...obj,
            [e.target.name]: e.target.value,
        })
    }
    const _onSubmit=()=>{
        // console.log(obj);
        
    }
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="add-player-form fixed inset-0 flex items-center justify-center z-50 p-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className=" bg-white p-6 rounded-2xl shadow-2xl w-[700px]"
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
                        <h3 className="text-xl font-bold mb-4">Thêm cơ thủ mới</h3>
                        <form className="flex flex-col">
                            <CustomTextField
                                label="Tên"
                                name="name"
                                onChange={_onChangeInput}
                            />
                            <CustomTextField
                                label="Image"
                                name="image"
                                onChange={_onChangeInput}
                            />
                            <div className="flex justify-end">
                                <CustomButton
                                    label='Hủy'
                                    variant="type-4"
                                    onClick={onClose}
                                    className="mr-2"
                                />
                                <CustomButton
                                    label='Lưu'
                                    variant="type-2"
                                    onClick={_onSubmit}
                                />
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default React.memo(AddPlayerForm);
