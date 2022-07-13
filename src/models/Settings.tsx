import { Bookmark } from "./Bookmark";

export interface Settings {
    version: number;
    questionCount: number;
    questionTimeout: number;
    offlineDataDownloadDate: string;
    alertUpdateOfflineData: boolean;
    hasAppLog: boolean;
    theme: number;
    fontSize: number;
    uiFontSize: number;
    voiceURI: string | null;
    speechRate: number;
    bookmarks: Bookmark[];
    dictionaryHistory: string[];
}

export const defaultSettings = {
    version: 1,
    questionCount: 10,
    questionTimeout: 30,
    offlineDataDownloadDate: new Date().toISOString(),
    alertUpdateOfflineData: true,
    hasAppLog: true,
    theme: 2,
    fontSize: 32,
    uiFontSize: 32,
    voiceURI: null,
    speechRate: 0.8,
    bookmarks: [],
    dictionaryHistory: [],
} as Settings;
