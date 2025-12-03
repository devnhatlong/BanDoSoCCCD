const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_OVERVIEW = '/overview';
const ROOTS_MONITOR = '/monitor';
const ROOTS_ADMINISTRATIVE = '/administrative';
const ROOTS_REPORT = '/report';

export const PATHS = {
    ROOT: ROOTS_DASHBOARD,
    OVERVIEW: {
        MAP: `${ROOTS_OVERVIEW}/map`,
        DASHBOARD: `${ROOTS_OVERVIEW}/dashboard`,
        ANALYSIS: `${ROOTS_OVERVIEW}/analysis`,
    },
    MONITOR: {
        REALTIME: `${ROOTS_MONITOR}/realtime`,
        CAMPAIGN: `${ROOTS_MONITOR}/campaign`,
        CAMPAIGN_DETAIL: `${ROOTS_MONITOR}/campaign-detail`,
    },
    ADMINISTRATIVE: {
        DISTRICT: `${ROOTS_ADMINISTRATIVE}/district`,
        COMMUNE: `${ROOTS_ADMINISTRATIVE}/commune`,
        COMMUNE_OVERVIEW: `${ROOTS_ADMINISTRATIVE}/commune-overview`,
    },
    REPORT: {
        RANKING: `${ROOTS_REPORT}/ranking`,
        LEADERBOARD: `${ROOTS_REPORT}/leaderboard`,
        HISTORY: `${ROOTS_REPORT}/history`,
        CHART: `${ROOTS_REPORT}/chart`,
    },
};