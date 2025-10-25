import { type FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MatchStatus, type Match } from "../../../../../types/match";
import CustomButton from "../../../../customButtons/CustomButton";
import CustomTextField from "../../../../customTextField/CustomTextField";
import { connect } from "react-redux";
import tournamentDetailActions from "../../../../../redux/features/tournamentDetails/tournamentDetailAction";
import { useWorkspace } from "../../../../../customhook/useWorkspace";
import { useNotification } from "../../../../../customhook/useNotifycation";
import { useNavigate } from "react-router-dom";
import PATHS from "../../../../../router/path";
import WithLoading from "../../../../loading/WithLoading";
import matchScoreEventActions from "../../../../../redux/features/matchScoreEvent/matchScoreEventActions";
import { LOCAL_STORAGE_TOKEN_LOCK_SCORE_COUNTER } from "../../../../../constants/localStorage";

interface Props {
    match: Match;
    onClose: () => void;
    isLoading: boolean;
    updateMatch: (matchId: string, newMatch: Match, workspaceId: string, roundNumber: 1 | 2 | 3) => Promise<void>;
    showLoading?: (isLoading: boolean) => void;
    roundNumber: 1 | 2 | 3;
    lockScoreCounterByUuid: (matchUuid: string, workspaceId: string, raceTo: number) => Promise<string>;
    // verifyTokenLockCounter: (matchUuid: string, workspaceId: string, token: string) => Promise<boolean>
}

const validationSchema = Yup.object({
    scoreTeam1: Yup.number().typeError("Điểm phải là số").min(0).required("Nhập điểm đội 1"),
    scoreTeam2: Yup.number().typeError("Điểm phải là số").min(0).required("Nhập điểm đội 2"),
});

const EditMatch: FC<Props> = ({ match, onClose, updateMatch, roundNumber, showLoading, isLoading, lockScoreCounterByUuid }) => {
    const [mode, setMode] = useState<"CHOICE" | "ADD_RESULT" | "SCORE_COUNTER">("CHOICE");
    const [raceTo, setRaceTo] = useState<number>(0);
    const [raceToHellperText, setRaceToHellperText] = useState<string | undefined>(undefined);
    const { workspaceId } = useWorkspace();
    const { notify } = useNotification();
    const navigate = useNavigate()
    useEffect(() => {
        if (showLoading) showLoading(isLoading)
    }, [isLoading])
    const formik = useFormik({
        initialValues: {
            scoreTeam1: match.scoreTeam1 || 0,
            scoreTeam2: match.scoreTeam2 || 0,
            winnerId: match.winnerId ?? null,
        },
        validationSchema,
        onSubmit: async (values) => {
            const matchUpdated: Match = {
                ...match,
                scoreTeam1: values.scoreTeam1,
                scoreTeam2: values.scoreTeam2,
                winnerId: values.winnerId ? values.winnerId : undefined,
                status: MatchStatus.FINISHED
            }
            // console.log(matchUpdated);
            try {
                if (workspaceId) await updateMatch(matchUpdated.id.toString(), matchUpdated, workspaceId, roundNumber)
                notify('Tỉ số đã được cập nhật!', 'success')
                onClose();
            } catch (err) {
                notify(`Lỗi khi cập nhật tỉ số ${err}`, 'error')
                console.log(err);
            }
        },
    });

    // ✅ Tự động xác định đội thắng dựa trên điểm
    useEffect(() => {
        const { scoreTeam1, scoreTeam2 } = formik.values;
        if (scoreTeam1 > scoreTeam2) {
            formik.setFieldValue("winnerId", match.team1Id, false);
        } else if (scoreTeam2 > scoreTeam1) {
            formik.setFieldValue("winnerId", match.team2Id, false);
        } else {
            formik.setFieldValue("winnerId", null, false);
        }
    }, [formik.values.scoreTeam1, formik.values.scoreTeam2]);

    const getTeamNames = (players?: { name: string }[]) =>
        players && players.length > 0 ? players.map((p) => p.name).join(" & ") : "TBA";

    const handleStartScoreCounter = async () => {
        if (raceTo === 0) {
            setRaceToHellperText("Chạm 0 ??")
        } else if (!raceTo) {
            setRaceToHellperText("Chạm Mấy ???")
        } else if (raceTo < 0) {
            setRaceToHellperText("Chạm âm ???")
        }
        else {
            if (!workspaceId) return;

            const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_LOCK_SCORE_COUNTER);

            try {
                if (!storedToken) {
                    const token = await lockScoreCounterByUuid(match.uuid, workspaceId, raceTo);
                    localStorage.setItem(LOCAL_STORAGE_TOKEN_LOCK_SCORE_COUNTER, token);
                    navigate(`${PATHS.SCORE_COUNTER}/${match.uuid}`);
                    return;
                } else {
                    // const isValid = await verifyTokenLockCounter(match.uuid, workspaceId, storedToken);
                    // if (!isValid) {
                    //     notify('Invalid token!', 'error');
                    //     throw new Error('Token invalid');
                    // }
                    navigate(`${PATHS.SCORE_COUNTER}/${match.uuid}`);
                }
            } catch (err) {
                notify('Trận này đã có bảng tỉ số!', 'error');
                console.error(err);
            }
        }
    }
    return (
        <AnimatePresence>
            <motion.div
                className="fixed p-2 inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Form chính */}
                <motion.div
                    className="relative bg-white rounded-2xl shadow-2xl p-6 w-[420px] max-h-[90vh] overflow-y-auto hide-scrollbar"
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50 }}
                    transition={{ type: "spring", stiffness: 180, damping: 20 }}
                >
                    {/* Nút đóng */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                    >
                        <IoMdCloseCircleOutline size={24} />
                    </button>

                    <h2 className="text-lg font-semibold text-gray-800 mb-5 text-center">
                        Trận #{match.gameNumber}
                    </h2>

                    {/* Chế độ chọn */}
                    {mode === "CHOICE" && (
                        <div className="flex flex-col gap-4 items-center">
                            <CustomButton
                                label="Mở bảng tỉ số"
                                variant="type-3"
                                onClick={() => setMode("SCORE_COUNTER")}
                            />
                            {
                                // needPermission && 
                                match.status !== MatchStatus.ONGOING &&
                                <CustomButton
                                    label="Thêm kết quả"
                                    variant="type-1"
                                    onClick={() => setMode("ADD_RESULT")}
                                    needPermission
                                />
                            }

                        </div>
                    )}

                    {/* Chế độ nhập kết quả */}
                    {mode === "ADD_RESULT" && (
                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 text-gray-700">
                            {/* Bảng nhập điểm */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 border-b border-gray-300">
                                        <tr>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600">
                                                Người chơi
                                            </th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 w-[90px]">
                                                Điểm
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-200">
                                            <td className="px-3 py-2 font-medium text-gray-800">
                                                <p className="truncate max-w-[180px]">
                                                    {getTeamNames(match.team1?.players)}
                                                </p>

                                            </td>
                                            <td className="px-3 py-2">
                                                <CustomTextField
                                                    label=""
                                                    name="scoreTeam1"
                                                    type="number"
                                                    value={formik.values.scoreTeam1}
                                                    onChange={formik.handleChange}
                                                    className="w-[80px]"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2 font-medium text-gray-800">
                                                <p className="truncate max-w-[180px]">
                                                    {getTeamNames(match.team2?.players)}
                                                </p>
                                            </td>
                                            <td className="px-3 py-2">
                                                <CustomTextField
                                                    label=""
                                                    name="scoreTeam2"
                                                    type="number"
                                                    value={formik.values.scoreTeam2}
                                                    onChange={formik.handleChange}
                                                    className="w-[80px]"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {formik.values.scoreTeam1 === formik.values.scoreTeam2 && (
                                <p className="text-red-500 text-sm text-left">
                                    Không thể lưu kết quả khi hai đội hòa nhau.
                                </p>
                            )}
                            {/* Hiển thị đội thắng */}
                            <div className="border-t">
                                <h3 className="text-sm font-semibold mb-2 text-gray-600">Bên thắng</h3>
                                <div className="flex gap-3">
                                    {/* Đội 1 */}
                                    <div
                                        className={`px-3 py-1 border rounded-md w-[100px] text-center text-sm truncate ${formik.values.winnerId === match.team1Id
                                            ? "bg-gray-200 border-gray-500 font-semibold"
                                            : "bg-gray-50 border-gray-300"
                                            }`}
                                    >
                                        {getTeamNames(match.team1?.players)}
                                    </div>

                                    {/* Hòa */}
                                    <div
                                        className={`px-3 py-1 border rounded-md w-[100px] text-center text-sm ${formik.values.winnerId === null
                                            ? "bg-gray-200 border-gray-500 font-semibold"
                                            : "bg-gray-50 border-gray-300"
                                            }`}
                                    >
                                        Hòa
                                    </div>

                                    {/* Đội 2 */}
                                    <div
                                        className={`px-3 py-1 border rounded-md w-[100px] text-center text-sm truncate ${formik.values.winnerId === match.team2Id
                                            ? "bg-gray-200 border-gray-500 font-semibold"
                                            : "bg-gray-50 border-gray-300"
                                            }`}
                                    >
                                        {getTeamNames(match.team2?.players)}
                                    </div>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="flex justify-end mt-4">
                                <CustomButton
                                    label="Quay lại"
                                    variant="type-5"
                                    onClick={() => setMode("CHOICE")}
                                    className="mr-3"

                                />
                                <CustomButton label="Lưu kết quả" variant="type-1" type="submit" disabled={formik.values.scoreTeam1 === formik.values.scoreTeam2} />
                            </div>
                        </form>
                    )}
                    {
                        mode === "SCORE_COUNTER" && (
                            <div className="text-gray-700">
                                <div className="flex gap-2 items-center">
                                    <div className="min-h-10 w-1/2 p-2 flex items-center justify-center border-2 border-blue-500 rounded-[.75rem]">
                                        <p className="truncate max-w-[180px]">
                                            {getTeamNames(match.team1?.players)}
                                        </p>
                                    </div>
                                    <div className="font-bold">
                                        vs
                                    </div>
                                    <div className="min-h-10 w-1/2 p-2 flex items-center justify-center border-2 border-red-500 rounded-[.75rem]">
                                        <p className="truncate max-w-[180px]">
                                            {getTeamNames(match.team2?.players)}
                                        </p>
                                    </div>
                                </div>
                                <CustomTextField
                                    name="race_to"
                                    type="number"
                                    label="Race To"
                                    className="mt-4"
                                    value={raceTo}
                                    onChange={(e) => setRaceTo(Number(e.target.value))}
                                    error={raceToHellperText ? true : false}
                                    helperText={raceToHellperText}
                                />

                                <div>
                                    <div className="flex justify-end mt-4">
                                        <CustomButton
                                            label="Quay lại"
                                            variant="type-1"
                                            onClick={() => setMode("CHOICE")}
                                            className="mr-3"

                                        />
                                        <CustomButton
                                            label="Bắt đầu"
                                            variant="type-3"
                                            onClick={handleStartScoreCounter}
                                        />
                                    </div>
                                </div>

                            </div>
                        )
                    }
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const mapStateToProps = (state: any) => ({
    isLoading: state.tournamentDetail.isUpdateMatchLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
    updateMatch: (matchId: string, newMatch: Match, workspaceId: string, roundNumber: 1 | 2 | 3) => dispatch(tournamentDetailActions.updateMatchInTournament(matchId, newMatch, workspaceId, roundNumber)),
    lockScoreCounterByUuid: (matchUuid: string, workspaceId: string, raceTo: number) => dispatch(matchScoreEventActions.lockScoreCounterByUuid(matchUuid, workspaceId, raceTo)),
    // verifyTokenLockCounter: (matchUuid: string, workspaceId: string, token: string) => dispatch(matchScoreEventActions.verifyTokenLockCounter(matchUuid, workspaceId, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(WithLoading(EditMatch));
// export default connect(null, mapDispatchToProps)(WithLoading(EditMatch) );
