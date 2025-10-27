import localforage from 'localforage';
import axios, { type AxiosResponse } from 'axios';
import type { MatchScoreEvent, MatchScoreEventRequest } from '../types/matchScoreEvents';
import axiosRetry from 'axios-retry';
// import { axiosWithRetry } from './axiosConfig';


// Khởi tạo localforage instance
const offlineStore = localforage.createInstance({
    name: 'match_score_events',
});

// Lưu mảng events vào IndexedDB
export const saveEvents = async (matchId: string, events: MatchScoreEventRequest[]): Promise<void> => {
    await offlineStore.setItem(`match_${matchId}`, events);
};

// Lấy mảng events từ IndexedDB
export const getEvents = async (matchId: string): Promise<MatchScoreEventRequest[]> => {
    return (await offlineStore.getItem(`match_${matchId}`)) || [];
};

// Gửi event lên BE với axios-retry
export const saveRackToBE = async (
    event: MatchScoreEventRequest,
    scoreCounterLockToken: string
): Promise<{ success: boolean; data?: MatchScoreEvent; error?: any }> => {
    try {

        const response: AxiosResponse<MatchScoreEvent> = await axios.post(
            `/api/match-score-events?token=${scoreCounterLockToken}`,
            {
                workspaceId: event.workspaceId,
                tournamentId: event.tournamentId,
                matchId: event.matchId,
                teamId: event.teamId,
                playerId: event.playerId,
                rackNumber: event.rackNumber,
                pointsReceived: event.pointsReceived,
                note: event.note,
            },
            {
                // Tùy chọn retry chỉ cho request này
                'axios-retry': {
                    retries: 3, // Retry 5 lần
                    retryDelay: (retryCount: number) => retryCount * 2000, // Delay 2s, 4s, 6s, 8s, 10s
                    retryCondition: (error): boolean => {
                        return (
                            !!axiosRetry.isNetworkOrIdempotentRequestError(error) ||
                            (error.response?.status ? error.response.status >= 500 : false)
                        );
                    },
                },
            }
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error };
    }
};

// Đồng bộ tất cả events chưa sync
export const syncEvents = async (matchId: string, scoreCounterLockToken: string):Promise<MatchScoreEventRequest[]> => {
    const events = await getEvents(matchId);
    const updatedEvents = [...events];

    for (let i = 0; i < updatedEvents.length; i++) {
        if (!updatedEvents[i].isSynced && updatedEvents[i].retryCount < 5) {
            const result = await saveRackToBE(updatedEvents[i], scoreCounterLockToken);
            if (result.success) {
                updatedEvents[i].isSynced = true;
            } else {
                updatedEvents[i].retryCount += 1;
                updatedEvents[i].lastAttempt = new Date().toISOString();
            }
        }
    }

    // Chỉ lưu lại các event chưa sync
    await saveEvents(matchId, updatedEvents.filter((e) => !e.isSynced));
    return updatedEvents;
};

// Xóa dữ liệu offline của match sau khi hoàn tất
export const clearEvents = async (matchId: string): Promise<void> => {
    await offlineStore.removeItem(`match_${matchId}`);
};
