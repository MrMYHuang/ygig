import fs from 'fs';
import xlsxParser from 'xlsx-parse-json';
import * as zip from 'zip.js-myh';
import { isPlatform, IonLabel } from '@ionic/react';
import { DownloadEndedStats, DownloaderHelper, ErrorStats, Stats } from 'node-downloader-helper';
import { IDictItem } from './models/DictItem';
import IndexedDbFuncs from './IndexedDbFuncs';

const pwaUrl = process.env.PUBLIC_URL || '';
const bugReportApiUrl = 'https://vh6ud1o56g.execute-api.ap-northeast-1.amazonaws.com/bugReportMailer';
const idiomsDataUrl = `https://d23fxcqevt3np7.cloudfront.net/dict_idioms.zip`;

const ygigDb = 'ygigDb';
const idiomsDataKey = 'idiomsData';
let log = '';

var dictItems: Array<IDictItem> = [];

async function downloadData(url: string, progressCallback: Function) {
  return new Promise<string>((ok, fail) => {
    const dl = new DownloaderHelper(url, '.', {});
    dl.on('progress', (stats: Stats) => {
      progressCallback(stats.progress);
    });
    dl.on('end', (downloadInfo: DownloadEndedStats) => {
      dl.removeAllListeners();
      ok(downloadInfo.filePath);
    });
    dl.on('error', (stats: ErrorStats) => {
      fail(`${stats.message}`);
    });
    dl.start();
  });
}

async function clearAppData() {
  localStorage.clear();
  await IndexedDbFuncs.clear();
}

//const electronBackendApi: any = (window as any).electronBackendApi;

function removeElementsByClassName(doc: Document, className: string) {
  let elements = doc.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode?.removeChild(elements[0]);
  }
}

const consoleLog = console.log.bind(console);
const consoleError = console.error.bind(console);

function getLog() {
  return log;
}

function enableAppLog() {
  console.log = function () {
    log += '----- Info ----\n';
    log += (Array.from(arguments)) + '\n';
    consoleLog.apply(console, arguments as any);
  };

  console.error = function () {
    log += '----- Error ----\n';
    log += (Array.from(arguments)) + '\n';
    consoleError.apply(console, arguments as any);
  };
}

function disableAppLog() {
  log = '';
  console.log = consoleLog;
  console.error = consoleError;
}

async function xlsToJson(file: Blob) {
  return xlsxParser.onFileSelection(file) as Promise<any>;
}

async function readZip(filePath: string, entryIndex: number = 0) {
  const data = new Uint8Array(fs.readFileSync(filePath).buffer);
  const entry = (await new zip.ZipReader(new zip.Uint8ArrayReader(data)).getEntries())[entryIndex];
  return entry.getData!(new zip.Uint8ArrayWriter()) as Promise<Uint8Array>;
}

function disableAndroidChromeCallout(event: any) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

// Workable but imperfect.
function disableIosSafariCallout(this: Window, event: any) {
  const s = this.getSelection();
  if ((s?.rangeCount || 0) > 0) {
    const r = s?.getRangeAt(0);
    s?.removeAllRanges();
    setTimeout(() => {
      s?.addRange(r!);
    }, 50);
  }
}

//const webkit = (window as any).webkit;
function copyToClipboard(text: string) {
  try {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'clipboard-read' } as any).then(() => {
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard && navigator.clipboard.writeText(text);
    }
  } catch (error) {
    console.error(error);
  }
}

function shareByLink(dispatch: Function, url: string = window.location.href) {
  copyToClipboard(url);
  dispatch({
    type: 'TMP_SET_KEY_VAL',
    key: 'shareTextModal',
    val: {
      show: true,
      text: decodeURIComponent(url),
    },
  });
}

function isMacCatalyst() {
  return isPlatform('ios') && navigator.platform === 'MacIntel';
}

const checkServiceWorkerInterval = 20;
let serviceWorkerLoaded = false;
let _serviceWorkerReg: ServiceWorkerRegistration;
async function getServiceWorkerReg() {
  if (serviceWorkerLoaded) { 
    return _serviceWorkerReg;
  }

  return new Promise<ServiceWorkerRegistration>((ok, fail) => {
    let waitTime = 0;
    const waitLoading = setInterval(() => {
      if (navigator.serviceWorker.controller != null) {
        clearInterval(waitLoading);
        ok(_serviceWorkerReg);
      } else if (waitTime > 1e3 * 10) {
        clearInterval(waitLoading);
        fail('getServiceWorkerReg timeout!');
      }
      waitTime += checkServiceWorkerInterval;
    }, checkServiceWorkerInterval);
  });
}
function setServiceWorkerReg(serviceWorkerReg: ServiceWorkerRegistration) {
  _serviceWorkerReg = serviceWorkerReg;
}

let _serviceWorkerRegUpdated: ServiceWorkerRegistration;
function getServiceWorkerRegUpdated() {
  return _serviceWorkerRegUpdated;
}
function setServiceWorkerRegUpdated(serviceWorkerRegUpdated: ServiceWorkerRegistration) {
  _serviceWorkerRegUpdated = serviceWorkerRegUpdated;
}

const newStoreFile = 'ygigSettings.json';

const Globals = {
  pwaUrl,
  bugReportApiUrl,
  storeFile: newStoreFile,
  downloadData,
  xlsToJson,
  readZip,
  getLog,
  enableAppLog,
  disableAppLog,
  ygigDb,
  dataResources: [
    { item: "離線成語資料", dataKey: idiomsDataKey, url: idiomsDataUrl },
  ],
  appSettings: {
    'theme': '佈景主題',
    'uiFontSize': 'UI 字型大小',
    'fontSize': '內容字型大小',
  } as Record<string, string>,
  fetchErrorContent: (
    <div className='contentCenter'>
      <IonLabel>
        <div>
          <div>連線失敗!</div>
          <div style={{ fontSize: 'var(--ui-font-size)', paddingTop: 24 }}>如果問題持續發生，請執行<a href={`/${pwaUrl}/settings`} target="_self">設定頁</a>的 app 異常回報功能。</div>
        </div>
      </IonLabel>
    </div>
  ),
  updateApp: () => {
    return new Promise(async resolve => {
      navigator.serviceWorker.getRegistrations().then(async regs => {
        const hasUpdates = await Promise.all(regs.map(reg => (reg.update() as any).then((newReg: ServiceWorkerRegistration) => {
          return newReg.installing !== null || newReg.waiting !== null;
        })));
        resolve(hasUpdates.reduce((prev, curr) => prev || curr, false));
      });
    });
  },
  updateCssVars: (settings: any) => {
    document.documentElement.style.cssText = `--ui-font-size: ${settings.uiFontSize}px; --text-font-size: ${settings.fontSize}px`
  },
  isMacCatalyst,
  isTouchDevice: () => {
    return (isPlatform('ios') && !isMacCatalyst()) || isPlatform('android');
  },
  isStoreApps: () => {
    return isPlatform('pwa') || isPlatform('electron');
  },
  dictItems,
  clearAppData,
  removeElementsByClassName,
  disableAndroidChromeCallout,
  disableIosSafariCallout,
  copyToClipboard,
  shareByLink,
  setServiceWorkerReg,
  getServiceWorkerReg,
  setServiceWorkerRegUpdated,
  getServiceWorkerRegUpdated,
};

export default Globals;
