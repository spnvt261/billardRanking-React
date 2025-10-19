import type { Player } from "../../../../types/player";

interface Props {
  player: Player | null;
}

const PlayerCard = ({ player }: Props) => {
  if (!player) {
    return (
      <div className="relative flex items-center justify-center bg-gray-100 rounded-lg shadow-md p-6 w-72 h-40">
        <span className="text-gray-500 font-medium">No player data available</span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center bg-gray-100 rounded-lg shadow-md p-2 w-80 h-[8rem] 
                    transition-transform duration-200 transform hover:-translate-y-1 hover:shadow-lg 
                    active:scale-95 cursor-pointer">
      
      {/* Seed góc trên phải */}
      <div className="absolute top-2 right-2 bg-yellow-400 text-gray-800 font-bold px-2 py-1 rounded-full text-sm shadow-md">
        Seed: {player.rank}
      </div>

      {/* Ảnh Player */}
      <div className="flex-shrink-0 rounded-lg bg-gray-300 w-24 h-24 overflow-hidden">
        <img
          src={player.avatarUrl || "/images/avataDefault.png"}
          alt={player.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thông tin Player */}
      <div className="ml-4 flex flex-col justify-center h-full">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {player.nickname ? `${player.nickname} (${player.name})` : player.name}
          </h2>

          {/* Elo ở giữa */}
          <p className="text-gray-700 font-medium mt-2">
            Elo: {player.elo}
          </p>

          {player.description && (
            <p className="text-gray-600 mt-1 text-sm line-clamp-2">
              {player.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
