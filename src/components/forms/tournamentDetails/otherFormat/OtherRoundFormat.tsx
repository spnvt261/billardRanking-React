import { useState } from "react";
import type { TournamentDetail, TournamentType } from "../../../../types/tournament";
import CustomCounter from "../../../customCounter/CustomCounter";
import CustomButton from "../../../customButtons/CustomButton";
import type { OtherTypeRequest } from "../../../../types/round";
import { connect } from "react-redux";
import tournamentDetailActions from "../../../../redux/features/tournamentDetails/tournamentDetailAction";
import { useWorkspace } from "../../../../customhook/useWorkspace";
import { useNotification } from "../../../../customhook/useNotifycation";

interface Props {
    tournament: TournamentDetail;
    roundType: TournamentType | "";
    roundNumber: 1 | 2 | 3;
    gamePlayed: number;
    createOtherType: (data: OtherTypeRequest, workspaceId: string, roundNumber: 1 | 2 | 3) => Promise<void>
}

const OtherRoundFormat = ({ tournament, roundNumber, roundType, gamePlayed, createOtherType }: Props) => {
    const listTeams = tournament.listTeamByRound[roundNumber] || []
    const [roundPlayersAfter, setRoundPlayersAfter] = useState<number>(1)
    const { workspaceId } = useWorkspace();
    const {notify} = useNotification();
    const getPlayerIds = (listTeams: typeof tournament.listTeamByRound[1]) => {
        return listTeams.map(team => team.players[0].id);
    };
    const handleNumGroupsChange = (val: number) => {
        setRoundPlayersAfter(val)
    };
    const handleSubmit = async () => {
        const listPlayerIds = getPlayerIds(listTeams);
        const valuesRequest: OtherTypeRequest = {
            tournamentId: tournament.id,
            listPlayerIds,
            roundNumber,
            gameNumberPlayed: gamePlayed,
            roundPlayersAfter,
            roundType: roundType,
        }
        try {
            if (workspaceId) await createOtherType(valuesRequest, workspaceId, roundNumber);
            notify('Tạo lượt trận thành công','success')
        } catch (err) {
            notify(`Lỗi ${err}`,'error')
            console.log(err);
            
        }


    }
    return (
        <div>
            <div className="flex items-center mb-4">
                <h2 className="font-semibold text-slate-600 mr-4">SỐ NGƯỜI CHƠI VƯỢT QUA</h2>
                <CustomCounter
                    minValue={1}
                    maxValue={Math.floor(listTeams.length / 2)}
                    value={roundPlayersAfter}
                    onChange={handleNumGroupsChange}
                />
            </div>
            <CustomButton
                label={`Bắt đầu ROUND${roundNumber}`}
                variant="type-5"
                onClick={handleSubmit}
            />
        </div>


    )
}

// const mapStateToProps = (state: any) => ({
//     isLoading: state.tournamentDetail.isCreateRoundMatchLoading,
// });

const mapDispatchToProps = (dispatch: any) => ({
    createOtherType: (data: OtherTypeRequest, workspaceId: string, roundNumber: 1 | 2 | 3) => dispatch(tournamentDetailActions.createOtherType(data, workspaceId, roundNumber)),
});

export default connect(null, mapDispatchToProps)(OtherRoundFormat)