import { connect } from "react-redux";
import { tournamentTypeOptions } from "../../../../constants/tournamentTypes";
import {
    TournamentRoundStatus,
    TournamentType,
    type TournamentDetail,
} from "../../../../types/tournament";
import { tournamentStatusMap } from "../../../../ultils/mapEnum";
import RoundRobinForm from "../../../forms/tournamentDetails/roundRobinForm/RoundRobinForm";
import MatchTable from "./matchTable/MacthTable";
import { useEffect, useState } from "react";
import WithLoading from "../../../loading/WithLoading";
import { useWorkspace } from "../../../../customhook/useWorkspace";
import { MatchStatus, type Match } from "../../../../types/match";
import { FaAngleDown } from "react-icons/fa6";
import tournamentActions from "../../../../redux/features/tournament/tournamentActions";
import { useNotification } from "../../../../customhook/useNotifycation";
import RoundRobinRankings from "./roundRobinRankings/RoundRobinRankings";
import OtherRoundFormat from "../../../forms/tournamentDetails/otherFormat/OtherRoundFormat";
import EndRoundForm from "./endRound/EndRoundForm";

interface Props {
    title: string;
    tournament: TournamentDetail;
    roundNumber: 1 | 2 | 3;
    isLoadingByRound: { [key: number]: boolean };
    matchesByRound: { [key: number]: Match[] };
    updateTournamentRoundStatus: (tournamentId: string, roundNumber: 1 | 2 | 3, roundStatus: TournamentRoundStatus, workspaceId: string,listId:number[]) => Promise<void>
    showLoading?: (isLoading: boolean) => void
}

const TournamentMatchInRound = ({
    title, roundNumber, tournament, matchesByRound,
    showLoading, updateTournamentRoundStatus,
    isLoadingByRound
}: Props) => {

    const { workspaceId } = useWorkspace();
    const { notify } = useNotification()
    const [showRoundRobinRankings, setShowRoundRobinRankings] = useState<boolean>(false)
    const [showEndRound, setShowEndRound] = useState<boolean>(false)

    const roundType: TournamentType | "" =
        roundNumber === 1 ? tournament.tournamentType :
            roundNumber === 2 ? tournament.tournamentType2 || "" :
                tournament.tournamentType3 || "";

    const roundStatus: TournamentRoundStatus | "" =
        roundNumber === 1 ? tournament.round1Status :
            roundNumber === 2 ? tournament.round2Status :
                tournament.round3Status;
    const roundPlayersAfter: number | undefined =
        roundNumber === 1 ? tournament.round1PlayersAfter :
            roundNumber === 2 ? tournament.round2PlayersAfter :
                roundNumber === 3 ? 1 : 1;

    const isLoading = isLoadingByRound[roundNumber] || false;

    const listMatches = matchesByRound[roundNumber] || [];

    const gamePlayed = ([1, 2, 3] as const)
        .map(round => matchesByRound[round]?.length || 0)
        .reduce((acc, curr) => acc + curr, 0);

    const listTeams = tournament.listTeamByRound[roundNumber] || [];
    const [isCollapsed, setIsCollapsed] = useState(roundStatus !== TournamentRoundStatus.UPCOMING && roundStatus !== TournamentRoundStatus.ONGOING);
    useEffect(() => {
        if (showLoading) showLoading(isLoading);
    }, [isLoading])

    useEffect(() => {
        if (
            listMatches.length > 0 &&
            listMatches.every((match) => match.status === MatchStatus.FINISHED || match.status === MatchStatus.NOT_STARTED) &&
            roundStatus !== TournamentRoundStatus.FINISHED &&
            workspaceId
        ) {
            setShowEndRound(true);
        }
    }, [listMatches])
    const handleEndRound = async (listIds:number[]) => {
        if (workspaceId) {
            // ✅ 1. Cập nhật vòng hiện tại = FINISHED
            await updateTournamentRoundStatus(
                tournament.id.toString(),
                roundNumber,
                TournamentRoundStatus.FINISHED,
                workspaceId,
                listIds
            )
                .then(() => {
                    if (roundNumber === 1 && tournament.tournamentType2) {
                        // Có vòng 2
                        updateTournamentRoundStatus(
                            tournament.id.toString(),
                            2,
                            TournamentRoundStatus.UPCOMING,
                            workspaceId,
                            listIds
                        ).catch((err) => {
                            notify(`Lỗi khi cập nhật vòng 2: ${err}`, 'error');
                        });
                    } else if (roundNumber === 2 && tournament.tournamentType3) {
                        // Có vòng 3
                        updateTournamentRoundStatus(
                            tournament.id.toString(),
                            3,
                            TournamentRoundStatus.UPCOMING,
                            workspaceId,
                            listIds
                        ).catch((err) => {
                            notify(`Lỗi khi cập nhật vòng 3: ${err}`, 'error');
                        });
                    }
                })
                .catch((err) => {
                    notify(`Lỗi khi cập nhật vòng ${roundNumber}: ${err}`, 'error');
                });
        }
    }
    const statusInfo =
        (roundStatus && tournamentStatusMap[roundStatus]) || {
            label: "Không xác định",
            className: "border-gray-400 text-gray-400",
        };

    const roundTypeLabel =
        tournamentTypeOptions.find((opt) => opt.value === roundType)?.label ||
        "Không xác định";

    return (
        <div className="w-full bg-white rounded-[1rem] border border-gray-400  overflow-hidden mb-4">
            <div
                className="tournament-matches-header relative flex items-center w-full px-4 pb-2 pt-6"
                style={{ background: 'linear-gradient(to bottom , #374151, #6b7280)' }}
                onClick={() => setIsCollapsed(prev => !prev)}
            >
                <h1 className="text-white font-bold">
                    {title.toUpperCase()} - {roundTypeLabel.toUpperCase()}
                </h1>
                <span
                    className={`absolute top-1 -left-0 border font-bold bg-transparent text-[0.7rem] px-2 rounded-[1rem] bg-white ml-2 ${statusInfo.className}`}
                    // style={{}}
                >
                    {statusInfo.label.toUpperCase()}
                </span>
                <span
                    className={`absolute top-0 right-[1rem] h-full flex items-center text-white ml-2 text-lg transition-transform duration-300 ${isCollapsed ? "rotate-0" : "rotate-180"
                        }`}
                >
                    <FaAngleDown size={24} />
                </span>
            </div>
            <div
                className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                style={{ maxHeight: isCollapsed ? 0 : "1000px" }}
            >
                {/* SETUP: chỉ hiện khi UPCOMING */}
                {roundStatus === "UPCOMING" && (
                    <div className="setup p-4 flex flex-col gap-4">
                        <div className=" w-full">
                            <h2>Người chơi ({listTeams.length})</h2>
                            <div className="grid grid-flow-col grid-rows-2 auto-cols-max gap-2 w-full max-h-[220px] overflow-x-auto px-2 [@media(min-width:512px)]:grid-rows-1">
                                {listTeams.map((team) => {
                                    const player = team.players[0];
                                    if (!player) return null;

                                    return (
                                        <div
                                            key={team.id}
                                            className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg shadow-sm min-w-[150px]"
                                        >
                                            {player.avatarUrl ? (
                                                <img
                                                    src={player.avatarUrl}
                                                    alt={player.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-sm text-gray-600">
                                                        {player.name[0].toUpperCase()}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex flex-col max-w-[75px]">
                                                <span className="font-semibold text-slate-600 truncate">{player.name}</span>
                                                {player.nickname && (
                                                    <span className="text-sm text-gray-500 truncate">@{player.nickname}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex-1">
                            {
                                roundType === TournamentType.ROUND_ROBIN && <RoundRobinForm gamePlayed={gamePlayed} tournament={tournament} roundNumber={roundNumber} />
                            }
                            {
                                roundType !== TournamentType.ROUND_ROBIN && roundType !== TournamentType.CUSTOM &&
                                <OtherRoundFormat
                                    gamePlayed={gamePlayed}
                                    roundNumber={roundNumber}
                                    roundType={roundType}
                                    tournament={tournament}
                                />
                            }
                        </div>
                    </div>
                )}
                {
                    (roundStatus === TournamentRoundStatus.ONGOING || roundStatus === TournamentRoundStatus.FINISHED) && roundType === TournamentType.ROUND_ROBIN &&
                    <div className="w-full bg-gray-600 flex item-center justify-start overflow-x-auto">
                        {/* <button onClick={()=>setShowRoundRobinRankings(!showRoundRobinRankings)}>show/hide</button> */}
                        <div className={`p-2 pl-6 pr-6 cursor-pointer hover:bg-gray-800 ${!showRoundRobinRankings ? 'bg-gray-700' : ''}`}
                            onClick={() => setShowRoundRobinRankings(false)}
                        >
                            <p className="text-white">TRẬN ĐẤU</p>
                        </div>
                        <div className={`p-2 pl-6 pr-6 cursor-pointer hover:bg-gray-800 ${showRoundRobinRankings ? 'bg-gray-700' : ''}`}
                            onClick={() => setShowRoundRobinRankings(true)}
                        >
                            <p className="text-white ">BẢNG XẾP HẠNG</p>
                        </div>
                    </div>
                }

                {/* MATCHES CONTENT: chỉ hiện khi ONGOING hoặc FINISHED */}
                {
                    (showRoundRobinRankings) &&
                    <RoundRobinRankings
                        roundNumber={roundNumber}
                        tournamentId={tournament.id.toString()}
                        workspaceId={workspaceId}
                    />
                }
                {(roundStatus === TournamentRoundStatus.ONGOING || roundStatus === TournamentRoundStatus.FINISHED) && !showRoundRobinRankings && (
                    <div className="matches-content">
                        <MatchTable 
                            tournamentId={tournament.id.toString()}
                            roundNumber={roundNumber}
                        />
                    </div>
                )}
                {
                    showEndRound &&
                    <EndRoundForm
                        roundType={roundType}
                        roundNumber={roundNumber}
                        tournament={tournament}
                        workspaceId={workspaceId}
                        handleEndRound={handleEndRound}
                        roundPlayersAfter={roundPlayersAfter}
                    />
                }
            </div>

        </div>

    );
};

const mapStateToProps = (state: any) => ({
    isLoadingByRound: state.tournamentDetail.isLoadingByRound,
    matchesByRound: state.tournamentDetail.matchesByRound,
});

const mapDispatchToProps = (dispatch: any) => ({
    updateTournamentRoundStatus: (tournamentId: string, roundNumber: 1 | 2 | 3, roundStatus: TournamentRoundStatus, workspaceId: string,listId:number[]) => dispatch(tournamentActions.updateTournamentRoundStatus(tournamentId, roundNumber, roundStatus, workspaceId,listId))
});

export default connect(mapStateToProps, mapDispatchToProps)(WithLoading(TournamentMatchInRound));
