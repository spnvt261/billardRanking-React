import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import CustomTextField from "../../customTextField/CustomTextField";
import CustomSelect from "../../customSelect/CustomSelect";
import CustomButton from "../../customButtons/CustomButton";
import { FaChevronDown } from "react-icons/fa6";
import { TournamentFormat, TournamentRoundStatus, TournamentStatus, TournamentType, type TournamentsRequest } from "../../../types/tournament";
import type { PlayerSelect } from "../../../types/player";
import { tournamentTypeOptions } from "../../../constants/tournamentTypes";
import { useNotification } from "../../../customhook/useNotifycation";
import { useWorkspace } from "../../../customhook/useWorkspace";
import { formatDateVN } from "../../../ultils/format";
import { connect } from "react-redux";
import tournamentActions from "../../../redux/features/tournament/tournamentActions";
import playerActions from "../../../redux/features/player/playerActions";
import WithLoading from "../../loading/WithLoading";

interface Props {
    btnCancel: () => void;
    getListPlayerSelect: (workspaceId: string) => Promise<void>;
    createTournament: (data: TournamentsRequest) => Promise<void>;
    upLoadImages: (file: File) => Promise<string>;
    isLoading: boolean;
    showLoading?: (isLoading: boolean) => void;
    listPlayerSelect: PlayerSelect[];
}
const AddTournamentForm = ({ btnCancel, getListPlayerSelect, createTournament, upLoadImages, isLoading, showLoading, listPlayerSelect }: Props) => {
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [showOptional, setShowOptional] = useState(false);
    const { workspaceId } = useWorkspace();
    const { notify } = useNotification()
    const playerOptions: PlayerSelect[] = listPlayerSelect.map(p => ({
        label: p.label,
        value: Number(p.value)
    }));

    useEffect(() => {
        if (showLoading) showLoading(isLoading)
    }, [isLoading])

    useEffect(() => {
        if (listPlayerSelect.length == 0 && workspaceId) {
            getListPlayerSelect(workspaceId)
        }
    }, [])

    const formik = useFormik<TournamentsRequest>({
        initialValues: {
            workspaceId: workspaceId ? Number(workspaceId) : 0,
            name: "",
            tournamentType: undefined,
            round1PlayersAfter: undefined,
            round1Status:TournamentRoundStatus.UPCOMING,
            tournamentType2: undefined,
            round2PlayersAfter: undefined,
            round2Status:TournamentRoundStatus.NOT_STARTED,
            tournamentType3: undefined,
            round3Status:TournamentRoundStatus.NOT_STARTED,
            startDate: "",
            endDate: undefined,
            location: undefined,
            prize: 0,
            description: undefined,
            rules: undefined,
            banner: undefined,
            status: TournamentStatus.ONGOING,
            playerIds: [],
            format: TournamentFormat.SINGLE
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Vui lòng nhập tên giải đấu"),
            // prize: Yup.number().min(0, "Giải thưởng không được âm").required(),
            playerIds: Yup.array().min(2, "Vui lòng chọn ít nhất 2 người chơi"),
            tournamentType: Yup.mixed<TournamentType>().oneOf(
                Object.values(TournamentType),
                "Vui lòng chọn thể thức hợp lệ"
            ).required("Vui lòng chọn thể thức"),
            tournamentType2: Yup.mixed<TournamentType>().oneOf(Object.values(TournamentType)).optional(),
            tournamentType3: Yup.mixed<TournamentType>().oneOf(Object.values(TournamentType)).optional(),
        }),
        onSubmit: async (values) => {
            let bannerUrl: string | undefined;
            let x = 0;
            try {
                if (values.banner instanceof File) {
                    bannerUrl = await upLoadImages(values.banner);
                }
            } catch (err) {
                console.error("Lỗi khi upload ảnh:", err);
                notify(`Lỗi khi thêm ảnh: ${err}`, "error");
                x += 1;
            }
            const requestValues = {
                ...values,
                banner: bannerUrl,
                startDate: formik.values.startDate ? formik.values.startDate : formatDateVN(new Date())
            }

            try {
                // console.log(requestValues);
                createTournament(requestValues);
                if (x == 0) notify("Tạo giải đấu thành công", "success");
                btnCancel();
            } catch (err) {
                notify(`Lỗi khi tạo giải đấu: ${err}`, "error");
                console.log(err);

            }
        },
    });

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBannerPreview(URL.createObjectURL(file));
            formik.setFieldValue("banner", file);
        }
    };

    return (
        <form className="flex flex-col gap-2" onSubmit={formik.handleSubmit}>
            <CustomTextField
                label="Tên giải đấu*"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name ? formik.errors.name : ""}
            />

            <CustomTextField
                label="Ngày bắt đầu*"
                name="startDate"
                type="date"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                helperText={formik.touched.startDate ? formik.errors.startDate : ""}
            />

            <CustomTextField
                label="Tổng giải thưởng"
                name="prize"
                type="money"
                // value={formik.values.prize}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.prize && Boolean(formik.errors.prize)}
                helperText={formik.touched.prize ? formik.errors.prize : ""}
            />
            <div className="flex mb-2 items-center">
                <p className="mr-2 min-w-[80px] flex flex-col justify-center">
                    Players* <br />
                    <span className="text-xs text-gray-600 font-normal">
                        Đã chọn [{formik.values.playerIds.length}]
                    </span>
                </p>
                <div className="relative flex-1 w-[70%]">
                    <CustomSelect
                        options={playerOptions.map(p => ({ label: p.label, value: p.value.toString() }))}
                        value={formik.values.playerIds.map(p => p.toString())}
                        onChange={(v: string[]) => formik.setFieldValue(
                            "playerIds",
                            v.map(s => Number(s))
                        )}
                        multiple
                        placeholder="Thêm cơ thủ"
                        className="w-full"
                        spanMaxWidth="150px"
                        search
                    />
                    {/* <span className="ml-3 text-sm text-gray-600 whitespace-nowrap">
                    Đã chọn: {formik.values.playerIds.length}
                </span> */}
                    {formik.touched.playerIds && formik.errors.playerIds && (
                        <p className="absolute -bottom-4 left-0 text-red-500 text-sm ml-2">{formik.errors.playerIds}</p>
                    )}
                </div>

            </div>
            <div className="flex flex-col mb-4">
                <div className="relative flex items-center mb-2">
                    <p className="mr-2 min-w-[80px]">ROUND 1</p>
                    <CustomSelect
                        options={tournamentTypeOptions}
                        value={[formik.values.tournamentType ? formik.values.tournamentType : '']}
                        onChange={(v: string[]) => formik.setFieldValue("tournamentType", v[0] as TournamentType)}
                        multiple={false}
                        placeholder="Chọn thể thức"
                        className="flex-1 w-[70%]"
                    />
                    {formik.touched.tournamentType && formik.errors.tournamentType && (
                        <p className="absolute -bottom-4 left-0 text-red-500 text-sm ml-2">{formik.errors.tournamentType}</p>
                    )}
                </div>

                {(formik.values.tournamentType2 || formik.values.tournamentType2 === null) && (
                    <div className="flex items-center mb-2">
                        <p className="mr-2 min-w-[80px]">ROUND 2 </p>
                        <CustomSelect
                            options={tournamentTypeOptions}
                            value={[formik.values.tournamentType2]}
                            onChange={(v: string[]) => formik.setFieldValue("tournamentType2", v[0] as TournamentType)}
                            multiple={false}
                            placeholder="Chọn thể thức"
                            className="flex-1 w-[70%]"
                        />
                    </div>
                )}

                {(formik.values.tournamentType3 || formik.values.tournamentType3 === null) && (
                    <div className="flex items-center mb-2">
                        <p className="mr-2 min-w-[80px]">ROUND 3 </p>
                        <CustomSelect
                            options={tournamentTypeOptions}
                            value={[formik.values.tournamentType3]}
                            onChange={(v: string[]) => formik.setFieldValue("tournamentType3", v[0] as TournamentType)}
                            multiple={false}
                            placeholder="Chọn thể thức"
                            className="flex-1 w-[70%]"
                        />
                    </div>
                )}

                {/* Nhóm nút thêm/giảm */}
                {
                    <div className="flex gap-3 mt-1">
                        {/* Nút thêm */}
                        {(!formik.values.tournamentType3 && formik.values.tournamentType3 !== null) && (
                            <button
                                type="button"
                                className="text-blue-500 text-sm hover:underline"
                                onClick={() => {
                                    if (!formik.values.tournamentType2 && formik.values.tournamentType2 !== null)
                                        formik.setFieldValue("tournamentType2", null);
                                    else if (!formik.values.tournamentType3)
                                        formik.setFieldValue("tournamentType3", null);
                                }}
                            >
                                + Thêm Vòng đấu
                            </button>
                        )}

                        {/* Nút giảm */}
                        {(formik.values.tournamentType3 || formik.values.tournamentType3 === null || formik.values.tournamentType2 || formik.values.tournamentType2 === null) && (
                            <button
                                type="button"
                                className="text-red-500 text-sm hover:underline"
                                onClick={() => {
                                    if (formik.values.tournamentType3 || formik.values.tournamentType3 === null)
                                        formik.setFieldValue("tournamentType3", undefined);
                                    else if (formik.values.tournamentType2 || formik.values.tournamentType2 === null)
                                        formik.setFieldValue("tournamentType2", undefined);
                                }}
                            >
                                − Giảm vòng đấu
                            </button>
                        )}
                    </div>
                }

            </div>


            {/* Thông tin bổ sung */}
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
                    <FaChevronDown size={18} />
                </motion.span>
            </div>

            <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: showOptional ? 1 : 0, opacity: showOptional ? 1 : 0 }}
                style={{ originY: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border rounded-md bg-gray-50 flex flex-col gap-1 overflow-hidden"
            >
                {showOptional && (
                    <>
                        <CustomTextField
                            label="Banner"
                            name="banner"
                            type="file"
                            onChange={handleBannerChange}
                        />
                        {bannerPreview && (
                            <div className="flex justify-center w-full">
                                <img
                                    src={bannerPreview}
                                    alt="Banner Preview"
                                    className="w-[200px] h-[100px] object-cover mt-2 rounded"
                                />
                            </div>
                        )}
                        <CustomTextField
                            label="Địa điểm"
                            name="location"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                        />
                        <CustomTextField
                            label="Mô tả"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                        <CustomTextField
                            label="Luật chơi"
                            name="rules"
                            value={formik.values.rules}
                            onChange={formik.handleChange}
                        />
                    </>
                )}
            </motion.div>

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
                    type="submit"
                />
            </div>
        </form>
    );
};

const mapStateToProps = (state: any) => ({
    isLoading: state.tournaments.isCreateLoading,
    listPlayerSelect: state.players.listPlayerSelect,
});

const mapDispatchToProps = (dispatch: any) => ({
    createTournament: (data: TournamentsRequest) => dispatch(tournamentActions.createTournament(data)),
    getListPlayerSelect: (workspaceId: string) => dispatch(playerActions.getListPlayerSelect(workspaceId)),
    upLoadImages: (file: File) => dispatch(tournamentActions.upLoadImages(file))
});

export default connect(mapStateToProps, mapDispatchToProps)(WithLoading(AddTournamentForm));
