import { useOutletContext } from "react-router-dom";
import type {TournamentDetail } from "../../../types/tournament";
import { GoTrophy } from "react-icons/go";
import { formatFullVND } from "../../../ultils/format";
type ContextType = {
    tournament: TournamentDetail;
};
const TournamentOverview = () => {
    // console.log('Overview');
    
    const { tournament } = useOutletContext<ContextType>();
    // console.log(tournament);
    
    if (!tournament) {
        return <div className="text-gray-500">Không tìm thấy giải đấu.</div>;
    }
    const defaultBanners = [
        "/images/defaultBannerTournament2.jpg",
        "/images/defaultBannerTournament3.jpg"
    ];
    const bannerSrc = tournament.banner || defaultBanners[Math.floor(Math.random() * defaultBanners.length)];
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="w-full max-h-[300px] overflow-hidden flex items-center justyfy center">
                {tournament.banner ? <img src={tournament.banner} className="w-full" /> : <img src={bannerSrc} className="w-full" />}
            </div>
            <div className="p-4">
                <h1 className="flex items-center text-2xl font-semibold mb-2 text-gray-800">
                    {tournament.name}  <span className="flex items-center justyfy-center ml-2 text-yellow-500"><GoTrophy size={26} /></span> 
                </h1>
                <p className="text-gray-600 mb-4">{tournament.description || "Không có mô tả."}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                    <p>
                        <span className="font-semibold">Loại giải đấu:</span> {tournament.tournamentType}
                    </p>
                    <p>
                        <span className="font-semibold">Ngày bắt đầu:</span> {tournament.startDate}
                    </p>
                    <p>
                        <span className="font-semibold">Ngày kết thúc:</span> {tournament.endDate || "TBA"}
                    </p>
                    <p>
                        <span className="font-semibold">Tổng giải thưởng:</span> {formatFullVND(tournament.prize)}
                    </p>
                    <p>
                        <span className="font-semibold">Địa điểm:</span> {tournament.location || "Chưa xác định"}
                    </p>
                    <p>
                        <span className="font-semibold">Trạng thái:</span> {tournament.status}
                    </p>
                </div>
            </div>

        </div>
    );
};

export default TournamentOverview;
