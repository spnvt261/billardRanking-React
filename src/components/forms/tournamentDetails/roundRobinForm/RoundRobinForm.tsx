import { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { TournamentDetail } from "../../../../types/tournament";
import CustomCounter from "../../../customCounter/CustomCounter";
import type { Option } from "../../../customSelect/CustomSelect";
import CustomSelect from "../../../customSelect/CustomSelect";
import CustomButton from "../../../customButtons/CustomButton";
import type { RoundRobinValuesRequest } from "../../../../types/round";
import { connect } from "react-redux";
import tournamentDetailActions from "../../../../redux/features/tournamentDetails/tournamentDetailAction";
import { useWorkspace } from "../../../../customhook/useWorkspace";
import { useNotification } from "../../../../customhook/useNotifycation";

interface Props {
    tournament: TournamentDetail;
    roundNumber: 1 | 2 | 3;
    createRoundRobin: (data: RoundRobinValuesRequest, workspaceId: string,roundNumber:1|2|3) => Promise<void>
    gamePlayed:number;
}



const RoundRobinForm = ({ tournament, roundNumber: roundNumberProps, createRoundRobin,gamePlayed }: Props) => {
    // console.log(roundNumberProps);
    console.log(gamePlayed);
    
    
    const { workspaceId } = useWorkspace();
    const { notify } = useNotification();
    const listTeams = tournament.listTeamByRound[roundNumberProps] || []
    const teamOptions: Option[] = useMemo(
        () =>
            listTeams.map((team) => ({
                label: team.players[0].name,
                value: String(team.players[0].id),
            })),
        [listTeams]
    );

    const formik = useFormik<RoundRobinValuesRequest>({
        initialValues: {
            tournamentId: tournament.id,
            numGroups: 1,
            gameNumberPlayed:gamePlayed,
            roundNumber: roundNumberProps,
            roundPlayersAfter: 1, // ✅ init mặc định là 1 người qua
            groupSelections: [teamOptions.map((t) => String(t.value))],
        },
        validationSchema: Yup.object({
            numGroups: Yup.number()
                .min(1, "Phải có ít nhất 1 bảng")
                .max(Math.floor(listTeams.length / 2))
                .required("Vui lòng chọn số bảng"),
            roundPlayersAfter: Yup.number()
                .min(1, "Phải có ít nhất 1 người qua")
                .max(listTeams.length, "Không thể vượt quá tổng số người chơi")
                .required("Vui lòng nhập số lượng qua"),
            groupSelections: Yup.array()
                .of(Yup.array().of(Yup.string()))
                .test(
                    "enough-players",
                    "Vui lòng xếp tất cả người chơi vào các bảng",
                    (value) => {
                        const assigned = value?.flat() || [];
                        return assigned.length === teamOptions.length;
                    }
                ),
        }),
        onSubmit:async (values) => {
            // console.log("✅ Form submit:", values);
            try {
                if (workspaceId) await createRoundRobin(values, workspaceId,roundNumberProps)
                notify('Tạo lượt trận thành công', 'success')
            } catch (err) {
                notify(`Xảy ra lỗi ${err}`, 'error')
            }
        },
    });

    const { values, setFieldValue } = formik;

    // ✅ Random chia bảng
    const handleRandomGroups = () => {
        const shuffled = [...teamOptions].sort(() => Math.random() - 0.5);
        const newGroups: string[][] = Array.from({ length: values.numGroups }, () => []);
        shuffled.forEach((t, i) => {
            const idx = i % values.numGroups;
            newGroups[idx].push(String(t.value));
        });
        setFieldValue("groupSelections", newGroups);
    };

    // ✅ Khi thay đổi số bảng
    const handleNumGroupsChange = (val: number) => {
        const num = Math.max(1, val);
        setFieldValue("numGroups", num);

        if (num === 1) {
            setFieldValue("groupSelections", [teamOptions.map((t) => String(t.value))]);
            return;
        }

        const current = values.groupSelections || [];
        let newArr = [...current];

        if (num > newArr.length) {
            for (let i = newArr.length; i < num; i++) newArr.push([]);
        } else {
            newArr.length = num;
        }

        setFieldValue("groupSelections", newArr);
    };

    // ✅ Lọc option cho từng bảng (không trùng player)
    const optionsForIndex = (index: number): Option[] => {
        const selectedInOthers = new Set(
            values.groupSelections
                .filter((_, i) => i !== index)
                .flat()
        );
        return teamOptions.filter((opt) => {
            const isSelectedHere = (values.groupSelections[index] || []).includes(opt.value);
            if (selectedInOthers.has(opt.value) && !isSelectedHere) return false;
            return true;
        });
    };

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            {/* Bộ đếm bảng và số lượng qua */}
            <div className="flex flex-wrap gap-4 items-center">
                {/* Số bảng */}
                <div className="bg-gray-100 max-w-[250px] p-2 rounded-[1rem] flex flex-col items-center">
                    <h2 className="font-semibold text-slate-600">BẢNG</h2>
                    <CustomCounter
                        minValue={1}
                        maxValue={Math.floor(listTeams.length / 2)}
                        value={values.numGroups}
                        onChange={handleNumGroupsChange}
                    />
                </div>

                {/* Số lượng qua */}
                <div className="bg-gray-100 max-w-[250px] p-2 rounded-[1rem] flex flex-col items-center">
                    <h2 className="font-semibold text-slate-600">LẤY PLAYER</h2>
                    <CustomCounter
                        minValue={1}
                        maxValue={listTeams.length}
                        value={values.roundPlayersAfter}
                        onChange={(val) => setFieldValue("roundPlayersAfter", val)}
                    />
                    {formik.errors.roundPlayersAfter && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.roundPlayersAfter}</p>
                    )}
                </div>

                {values.numGroups >= 2 && (
                    <div className="flex justify-center h-fit">
                        <CustomButton
                            label="🎲 Random chia bảng"
                            variant="type-3"
                            onClick={handleRandomGroups}
                            className="text-gray-700"
                            type="button"
                        />
                    </div>
                )}
            </div>

            {/* Danh sách bảng */}
            {values.numGroups > 1 && (
                <div className="flex flex-col gap-3 w-full mt-2">
                    {Array.from({ length: values.numGroups }, (_, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
                        >
                            <h3 className="font-medium text-slate-700 mb-2">
                                Bảng {String.fromCharCode(65 + index)}{" "}
                                <span className="text-sm text-gray-400">
                                    ({(values.groupSelections[index] || []).length} player)
                                </span>
                            </h3>

                            <CustomSelect
                                multiple
                                options={optionsForIndex(index)}
                                value={values.groupSelections[index] || []}
                                onChange={(vals) =>
                                    setFieldValue(`groupSelections[${index}]`, vals)
                                }
                                placeholder="Chọn player..."
                                search
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Hiển thị lỗi nếu có */}
            {formik.errors.groupSelections && (
                <p className="text-red-500 text-sm mt-2">
                    {formik.errors.groupSelections as string}
                </p>
            )}

            {/* Nút bắt đầu */}
            <div className="flex justify-start mt-4">
                <CustomButton
                    label={`Bắt đầu ROUND${values.roundNumber}`}
                    variant="type-2"
                    className="text-gray-700"
                    type="submit"
                />
            </div>
            
        </form>
    );
};

// const mapStateToProps = (state: any) => ({
//     isLoading: state.tournamentDetail.isCreateRoundMatchLoading,
// });

const mapDispatchToProps = (dispatch: any) => ({
    createRoundRobin: (data: RoundRobinValuesRequest, workspaceId: string,roundNumber:1|2|3) => dispatch(tournamentDetailActions.createRoundRobin(data, workspaceId,roundNumber)),
});

export default connect(null, mapDispatchToProps)(RoundRobinForm);
