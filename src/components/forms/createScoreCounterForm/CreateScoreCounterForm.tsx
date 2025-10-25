import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomButton from "../../customButtons/CustomButton";
import CustomSelect from "../../customSelect/CustomSelect";
import CustomTextField from "../../customTextField/CustomTextField";
import { matchCategoryOptions, matchTypeOptions } from "../../../constants/matchTypes";
import { connect } from "react-redux";
import matchActions from "../../../redux/features/match/matchActions";
import { MatchCategory, MatchStatus, type Match, type MatchesRequest } from "../../../types/match";
import type { PlayerSelect } from "../../../types/player";
import { useWorkspace } from "../../../customhook/useWorkspace";
import playerActions from "../../../redux/features/player/playerActions";
import { formatDateVN } from "../../../ultils/format";
import { useNotification } from "../../../customhook/useNotifycation";
import { useNavigate } from "react-router-dom";
import PATHS from "../../../router/path";
import { LOCAL_STORAGE_TOKEN_LOCK_SCORE_COUNTER } from "../../../constants/localStorage";

interface Props {
    btnCancel: () => void;
    showLoading?: (show: boolean) => void;
    isLoading: boolean;
    createMatch: (data: MatchesRequest) => Promise<Match>;
    listPlayerSelect: PlayerSelect[]
    getListPlayerSelect: (workspaceId: string) => Promise<void>;
}

const validationSchema = Yup.object({
    matchType: Yup.string().required("Vui lòng chọn kiểu trận"),
    team1Players: Yup.array()
        .of(Yup.string().required("Vui lòng chọn người chơi"))
        .min(1, "Cần ít nhất 1 người chơi"),
    team2Players: Yup.array()
        .of(Yup.string().required("Vui lòng chọn người chơi"))
        .min(1, "Cần ít nhất 1 người chơi"),
    score_team1: Yup.number()
        .typeError("Điểm phải là số")
        .min(0, "Điểm không được âm")
        .required("Vui lòng nhập điểm đội 1"),
    score_team2: Yup.number()
        .typeError("Điểm phải là số")
        .min(0, "Điểm không được âm")
        .required("Vui lòng nhập điểm đội 2"),
    race_to: Yup.number()
        .typeError("Điểm phải là số")
        .min(0, "Điểm không được âm")
        .required("Chạm mấy ??"),
});

const CreateScoreCounterForm = ({ btnCancel, showLoading, isLoading, createMatch, listPlayerSelect, getListPlayerSelect }: Props) => {
    const [matchType, setMatchType] = useState<string[]>(["1v1"]);
    const { notify } = useNotification();
    const { workspaceId } = useWorkspace();
    const getNumPlayers = () => parseInt(matchType[0]?.split("v")[0] || "1", 10);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            matchType: matchType[0],
            matchCategory: matchCategoryOptions[0].value as MatchCategory,
            team1Players: Array(getNumPlayers()).fill(""),
            team2Players: Array(getNumPlayers()).fill(""),
            race_to: 0,
            score_team1: 0,
            score_team2: 0,
            date: "",
            betAmount: 0,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const dataRequest: MatchesRequest = {
                    workspaceId: workspaceId ? Number(workspaceId) : 0,
                    team1Players: values.team1Players,
                    team2Players: values.team2Players,
                    matchCategory: values.matchCategory,
                    matchDate: values.date ? values.date : formatDateVN(new Date()),
                    scoreTeam1: Number(values.score_team1),
                    scoreTeam2: Number(values.score_team2),
                    raceTo:values.race_to,
                    betAmount: values.betAmount,
                    status: MatchStatus.ONGOING,
                    // note:"",
                    // matchType:,
                    // team1Id:,
                    // team2Id:,
                    // tournamentId:,
                    // winnerId:,
                };
                const matchResponse = await createMatch(dataRequest)
                if(matchResponse.scoreCounterLockToken) localStorage.setItem(LOCAL_STORAGE_TOKEN_LOCK_SCORE_COUNTER,matchResponse.scoreCounterLockToken)
                navigate(`${PATHS.SCORE_COUNTER}/${matchResponse.uuid}`, {
                    state: {
                        match: matchResponse,
                        raceTo: values.race_to
                    }
                });

            } catch (err) {
                notify(`Thêm trận thất bại ${err}`, 'success')
                console.log(err);

            }
        },

    });

    useEffect(() => {
        if (showLoading) showLoading(isLoading);
    }, [isLoading]);

    useEffect(() => {
        if (listPlayerSelect.length == 0 && workspaceId) {
            getListPlayerSelect(workspaceId)
        }
    }, [])
    const selectedPlayers = [
        ...formik.values.team1Players,
        ...formik.values.team2Players,
    ].filter(Boolean);
    return (
        <>
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
                <div className="flex flex-col">
                    <div className="flex">
                        <CustomSelect
                            options={matchTypeOptions}
                            className="mb-2 w-[100px]"
                            value={matchType}
                            onChange={(v) => {
                                setMatchType(v);
                                formik.setFieldValue("matchType", v[0]);
                                formik.setFieldValue("team1Players", Array(parseInt(v[0].split("v")[0])).fill(""));
                                formik.setFieldValue("team2Players", Array(parseInt(v[0].split("v")[0])).fill(""));
                            }}
                        />
                        <CustomSelect
                            options={matchCategoryOptions}
                            className="mb-2 ml-4"
                            value={[formik.values.matchCategory]}
                            onChange={(v) => {
                                formik.setFieldValue("matchCategory", v[0]);
                            }}
                        />
                    </div>
                    {
                        formik.values.matchCategory === MatchCategory.BETTING && (
                            <CustomTextField
                                name="betAmount"
                                label="Số tiền"
                                type="money"
                                className="mt-2"
                                // value={formik.values.betAmount}
                                onChange={(e) => formik.setFieldValue("betAmount", e.target.value)}
                            />
                        )
                    }
                </div>


                {/* --- Teams Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team 1 */}
                    <div className="border-2 border-blue-400 rounded-xl p-4">
                        {/* <h4 className="font-bold text-blue-600 mb-2">Đội 1</h4> */}
                        {formik.values.team1Players.map((_, i) => (
                            <div key={`t1-${i}`} className="mb-4">
                                <CustomSelect
                                    options={listPlayerSelect.filter(
                                        (opt) =>
                                            !selectedPlayers.includes(opt.value) ||
                                            formik.values.team1Players[i] === opt.value
                                    )}
                                    value={formik.values.team1Players[i] ? [formik.values.team1Players[i]] : []}
                                    onChange={(v) => {
                                        const updated = [...formik.values.team1Players];
                                        updated[i] = v[0];
                                        formik.setFieldValue("team1Players", updated);
                                    }}
                                    placeholder={`Chọn người chơi ${i + 1}`}
                                    search
                                />
                            </div>
                        ))}
                        {formik.touched.team1Players && formik.errors.team1Players && (
                            <p className="text-red-300 text-sm">
                                {(formik.errors.team1Players as string) || ""}
                            </p>
                        )}
                    </div>

                    {/* Team 2 */}
                    <div className="border-2 border-red-500 rounded-xl p-4">
                        {/* <h4 className="font-bold text-red-600 mb-4">Đội 2</h4> */}
                        {formik.values.team2Players.map((_, i) => (
                            <div key={`t2-${i}`} className="mb-2">
                                <CustomSelect
                                    options={listPlayerSelect.filter(
                                        (opt) =>
                                            !selectedPlayers.includes(opt.value) ||
                                            formik.values.team2Players[i] === opt.value
                                    )}
                                    value={formik.values.team2Players[i] ? [formik.values.team2Players[i]] : []}
                                    onChange={(v) => {
                                        const updated = [...formik.values.team2Players];
                                        updated[i] = v[0];
                                        formik.setFieldValue("team2Players", updated);
                                    }}
                                    placeholder={`Chọn người chơi ${i + 1}`}
                                    search
                                />

                            </div>
                        ))}
                        {formik.touched.team2Players && formik.errors.team2Players && (
                            <p className="text-red-500 text-sm">
                                {(formik.errors.team2Players as string) || ""}
                            </p>
                        )}
                    </div>
                </div>
                <CustomTextField
                    name="race_to"
                    label="Race To"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.race_to}
                    className="mb-2"
                />
                {formik.touched.race_to && formik.errors.race_to && (
                    <p className="text-red-500 text-sm">{formik.errors.race_to}</p>
                )}

                <CustomTextField
                    label="Ngày*"
                    name="date"
                    type="date"
                    onChange={formik.handleChange}
                    value={formik.values.date}
                    className="mt-4"
                />
                {formik.touched.date && formik.errors.date && (
                    <p className="text-red-500 text-sm">{formik.errors.date}</p>
                )}

                <div className="flex justify-end mt-4">
                    <CustomButton
                        label="Hủy"
                        variant="type-4"
                        onClick={btnCancel}
                        className="mr-2"
                    />
                    <CustomButton
                        label="Bắt đầu"
                        variant="type-3"
                        type="submit"
                        // needPermission
                    />
                </div>

            </form>
        </>

    );
};

const mapStateToProps = (state: any) => ({
    isLoading: state.matches.isLoading,
    listPlayerSelect: state.players.listPlayerSelect,
});

const mapDispatchToProps = (dispatch: any) => ({
    createMatch: (data: MatchesRequest) => dispatch(matchActions.createScoreCounterMatch(data)),
    getListPlayerSelect: (workspaceId: string) => dispatch(playerActions.getListPlayerSelect(workspaceId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateScoreCounterForm);
