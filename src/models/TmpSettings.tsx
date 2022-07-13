export interface TmpSettings {
    loadingData: boolean;
    shareTextModal: any;
    mainVersion: string | null;
}

const defaultTmpSettings = {
    loadingData: false,
    shareTextModal: null,
    mainVersion: null,
} as TmpSettings;

export default defaultTmpSettings;
