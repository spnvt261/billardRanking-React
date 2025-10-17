// 🧩 Interface mô tả cấu trúc 1 trận đấu (match)
interface Player {
  id: number
  name: string
}

export interface Team {
  id: number
  name: string
  players: Player[]
}

export interface Match {
  match_id: number
  tournament_id: number | null
  tournament_name: string | null
  match_type: 'GROUP' | 'SEMIFINAL' | 'FINAL' | 'FREESTYLE'
  match_date: string
  score_team1: number
  score_team2: number
  team1: Team
  team2: Team
  winner_side: 'team1' | 'team2' | null
}

// 🏆 Mock data (ví dụ cho MatchesPage)
export const listMatches: Match[] = [
  {
    match_id: 1,
    tournament_id: 1,
    tournament_name: 'Bàn nước',
    match_type: 'FREESTYLE',
    match_date: '2025-10-05T20:30:00Z',
    score_team1: 7,
    score_team2: 5,
    team1: {
      id: 3,
      name: 'Sơn & Tiến',
      players: [
        { id: 10, name: 'Sơn' },
        { id: 11, name: 'Tiến' },
      ],
    },
    team2: {
      id: 4,
      name: 'Hưng & Nam',
      players: [
        { id: 12, name: 'Hưng' },
        { id: 13, name: 'Nam' },
      ],
    },
    winner_side: 'team1',
  },
  {
    match_id: 2,
    tournament_id: 1,
    tournament_name: 'Bàn nước',
    match_type: 'FREESTYLE',
    match_date: '2025-10-06T19:00:00Z',
    score_team1: 4,
    score_team2: 6,
    team1: {
      id: 5,
      name: 'Phúc & Duy',
      players: [
        { id: 14, name: 'Phúc' },
        { id: 15, name: 'Duy' },
      ],
    },
    team2: {
      id: 6,
      name: 'Long & Quang',
      players: [
        { id: 16, name: 'Long' },
        { id: 17, name: 'Quang' },
      ],
    },
    winner_side: 'team2',
  },
  {
    match_id: 3,
    tournament_id: 5,
    tournament_name: 'Spring Cup 2025',
    match_type: 'SEMIFINAL',
    match_date: '2025-09-25T18:30:00Z',
    score_team1: 8,
    score_team2: 3,
    team1: {
      id: 7,
      name: 'Lâm & Đạt',
      players: [
        { id: 18, name: 'Lâm' },
        { id: 19, name: 'Đạt' },
      ],
    },
    team2: {
      id: 8,
      name: 'Thắng & Khoa',
      players: [
        { id: 20, name: 'Thắng' },
        { id: 21, name: 'Khoa' },
      ],
    },
    winner_side: 'team1',
  },
  {
    match_id: 4,
    tournament_id: 1,
    tournament_name: 'Bàn nước',
    match_type: 'FREESTYLE',
    match_date: '2025-10-07T21:00:00Z',
    score_team1: 2,
    score_team2: 7,
    team1: {
      id: 9,
      name: 'Hải & Tuấn',
      players: [
        { id: 22, name: 'Hải' },
        { id: 23, name: 'Tuấn' },
      ],
    },
    team2: {
      id: 10,
      name: 'Phú & Kiệt',
      players: [
        { id: 24, name: 'Phú' },
        { id: 25, name: 'Kiệt' },
      ],
    },
    winner_side: 'team2',
  },
  {
    match_id: 5,
    tournament_id: 6,
    tournament_name: 'Hanoi Open 2025',
    match_type: 'FINAL',
    match_date: '2025-08-12T20:00:00Z',
    score_team1: 9,
    score_team2: 8,
    team1: {
      id: 11,
      name: 'Minh & Bảo',
      players: [
        { id: 26, name: 'Minh' },
        { id: 27, name: 'Bảo' },
      ],
    },
    team2: {
      id: 12,
      name: 'Phước & Tài',
      players: [
        { id: 28, name: 'Phước' },
        { id: 29, name: 'Tài' },
      ],
    },
    winner_side: 'team1',
  },
  {
    match_id: 6,
    tournament_id: 1,
    tournament_name: 'Bàn nước',
    match_type: 'FREESTYLE',
    match_date: '2025-10-08T18:00:00Z',
    score_team1: 5,
    score_team2: 5,
    team1: {
      id: 13,
      name: 'Hiếu & Cường',
      players: [
        { id: 30, name: 'Hiếu' },
        { id: 31, name: 'Cường' },
      ],
    },
    team2: {
      id: 14,
      name: 'Trí & Tâm',
      players: [
        { id: 32, name: 'Trí' },
        { id: 33, name: 'Tâm' },
      ],
    },
    winner_side: null,
  },
  {
    match_id: 7,
    tournament_id: 7,
    tournament_name: 'Autumn League',
    match_type: 'GROUP',
    match_date: '2025-09-15T19:30:00Z',
    score_team1: 6,
    score_team2: 4,
    team1: {
      id: 15,
      name: 'Khánh & Đức',
      players: [
        { id: 34, name: 'Khánh' },
        { id: 35, name: 'Đức' },
      ],
    },
    team2: {
      id: 16,
      name: 'Bình & Nam',
      players: [
        { id: 36, name: 'Bình' },
        { id: 37, name: 'Nam' },
      ],
    },
    winner_side: 'team1',
  },
  {
    match_id: 8,
    tournament_id: 1,
    tournament_name: 'Bàn nước',
    match_type: 'FREESTYLE',
    match_date: '2025-10-09T22:15:00Z',
    score_team1: 8,
    score_team2: 9,
    team1: {
      id: 17,
      name: 'Dũng & Lợi',
      players: [
        { id: 38, name: 'Dũng' },
        { id: 39, name: 'Lợi' },
      ],
    },
    team2: {
      id: 18,
      name: 'Tú & Quân',
      players: [
        { id: 40, name: 'Tú' },
        { id: 41, name: 'Quân' },
      ],
    },
    winner_side: 'team2',
  },
  {
    match_id: 9,
    tournament_id: 8,
    tournament_name: 'Friendly League 2025',
    match_type: 'SEMIFINAL',
    match_date: '2025-07-25T20:00:00Z',
    score_team1: 5,
    score_team2: 3,
    team1: {
      id: 19,
      name: 'An & Khang',
      players: [
        { id: 42, name: 'An' },
        { id: 43, name: 'Khang' },
      ],
    },
    team2: {
      id: 20,
      name: 'Hoàng & Lộc',
      players: [
        { id: 44, name: 'Hoàng' },
        { id: 45, name: 'Lộc' },
      ],
    },
    winner_side: 'team1',
  },
  {
    match_id: 10,
    tournament_id: 1,
    tournament_name: 'Bàn nước',
    match_type: 'FREESTYLE',
    match_date: '2025-10-10T20:45:00Z',
    score_team1: 6,
    score_team2: 7,
    team1: {
      id: 21,
      name: 'Tài & Việt',
      players: [
        { id: 46, name: 'Tài' },
        { id: 47, name: 'Việt' },
      ],
    },
    team2: {
      id: 22,
      name: 'Vũ & Phát',
      players: [
        { id: 48, name: 'Vũ' },
        { id: 49, name: 'Phát' },
      ],
    },
    winner_side: 'team2',
  }
]


export const listplayerSelect = [
  {
    value:1,
    label:'Sơn'
  },
  {
    value:2,
    label:'Tien'
  },
  {
    value:3,
    label:'Dat'
  },
  {
    value:4,
    label:'Duc'
  },
  {
    value:5,
    label:'ABC'
  },
  {
    value:6,
    label:'AQAQ'
  },
  {
    value:7,
    label:'WWWW'
  },
  {
    value:8,
    label:'XXXX'
  },
]