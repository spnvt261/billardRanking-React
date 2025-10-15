

export interface iTournament {
  id: number;
  name: string;
  banner?: string;
  prize?: number;
  start_date: string;
  end_date?: string;
  location?: string;
  attened: number;
  status: 'paused' | 'finished' | 'ongoing';
  winnerName?: string;
  tournament_type: 'Đền' | '9-ball' | 'Snooker' | 'Other';
}

export const tournaments: iTournament[] = [
  {
    id: 1,
    name: 'Hanoi Open 2025',
    banner: 'images/defaultBannerTournament2.jpg',
    prize: 5000000,
    start_date: '2025-10-10T08:00:00Z',
    end_date: '2025-10-12T18:00:00Z',
    location: 'Hanoi',
    attened: 32,
    status: 'finished',
    winnerName: 'Sơn',
    tournament_type: 'Đền',
  },
  {
    id: 2,
    name: 'Saigon Pool Masters',
    banner: 'images/defaultBannerTournament3.jpg',
    // prize: 7000000,
    start_date: '2025-10-15T09:00:00Z',
    end_date: '2025-10-17T20:00:00Z',
    location: 'Ho Chi Minh City',
    attened: 24,
    status: 'ongoing',
    tournament_type: '9-ball',
  },
  {
    id: 3,
    name: 'Danang Snooker Championship',
    prize: 10000000,
    start_date: '2025-10-20T10:00:00Z',
    end_date: '2025-10-22T18:00:00Z',
    location: 'Danang',
    attened: 16,
    status: 'paused',
    tournament_type: 'Snooker',
  },
  {
    id: 4,
    name: 'Hue Pool Open',
    banner: 'images/banner4.jpg',
    prize: 3000000,
    start_date: '2025-11-01T08:00:00Z',
    location: 'Hue',
    attened: 20,
    status: 'upcoming' as any, // giả sử nếu muốn thêm trạng thái khác
    tournament_type: 'Đền',
  },
  {
    id: 5,
    name: 'Vinh City Tournament',
    start_date: '2025-11-05T09:00:00Z',
    end_date: '2025-11-07T17:00:00Z',
    location: 'Vinh',
    attened: 12,
    status: 'ongoing',
    winnerName: undefined,
    tournament_type: '9-ball',
  },
  {
    id: 6,
    name: 'Can Tho Masters',
    banner: 'images/banner6.jpg',
    prize: 8000000,
    start_date: '2025-11-10T08:30:00Z',
    end_date: '2025-11-12T18:00:00Z',
    location: 'Can Tho',
    attened: 28,
    status: 'finished',
    winnerName: 'Minh',
    tournament_type: 'Snooker',
  },
  {
    id: 7,
    name: 'Nha Trang Pool Challenge',
    start_date: '2025-11-15T09:00:00Z',
    location: 'Nha Trang',
    attened: 18,
    status: 'paused',
    tournament_type: 'Đền',
  },
  {
    id: 8,
    name: 'Hai Phong Championship',
    banner: 'images/banner8.jpg',
    prize: 6000000,
    start_date: '2025-11-20T08:00:00Z',
    end_date: '2025-11-22T18:00:00Z',
    location: 'Hai Phong',
    attened: 22,
    status: 'finished',
    winnerName: 'Lan',
    tournament_type: '9-ball',
  },
  {
    id: 9,
    name: 'Quang Ninh Open',
    start_date: '2025-11-25T09:00:00Z',
    location: 'Quang Ninh',
    attened: 14,
    status: 'ongoing',
    tournament_type: 'Snooker',
  },
  {
    id: 10,
    name: 'Binh Duong Pool Fest',
    banner: 'images/banner10.jpg',
    prize: 4000000,
    start_date: '2025-12-01T08:00:00Z',
    location: 'Binh Duong',
    attened: 20,
    status: 'paused',
    tournament_type: 'Other',
  }
];

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

export const listTypeTournament = [
  {
    value:'Vòng tròn',
    label:'Robin'
  },
  {
    value:'Loại trực tiếp',
    label:'loại trực tiếp'
  },
  {
    value:'Nhánh thắng/Thua',
    label:'Thánh thắng/thua'
  },
  {
    value:'Custom',
    label:'custom'
  },
]