import { tournamentTypeOptions } from "../../../../constants/tournamentTypes";
import {
    TournamentRoundStatus,
    type TournamentDetail,
    type TournamentType,
} from "../../../../types/tournament";
import { tournamentStatusMap } from "../../../../ultils/mapEnum";
import RoundRobinForm from "../../../forms/tournamentDetails/roundRobinForm/RoundRobinForm";

interface Props {
    title: string;
    tournament: TournamentDetail;
    roundNumber: 1 | 2 | 3;
}

const TournamentMatchInRound = ({ title, roundNumber, tournament }: Props) => {
    // console.log(tournament);
    let roundType: TournamentType | "" = "";
    let roundStatus: TournamentRoundStatus | "" = "";

    if (roundNumber === 1) {
        roundType = tournament.tournamentType;
        roundStatus = tournament.round1Status;
    } else if (roundNumber === 2) {
        roundType = tournament.tournamentType2 || "";
        roundStatus = tournament.round2Status;
    } else if (roundNumber === 3) {
        roundType = tournament.tournamentType3 || "";
        roundStatus = tournament.round3Status;
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
        <div className="w-full bg-white rounded-[1rem] min-h-[1000px] overflow-hidden"
        >
            <div className="flex items-center w-full p-4"
                style={{ background: 'linear-gradient(to bottom , #374151, #6b7280)' }}
            >
                <h1 className="text-white font-bold">
                    {title.toUpperCase()} - {roundTypeLabel.toUpperCase()}
                </h1>
                <span
                    className={`border-2 font-bold bg-transparent text-[0.8rem] px-2 rounded-[1rem] bg-white ml-2 ${statusInfo.className}`}
                >
                    {statusInfo.label.toUpperCase()}
                </span>
            </div>
            <div className="p-4 flex flex-col gap-4">
                <div className="w-full">
                    <h2>Người chơi ({tournament.listTeam.length})</h2>
                    <div className="grid grid-flow-col grid-rows-2 auto-cols-max gap-2 w-full max-h-[220px] overflow-x-auto px-2 [@media(min-width:512px)]:grid-rows-1">
                        {tournament.listTeam.map((team) => {
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
                    <RoundRobinForm
                        tournament={tournament}
                        roundNumber={roundNumber}
                    />
                </div>
            </div>
        </div>
    );
};

export default TournamentMatchInRound;
