import { useState, type ChangeEvent } from "react";
import CustomButton from "../../customButtons/CustomButton";
import CustomSelect from "../../customSelect/CustomSelect";
import { listplayerSelect } from "../../../data/matchData";
import CustomTextField from "../../customTextField/CustomTextField";

interface Props {
    btnCancel: () => void;
}

const AddMatchForm = ({ btnCancel }: Props) => {
    // console.log('matchform');
    
    const [matchType, setMatchType] = useState<string[]>(["1v1"]); 
    const [newMatch, setNewMatch] = useState<any>({});
    const [team1Players, setTeam1Players] = useState<string[][]>([]); // mảng 2D: [ [player1], [player2], ...]
    const [team2Players, setTeam2Players] = useState<string[][]>([]);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMatch({
            ...newMatch,
            [e.target.name]: e.target.value,
        });
    };

    const handleConfirm = () => {
        const data = {
            ...newMatch,
            matchType: matchType[0],
            team1Players: team1Players.map((p) => p[0]),
            team2Players: team2Players.map((p) => p[0]),
        };
        console.log("Match data:", data);
    };

    const getNumPlayers = () => parseInt(matchType[0]?.split("v")[0] || "1", 10);

    return (
        <form className="flex flex-col">
            {/* --- Match Type Select --- */}
            <div className="flex flex-col">
                <label className="font-semibold mb-2 text-gray-700">Kiểu trận</label>
                <CustomSelect
                    options={[
                        { label: "1v1", value: "1v1" },
                        { label: "2v2", value: "2v2" },
                        { label: "3v3", value: "3v3" },
                        { label: "4v4", value: "4v4" },
                    ]}
                    value={matchType}
                    onChange={setMatchType}
                    placeholder="Chọn kiểu trận"
                />
            </div>

            {/* --- Teams Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Team 1 */}
                <div className="border-2 border-blue-500 rounded-xl p-4">
                    <h4 className="font-bold text-blue-600 mb-3">Đội 1 (Xanh)</h4>
                    {[...Array(getNumPlayers())].map((_, i) => (
                        <div key={`t1-${i}`} className="mb-2">
                            <CustomSelect
                                options={listplayerSelect}
                                value={team1Players[i] || []}
                                onChange={(v) => {
                                    const updated = [...team1Players];
                                    updated[i] = v; 
                                    setTeam1Players(updated);
                                }}
                                placeholder={`Chọn người chơi ${i + 1}`}
                            />
                        </div>
                    ))}
                    <CustomTextField
                        name="score_team1"
                        label="Điểm đội 1"
                        onChange={handleTextChange}
                        className="mb-0"
                    />
                </div>

                {/* Team 2 */}
                <div className="border-2 border-red-500 rounded-xl p-4">
                    <h4 className="font-bold text-red-600 mb-3">Đội 2 (Đỏ)</h4>
                    {[...Array(getNumPlayers())].map((_, i) => (
                        <div key={`t2-${i}`} className="mb-2">
                            <CustomSelect
                                options={listplayerSelect}
                                value={team2Players[i] || []}
                                onChange={(v) => {
                                    const updated = [...team2Players];
                                    updated[i] = v;
                                    setTeam2Players(updated);
                                }}
                                placeholder={`Chọn người chơi ${i + 1}`}
                            />
                        </div>
                    ))}
                    <CustomTextField
                        name="score_team2"
                        label="Điểm đội 2"
                        onChange={handleTextChange}
                        className="mb-0"
                    />
                </div>
            </div>
            <CustomTextField
                label='Ngày*'
                name='date'
                type='date'
                onChange={handleTextChange}
                className="mt-4"
            />
            {/* --- Action Buttons --- */}
            <div className="flex justify-end mt-4">
                <CustomButton
                    label="Hủy"
                    variant="type-4"
                    onClick={btnCancel}
                    className="mr-2"
                />
                <CustomButton
                    label="Lưu"
                    variant="type-2"
                    onClick={handleConfirm}
                    needPermission
                />
            </div>
        </form>
    );
};

export default AddMatchForm;
