import { useEffect, useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import CustomTextField from "../../customTextField/CustomTextField";
import CustomSelect from "../../customSelect/CustomSelect";
import CustomButton from "../../customButtons/CustomButton";
import { listplayerSelect, listTypeTournament } from "../../../data/tournamentData";
import { FaChevronDown } from "react-icons/fa6";

interface Props {
    btnCancel: () => void;
    showLoading?: (show: boolean) => void;
    isLoading?: boolean;
}

const AddTournamentForm = ({ btnCancel, showLoading, isLoading }: Props) => {
    useEffect(() => {
        if (isLoading && showLoading) {
            showLoading(isLoading);
        }
    }, [isLoading]);

    const [newTournament, setNewTournament] = useState<any>({});
    const [listPlayerSelected, setListPlayerSelected] = useState<string[]>([]);
    const [listTypeTournamentSelected, setListTypeTournamentSelected] = useState<string[]>([]);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [showOptional, setShowOptional] = useState(false);

    const textFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;
        if (name === "banner" && files?.length) {
            setBannerPreview(URL.createObjectURL(files[0]));
            setNewTournament({ ...newTournament, [name]: files[0] });
        } else {
            setNewTournament({ ...newTournament, [name]: value });
        }
    };

    const btnConfirmAddTournament = () => {
        const updated = {
            ...newTournament,
            listPlayerId: listPlayerSelected,
            listType: listTypeTournamentSelected,
        };
        setNewTournament(updated);
        console.log(updated);
    };

    return (
        <form className="flex flex-col gap-2">

            {/* <div className="p-4 border rounded-[1rem] bg-gray-50 flex flex-col gap-2"> */}
            {/* <h3 className="text-lg font-semibold mb-2">Thông tin bắt buộc</h3> */}
            <CustomTextField
                label="Tên giải đấu*"
                name="name"
                onChange={textFieldChange}
            />
            <CustomTextField
                label="Ngày bắt đầu*"
                name="date"
                type="date"
                onChange={textFieldChange}
            />
            <CustomTextField
                label="Tổng giải thưởng"
                name="prize"
                type="money"
                onChange={textFieldChange}
            />
            <div className="flex mb-4 items-center">
                <p className="mr-2">Players* </p>
                <CustomSelect
                    options={listplayerSelect}
                    value={listPlayerSelected}
                    onChange={setListPlayerSelected}
                    multiple
                    placeholder="Thêm cơ thủ"
                    className="flex-1 w-[70%]"
                    spanMaxWidth="150px"
                />
            </div>
            <div className="flex mb-4 max-h-[40px] items-center">
                <p className="mr-2">Thể thức* </p>
                <CustomSelect
                    options={listTypeTournament}
                    value={listTypeTournamentSelected}
                    onChange={setListTypeTournamentSelected}
                    multiple
                    placeholder="Chọn thể thức"
                    className="flex-1 w-[70%]"
                    spanMaxWidth="150px"
                />
            </div>
            {/* </div> */}

            {/* === Toggle thông tin bổ sung với icon xoay === */}
            <div
                className="cursor-pointer select-none flex items-center"
                onClick={() => setShowOptional(!showOptional)}
            >
                <span className="mr-2">
                    {/* {showOptional ? "Ẩn thông tin bổ sung" : "Hiển thị thông tin bổ sung"} */}
                    Thông tin bổ sung
                </span>
                <motion.span
                    animate={{ rotate: showOptional ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                >
                    <FaChevronDown size={18} />
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
                        <h3 className="text-lg font-semibold mb-4">Thông tin bổ sung</h3>

                        <CustomTextField
                            label="Banner"
                            name="banner"
                            type="file"
                            onChange={textFieldChange}
                        />
                        {bannerPreview && (
                            <img
                                src={bannerPreview}
                                alt="Banner Preview"
                                className="w-[200px] h-[100px] object-cover mt-2 rounded"
                            />
                        )}

                        <CustomTextField
                            label="Địa điểm"
                            name="location"
                            type="text"
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

            {/* === Buttons === */}
            <div className="flex justify-end mt-4">
                <CustomButton
                    label="Hủy"
                    variant="type-4"
                    className="mr-2"
                    onClick={btnCancel}
                />
                <CustomButton
                    label="Tạo"
                    variant="type-2"
                    onClick={btnConfirmAddTournament}
                    needPermission
                />
            </div>
        </form>
    );
};

export default AddTournamentForm;
