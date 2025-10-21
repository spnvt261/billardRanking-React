import React from "react";

interface Match {
  id: number;
  round: number;
  player1: string;
  player2: string;
  winner: string;
}

const matchHeight = 50;
const matchGap = 20;
const roundGap = 180;

const BracketSVG: React.FC<{ matches: Match[] }> = ({ matches }) => {
  const rounds = [...new Set(matches.map((m) => m.round))];

  return (
    <svg
      width={rounds.length * roundGap + 200}
      height={400}
      style={{ background: "#fafafa" }}
    >
      {rounds.map((r, roundIndex) => {
        const roundMatches = matches.filter((m) => m.round === r);

        return roundMatches.map((match, matchIndex) => {
          const x = roundIndex * roundGap + 50;
          const y = matchIndex * (matchHeight + matchGap) + 30;

          return (
            <g key={match.id}>
              {/* Ô trận */}
              <rect
                x={x}
                y={y}
                width={150}
                height={matchHeight}
                fill="#fff"
                stroke="#ccc"
                rx={6}
              />

              {/* Tên player 1 */}
              <text x={x + 10} y={y + 20} fontSize={12}>
                {match.player1}
              </text>

              {/* Tên player 2 */}
              <text x={x + 10} y={y + 40} fontSize={12}>
                {match.player2}
              </text>

              {/* Đường nối đến vòng sau */}
              {r < rounds.length && (
                <line
                  x1={x + 150}
                  y1={y + matchHeight / 2}
                  x2={x + roundGap}
                  y2={
                    (matchIndex - (matchIndex % 2)) *
                      (matchHeight + matchGap) +
                    (matchHeight + matchGap) / 2 +
                    30
                  }
                  stroke="#999"
                />
              )}
            </g>
          );
        });
      })}
    </svg>
  );
};

export default function Test() {
  const matches = [
    { id: 1, round: 1, player1: "Đức", player2: "Tiến", winner: "Đức" },
    { id: 2, round: 1, player1: "Sơn", player2: "Đạt", winner: "Sơn" },
    { id: 3, round: 1, player1: "Ánh", player2: "Ớt", winner: "Ánh" },
    { id: 4, round: 1, player1: "Long", player2: "Tuấn", winner: "Tuấn" },
    { id: 5, round: 2, player1: "Đức", player2: "Sơn", winner: "Đức" },
    { id: 6, round: 2, player1: "Ánh", player2: "Tuấn", winner: "Ánh" },
    { id: 7, round: 3, player1: "Đức", player2: "Ánh", winner: "Đức" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Giải đấu loại trực tiếp</h2>
      <BracketSVG matches={matches} />
    </div>
  );
}
