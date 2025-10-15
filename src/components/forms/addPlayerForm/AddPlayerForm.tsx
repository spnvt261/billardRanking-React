import { useEffect, useState, type ChangeEvent } from "react"
import CustomButton from "../../customButtons/CustomButton";
import CustomTextField from "../../customTextField/CustomTextField";
import { motion } from "framer-motion";

interface Props {
    btnCancel: () => void;
    showLoading?: (show: boolean) => void;
    isLoading?: boolean;
}
const addPlayerForm = ({ btnCancel, showLoading, isLoading }: Props) => {
    const [showOptional, setShowOptional] = useState(false);
    useEffect(() => {
        if (isLoading && showLoading) {
            showLoading(isLoading)
        }
    }, [isLoading])

    const [newPlayer, setNewPlayer] = useState<object>({})
    const textFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPlayer({
            ...newPlayer,
            [e.target.name]: e.target.value,
        })
    }
    const btnConfirmAddPlayer = () => {
        const updated = {
            ...newPlayer,
        };
        setNewPlayer(updated);
    }
    return (
        <form className="flex flex-col">
            <CustomTextField
                label="Tên"
                name="name"
                onChange={textFieldChange}
            />
            <CustomTextField
                label="Image"
                name="image"
                type="file"
                onChange={textFieldChange}
            />
            {/* === Toggle thông tin bổ sung với icon xoay === */}
            <div
                className="cursor-pointer select-none flex items-center"
                onClick={() => setShowOptional(!showOptional)}
            >
                <span className="mr-2">
                    {showOptional ? "Ẩn thông tin bổ sung" : "Hiển thị thông tin bổ sung"}
                </span>
                <motion.span
                    animate={{ rotate: showOptional ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                >
                    ▼
                </motion.span>
            </div>

            {/* === Phần thông tin bổ sung === */}
            <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: showOptional ? 1 : 0, opacity: showOptional ? 1 : 0 }}
                style={{ originY: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border rounded-md bg-gray-50 flex flex-col gap-1 overflow-hidden"
            >
                {showOptional && (
                    <>
                        <h3 className="text-lg font-semibold mb-4">Thông tin thêm</h3>
                        <CustomTextField
                            label="Biệt danh"
                            name="nickname"
                            onChange={textFieldChange}
                        />
                        <CustomTextField
                            label="Elo khởi điểm"
                            name="curent_elo"
                            type="number"
                            onChange={textFieldChange}
                        />
                        <CustomTextField
                            label="Mô tả"
                            name="description"
                            type="textarea"
                            onChange={textFieldChange}
                        />
                    </>
                )}
            </motion.div>
            <div className="flex justify-end mt-4">
                <CustomButton
                    label='Hủy'
                    variant="type-4"
                    onClick={btnCancel}
                    className="mr-2"
                />
                <CustomButton
                    label='Lưu'
                    variant="type-2"
                    onClick={btnConfirmAddPlayer}
                    needPermission
                />
            </div>

        </form>
    )
}
export default addPlayerForm