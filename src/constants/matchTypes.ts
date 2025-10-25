import { MatchCategory } from "../types/match";

export const matchTypeOptions = [
    { label: "1v1", value: "1v1" },
    { label: "2v2", value: "2v2" },
    { label: "3v3", value: "3v3" },
    { label: "4v4", value: "4v4" },
];

export const scoreCounterReasonOptions = [
    { label: "Win", value: "Win" },
    { label: "Rùa 9", value: "Rùa 9" },
    { label: "Nhặt 9", value: "Nhặt 9" },
    { label: "Nhặt 8", value: "Nhặt 8" },
    { label: "3 đui", value: "3 đui" },
    { label: "Golden Break", value: "Golden Break" },
    { label: "Khác", value: "Khác" },
];

export const matchCategoryOptions =[
    { label: "Bàn nước", value:MatchCategory.FUN},
    { label: "Kèo tiền", value:MatchCategory.BETTING},
]