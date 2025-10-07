import type { Player } from "../components/data/rankingData";


export const getSortedPlayers = (players: Player[], mode: "elo" | "prize") => {
    const sorted = [...players].sort((a, b) => {
        if (mode === "elo") return b.elo - a.elo;
        return b.prize - a.prize;
    });

    // thêm rank dựa trên thứ tự sắp xếp
    return sorted.map((p, index) => ({
        rank: index + 1,
        ...p,
    }));
};
