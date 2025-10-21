import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomButton from "../../customButtons/CustomButton";
import CustomTextField from "../../customTextField/CustomTextField";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";
import { useWorkspace } from "../../../customhook/useWorkspace";
import playerActions from "../../../redux/features/player/playerActions";
import { connect } from "react-redux";
import type { PlayersRequest } from "../../../types/player";
import { useNotification } from "../../../customhook/useNotifycation";

interface Props {
    btnCancel: () => void;
    showLoading?: (show: boolean) => void;
    createPlayer: (player: PlayersRequest) => void;
    upLoadImages: (file: File) => string;
    isLoading: boolean;
}

interface FormValues {
    name: string;
    avatarUrl: File | null;
    nickname: string | null;
    startElo: number;
    description: string | null;
    workspaceId: number | null;
}

const AddPlayerForm = ({ btnCancel, showLoading, isLoading, createPlayer, upLoadImages }: Props) => {
    const [showOptional, setShowOptional] = useState(false);
    const { notify } = useNotification();
    const { workspaceId } = useWorkspace();
    useEffect(() => {
        if (showLoading) showLoading(isLoading)
    }, [isLoading])
    const formik = useFormik<FormValues>({
        initialValues: {
            name: "",
            avatarUrl: null,
            nickname: null,
            startElo: 0,
            description: null,
            workspaceId: workspaceId ? Number(workspaceId) : null
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Vui lòng nhập tên người chơi"),
            image: Yup.mixed().notRequired(),
            nickname: Yup.string().notRequired(),
            startElo: Yup.number()
                .typeError("Elo phải là số")
                .min(0, "Elo không được âm")
                .notRequired(),
            description: Yup.string().notRequired(),
        }),
        onSubmit: async (values) => {
            let imageUrl = undefined;
            let x = 0;
            try {
                if (values.avatarUrl) {
                    // upload ảnh trước khi tạo player
                    imageUrl = await upLoadImages(values.avatarUrl); // truyền file
                    // console.log(imageUrl);

                }
            } catch (err) {
                notify(`Lỗi khi upload ảnh ${err}`, 'error');
                x = x + 1;
            }

            const dataRequest = {
                name: values.name,
                avatarUrl: imageUrl ? imageUrl : undefined,
                nickname: values.nickname || undefined,
                startElo: values.startElo,
                description: values.description || undefined,
                workspaceId: values.workspaceId ? Number(values.workspaceId) : null,
            };

            try {
                createPlayer(dataRequest)
                if (x == 0) notify('Thêm người chơi thành công', 'success')
                btnCancel()
            } catch (err) {
                console.log(err);
                notify(`Lỗi kết nối hệ thống ${err}`, 'error')
            }
        },
    });

    /** Xử lý upload file */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        formik.setFieldValue("avatarUrl", file);
    };

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col"
            noValidate
        >
            {/* === Tên người chơi === */}
            <CustomTextField
                label="Tên*"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.errors.name}
            />

            <CustomTextField
                label="Elo khởi điểm"
                name="startElo"
                type="number"
                value={formik.values.startElo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={

                    Boolean(formik.errors.startElo)
                }
                helperText={

                    formik.errors.startElo
                }
            />

            {/* === Ảnh === */}
            <CustomTextField
                label="Ảnh"
                name="avatarUrl"
                type="file"
                onChange={handleFileChange}
                error={formik.touched.avatarUrl && Boolean(formik.errors.avatarUrl)}
                helperText={(formik.errors.avatarUrl as string)}
            />

            {/* === Toggle thông tin bổ sung === */}
            <div
                className="cursor-pointer select-none flex items-center"
                onClick={() => setShowOptional(!showOptional)}
            >
                <span className="mr-2">Thông tin bổ sung</span>
                <motion.span
                    animate={{ rotate: showOptional ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                >
                    <FaChevronDown />
                </motion.span>
            </div>

            {/* === Phần thông tin bổ sung === */}
            <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                    scaleY: showOptional ? 1 : 0,
                    opacity: showOptional ? 1 : 0,
                }}
                style={{ originY: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border rounded-md bg-gray-50 flex flex-col gap-1 overflow-hidden"
            >
                {showOptional && (
                    <>
                        <h3 className="text-lg font-semibold mb-4">
                            Thông tin thêm
                        </h3>
                        <CustomTextField
                            label="Biệt danh"
                            name="nickname"
                            value={formik.values.nickname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />

                        <CustomTextField
                            label="Mô tả"
                            name="description"
                            type="text"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </>
                )}
            </motion.div>

            {/* === Nút hành động === */}
            <div className="flex justify-end mt-4">
                <CustomButton
                    label="Hủy"
                    variant="type-4"
                    onClick={btnCancel}
                    className="mr-2"
                />
                <CustomButton
                    label={isLoading ? "Đang lưu..." : "Lưu"}
                    variant="type-2"
                    type="submit"
                />
            </div>
        </form>
    );
};

const mapStateToProps = (state: any) => ({
    isLoading: state.players.isLoading
});

const mapDispatchToProps = (dispatch: any) => ({
    createPlayer: (data: PlayersRequest) =>
        dispatch(playerActions.createPlayer(data)),
    upLoadImages: (file: File) => dispatch(playerActions.upLoadImages(file))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPlayerForm);
