export interface Player {
    id: number;
    name: string;
    image: string;
    elo: number;
    prize: number;
    rank?:number;
}

export const players: Player[] = [
    { id: 1, name: "John", image: "/images/avataDefault.png", elo: 2450, prize: 1000 },
    { id: 2, name: "Mike", image: "/images/avataDefult.png", elo: 2380, prize: 400 },
    { id: 3, name: "Lina", image: "/images/avataDefault.png", elo: 2275, prize: 600 },
    { id: 4, name: "Sophia", image: "/images/avatefault.png", elo: 221, prize: 300 },
    { id: 5, name: "Lina2", image: "/images/avataDefault.png", elo: 12, prize: 323 },
    { id: 6, name: "Sophia3", image: "/images/avataDefault.png", elo: 32, prize: 111 },
    { id: 7, name: "Lina4", image: "/images/avataDefault.png", elo: 44, prize: 333 },
    { id: 8, name: "Sophia5", image: "/images/avataDefault.png", elo: 32, prize: 222 },
    { id: 9, name: "Lina6", image: "/images/avataDefault.png", elo: 31, prize: 321 },
    { id: 10, name: "Sophia7", image: "/images/avataDefault.png", elo: 42, prize: 123 },
];