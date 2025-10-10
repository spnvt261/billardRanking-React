import { motion, AnimatePresence } from "framer-motion";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ChangeEvent } from "react";
import './AddPlayerForm.css'
import CustomTextField from "../../customTextField/CustomTextField";
import CustomButton from "../../customButtons/CustomButton";
import { connect } from "react-redux";
// import viewActions from "../../../redux/ui/viewActions";
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export type ChildHandle = {
    updateCoords: (coords: { x: number; y: number; width: number; height: number }) => void;
};
const AddPlayerFormForwardRef = (props: any, ref: any) => {

    console.log('AddplayerFormForwardRef');
    const { isOpen, closeAddPlayerForm } = props;
    const formRef = useRef<HTMLDivElement>(null);
    const [origin, setOrigin] = useState({ x: 0, y: 0, width: 0, height: 0 });
    useImperativeHandle(ref, () => ({
        updateCoords(newOrigin: any) {
            setOrigin(newOrigin);
        },
    }));

    const [newPlayer, setNewPlayer] = useState<object | null>(null);
    const _onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPlayer({
            ...newPlayer,
            [e.target.name]: e.target.value,
        })
    }
    const _onSubmit = () => {
        console.log(newPlayer);

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
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="add-player-form fixed inset-0 flex items-center justify-center z-50 p-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, pointerEvents: 'none' }}
                >
                    <motion.div
                        ref={formRef}
                        className=" bg-white p-6 rounded-2xl shadow-2xl w-full max-w-[700px]"
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
                                type="file"
                                onChange={_onChangeInput}
                            />
                            <div className="flex justify-end mt-4">
                                <CustomButton
                                    label='Hủy'
                                    variant="type-4"
                                    onClick={closeAddPlayerForm}
                                    className="mr-2"
                                />
                                <CustomButton
                                    label='Lưu'
                                    variant="type-2"
                                    onClick={_onSubmit}
                                    needPermission
                                />
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
const mapStateToProps = () => {
    return {
        // isOpen: state.view.addPlayerFormIsOpen
    }
}

const mapDispatchToProp = () => {
    return {
        // closeAddPlayerForm: () => dispatch(viewActions.closeAddPlayerForm())
    }
}
export default connect(mapStateToProps, mapDispatchToProp, null, { forwardRef: true })(forwardRef(AddPlayerFormForwardRef));
