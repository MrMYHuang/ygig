import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonRange, IonIcon, IonLabel, IonToggle, IonButton, IonAlert, IonSelect, IonSelectOption, IonToast, withIonLifeCycle, IonProgressBar, IonLoading } from '@ionic/react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Globals from '../Globals';
import { helpCircle, text, refreshCircle, colorPalette, bug, informationCircle, settings } from 'ionicons/icons';
import axios from 'axios';

import './SettingsPage.css';
import PackageInfos from '../../package.json';
import { Bookmark, } from '../models/Bookmark';
import { Settings } from '../models/Settings';
import IndexedDbFuncs from '../IndexedDbFuncs';

interface StateProps {
  showBugReportAlert: boolean;
  showFontLicense: boolean;
  idiomsDataDownloadRatio: number;
  isDownloading: boolean;
  showClearAlert: boolean;
  showToast: boolean;
  toastMessage: string;
}

interface Props {
  dispatch: Function;
  hasAppLog: boolean;
  theme: number;
  uiFontSize: number;
  settings: Settings;
  voiceURI: string;
  speechRate: number;
  bookmarks: [Bookmark];
  mainVersion: string | null;
  cbetaOfflineDbMode: boolean;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
  path: string;
  label: string;
}> { }

class _SettingsPage extends React.Component<PageProps, StateProps> {
  constructor(props: any) {
    super(props);

    this.state = {
      showBugReportAlert: false,
      showFontLicense: false,
      idiomsDataDownloadRatio: 0,
      isDownloading: false,
      showClearAlert: false,
      showToast: false,
      toastMessage: '',
    };
  }

  ionViewWillEnter() {
  }

  updateBookmark(newBookmarks: Array<Bookmark>, newBookmark: Bookmark) {
    const updateIndex = newBookmarks.findIndex((b: Bookmark) => b.uuid === newBookmark.uuid);
    if (updateIndex === -1) {
      console.error(`Update bookmark fails! Can't find the original bookmark with UUID: ${newBookmark.uuid}`);
    } else {
      newBookmarks[updateIndex] = newBookmark;
    }
    return;
  }

  async updateOfflineData() {
    this.setState({ isDownloading: true, idiomsDataDownloadRatio: 0 });
    try {
      for (let i = 0; i < Globals.dataResources.length; i++) {
        let item = Globals.dataResources[i];
        const idiomsData = await Globals.downloadData(item.url, (progress: number) => {
          this.setState({ idiomsDataDownloadRatio: (i + (progress / 100)) / Globals.dataResources.length });
        });
        IndexedDbFuncs.saveFile(item.dataKey, idiomsData);
      }
      this.setState({ isDownloading: false, idiomsDataDownloadRatio: 1, showToast: true, toastMessage: `離線成語資料更新完畢！` });
    } catch (error) {
      console.error(error);
      this.setState({ isDownloading: false, showToast: true, toastMessage: `${error}` })
    }
  }

  reportText = '';
  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle className='uiFont'>設定</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {/*
              // Disable app update for Mac App Store submission.
            <IonItem>
              <IonIcon icon={shareSocial} slot='start' />
              <IonLabel className='ion-text-wrap uiFont' onClick={async e => {
                const hasUpdate = await Globals.updateApp();

                if (!hasUpdate) {
                  this.setState({ showToast: true, toastMessage: 'App 已是最新版' });
                }
              }}>PWA版本: <a href="https://github.com/MrMYHuang/ygig#history" target="_new">{PackageInfos.pwaVersion}</a></IonLabel>
              <IonButton fill='outline' shape='round' slot='end' size='large' style={{ fontSize: 'var(--ui-font-size)' }} onClick={e => {
                Globals.shareByLink(this.props.dispatch, decodeURIComponent(window.location.origin));
              }}>分享</IonButton>
            </IonItem>
            */}
            <IonItem hidden={!this.props.mainVersion}>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
              <IonIcon icon={informationCircle} slot='start' />
              <IonLabel className='ion-text-wrap uiFont'>Backend app 版本: {this.props.mainVersion}</IonLabel>
              {/*<IonButton fill='outline' shape='round' slot='end' size='large' style={{ fontSize: 'var(--ui-font-size)' }} onClick={e => {
              }}>分享</IonButton>*/}
            </IonItem>
            <IonItem>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
              <IonIcon icon={bug} slot='start' />
              <IonLabel className='ion-text-wrap uiFont'><a href="https://github.com/MrMYHuang/ygig#report" target="_new">啟用 app 異常記錄</a></IonLabel>
              <IonToggle slot='end' checked={this.props.hasAppLog} onIonChange={e => {
                const isChecked = e.detail.checked;

                if (this.props.hasAppLog === isChecked) {
                  return;
                }

                isChecked ? Globals.enableAppLog() : Globals.disableAppLog();
                this.props.dispatch({
                  type: "SET_KEY_VAL",
                  key: 'hasAppLog',
                  val: isChecked
                });
              }} />
            </IonItem>
            <IonItem hidden={!this.props.settings.hasAppLog}>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
              <IonIcon icon={bug} slot='start' />
              <IonLabel className='ion-text-wrap uiFont'>回報 app 異常記錄</IonLabel>
              <IonButton fill='outline' shape='round' slot='end' size='large' className='uiFont' onClick={e => {
                this.reportText = "瀏覽器：" + navigator.userAgent + "\n\nApp 版本：" + PackageInfos.pwaVersion + "\n\nApp設定：" + JSON.stringify(this.props.settings) + "\n\nLog：\n" + Globals.getLog();
                this.setState({ showBugReportAlert: true });
              }}>回報</IonButton>
              <IonAlert
                cssClass='uiFont'
                backdropDismiss={false}
                isOpen={this.state.showBugReportAlert}
                header={'異常回報'}
                subHeader='輸入您的 E-mail，以後續聯絡(必填)'
                inputs={[
                  {
                    name: 'name0',
                    type: 'email',
                    placeholder: '例：abc@example.com'
                  },
                  {
                    name: 'name1',
                    type: 'textarea',
                    placeholder: '請描述發生步驟'
                  },
                ]}
                buttons={[
                  {
                    text: '送出',
                    cssClass: 'primary uiFont',
                    handler: async (value) => {
                      if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value.name0)) {
                        this.setState({ showBugReportAlert: false, showToast: true, toastMessage: `錯誤，E-mail 不符格式！` });
                        return
                      }

                      try {
                        const axiosInstance = axios.create({ timeout: 10000 });
                        await axiosInstance.post(Globals.bugReportApiUrl, {
                          subject: `${PackageInfos.productName}異常記錄回報`,
                          text: `E-mail: ${value.name0}\n\n發生步驟: ${value.name1}\n\n${this.reportText}`,
                        });
                        this.setState({ showBugReportAlert: false, showToast: true, toastMessage: `異常回報成功` });
                      } catch (error) {
                        console.error(error);
                        this.setState({ showBugReportAlert: false, showToast: true, toastMessage: `異常回報失敗` });
                      }
                    },
                  },
                  {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'secondary uiFont',
                    handler: () => this.setState({ showBugReportAlert: false }),
                  },
                ]}
              />
            </IonItem>
            <IonItem>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
              <IonIcon icon={settings} slot='start' />
              <div className='contentBlock'>
                <div style={{ flexDirection: 'column' }}>
                  <IonLabel className='ion-text-wrap uiFont'>App 設定與書籤</IonLabel>
                  <div style={{ textAlign: 'right' }}>
                    <IonButton fill='outline' shape='round' size='large' style={{ fontSize: 'var(--ui-font-size)' }} onClick={async (e) => {
                      const settingsJsonUri = `data:text/json;charset=utf-8,${encodeURIComponent(localStorage.getItem(Globals.storeFile) || '')}`;
                      const a = document.createElement('a');
                      a.href = settingsJsonUri;
                      a.download = Globals.storeFile;
                      a.click();
                      a.remove();
                    }}>匯出</IonButton>
                    <input id='importJsonInput' type='file' accept='.json' style={{ display: 'none' }} onChange={async (ev) => {
                      const file = ev.target.files?.item(0);
                      const fileText = await file?.text() || '';
                      try {
                        // JSON text validation.
                        JSON.parse(fileText);
                        localStorage.setItem(Globals.storeFile, fileText);
                        this.props.dispatch({ type: 'LOAD_SETTINGS' });
                        setTimeout(() => {
                          this.updateOfflineData();
                        }, 0);
                      } catch (e) {
                        console.error(e);
                        console.error(new Error().stack);
                      }
                      (document.getElementById('importJsonInput') as HTMLInputElement).value = '';
                    }} />

                    <IonButton fill='outline' shape='round' size='large' className='uiFont' onClick={(e) => {
                      (document.querySelector('#importJsonInput') as HTMLInputElement).click();
                    }}>匯入</IonButton>
                    <IonButton fill='outline' shape='round' size='large' className='uiFont' onClick={(e) => {
                      this.setState({ showClearAlert: true });
                    }}>重置</IonButton>
                    <IonAlert
                      cssClass='uiFont'
                      isOpen={this.state.showClearAlert}
                      backdropDismiss={false}
                      onDidPresent={(ev) => {
                      }}
                      header={'重置會還原app設定預設值並清除書籤、離線資料檔！確定重置？'}
                      buttons={[
                        {
                          text: '取消',
                          cssClass: 'primary uiFont',
                          handler: (value) => {
                            this.setState({
                              showClearAlert: false,
                            });
                          },
                        },
                        {
                          text: '重置',
                          cssClass: 'secondary uiFont',
                          handler: async (value) => {
                            await Globals.clearAppData();
                            this.props.dispatch({ type: 'DEFAULT_SETTINGS' });
                            this.setState({ showClearAlert: false, showToast: true, toastMessage: "清除成功!" });
                          },
                        }
                      ]}
                    />
                  </div>
                </div>
              </div>
            </IonItem>
            <IonItem>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
              <IonIcon icon={refreshCircle} slot='start' />
              <div style={{ width: '100%' }}>
                <IonLabel className='ion-text-wrap uiFont'>離線成語資料</IonLabel>
                <IonLabel className='ion-text-wrap uiFont'>上次更新：{new Date(this.props.settings.offlineDataDownloadDate).toLocaleDateString()}</IonLabel>
                <IonProgressBar value={this.state.idiomsDataDownloadRatio} />
              </div>
              <IonButton fill='outline' shape='round' slot='end' size='large' style={{ fontSize: 'var(--ui-font-size)' }} onClick={async (e) => this.updateOfflineData()}>更新</IonButton>
            </IonItem>
            <IonItem>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
              <IonIcon icon={refreshCircle} slot='start' />
              <IonLabel className='ion-text-wrap uiFont'>啟用離線資料更新通知</IonLabel>
              <IonToggle slot='end' checked={this.props.settings.alertUpdateOfflineData} onIonChange={e => {
                const isChecked = e.detail.checked;

                this.props.dispatch({
                  type: "SET_KEY_VAL",
                  key: 'alertUpdateOfflineData',
                  val: isChecked
                });
              }} />
            </IonItem>
            <IonItem>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
              <IonIcon icon={colorPalette} slot='start' />
              <IonLabel className='ion-text-wrap uiFont'>{Globals.appSettings['theme']}</IonLabel>
              <IonSelect slot='end'
                value={+this.props.theme}
                style={{ fontSize: 'var(--ui-font-size)' }}
                interface='popover'
                interfaceOptions={{ cssClass: 'ygigthemes' }}
                onIonChange={e => {
                  const value = +e.detail.value;
                  // Important! Because it can results in rerendering of this component but
                  // store states (this.props.theme) of this component is not updated yet! And IonSelect value will be changed
                  // back to the old value and onIonChange will be triggered again!
                  // Thus, we use this check to ignore this invalid change.
                  if (+this.props.theme === value) {
                    return;
                  }

                  this.props.dispatch({
                    type: "SET_KEY_VAL",
                    key: 'theme',
                    val: value,
                  });
                }}>
                <IonSelectOption className='uiFont cbeta' value={0}>綠底</IonSelectOption>
                <IonSelectOption className='uiFont dark' value={1}>暗色</IonSelectOption>
                <IonSelectOption className='uiFont light' value={2}>亮色</IonSelectOption>
                <IonSelectOption className='uiFont oldPaper' value={3}>舊書</IonSelectOption>
                <IonSelectOption className='uiFont marble' value={4}>大理石</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
              <IonIcon icon={text} slot='start' />
              <div className="contentBlock">
                <div style={{ flexDirection: "column" }}>
                  <IonLabel className='ion-text-wrap uiFont'>{Globals.appSettings['uiFontSize']}: {this.props.uiFontSize}</IonLabel>
                  <IonRange min={10} max={128} pin={true} snaps={true} value={this.props.uiFontSize} onIonChange={e => {
                    this.props.dispatch({
                      type: "SET_KEY_VAL",
                      key: 'uiFontSize',
                      val: +e.detail.value,
                    });
                    setTimeout(() => {
                      Globals.updateCssVars(this.props.settings);
                    }, 0);
                  }} />
                </div>
              </div>
            </IonItem>
            <IonItem>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
              <IonIcon icon={text} slot='start' />
              <div className="contentBlock">
                <IonLabel className='ion-text-wrap uiFont'>{Globals.appSettings['fontSize']}: <span className='textFont'>{this.props.settings.fontSize}</span></IonLabel>
                <IonRange min={10} max={128} pin={true} snaps={true} value={this.props.settings.fontSize} onIonChange={e => {
                  this.props.dispatch({
                    type: "SET_KEY_VAL",
                    key: 'fontSize',
                    val: +e.detail.value,
                  });
                  setTimeout(() => {
                    Globals.updateCssVars(this.props.settings);
                  }, 0);
                }} />
              </div>
            </IonItem>
            {/*
            <IonItem>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. * /}
              <IonIcon icon={print} slot='start' />
              <IonLabel className='ion-text-wrap uiFont'>合成語音</IonLabel>
              <IonSelect slot='end'
                value={this.props.voiceURI}
                style={{ fontSize: 'var(--ui-font-size)' }}
                interface='action-sheet'
                cancelText='取消'
                onIonChange={e => {
                  const value = e.detail.value;
                  if (this.props.voiceURI === value) {
                    return;
                  }

                  this.props.dispatch({
                    type: "SET_KEY_VAL",
                    key: 'voiceURI',
                    val: value,
                  });
                }}>
                {
                  Globals.zhVoices().map((v, i) => <IonSelectOption key={i} className='uiFont blackWhite printVar' value={v.voiceURI}>{v.name}</IonSelectOption>)
                }
              </IonSelect>
            </IonItem>
            <IonItem>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. * /}
              <IonIcon icon={musicalNotes} slot='start' />
              <div className="contentBlock">
                <div style={{ flexDirection: "column" }}>
                  <IonLabel className='ion-text-wrap uiFont'><a href="https://github.com/MrMYHuang/ygig#text2speech" target="_new">合成語音語速</a>: {this.props.speechRate}</IonLabel>
                  <IonRange min={0.1} max={1.5} step={0.1} snaps={true} value={this.props.speechRate} onIonChange={e => {
                    this.props.dispatch({
                      type: "SET_KEY_VAL",
                      key: 'speechRate',
                      val: (e.detail.value as number).toFixed(1),
                    });
                  }} />
                </div>
              </div>
            </IonItem>
          */}
            <IonItem>
              <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
              <IonIcon icon={helpCircle} slot='start' />
              <div style={{ fontSize: 'var(--ui-font-size)' }}>
                <div>關於</div>
                <div><a href="https://github.com/MrMYHuang/ygig" target="_new">操作說明與開放原始碼</a></div>
                <div>作者: Meng-Yuan Huang</div>
                <div><a href="mailto:myh@live.com" target="_new">myh@live.com</a></div>
              </div>
            </IonItem>
          </IonList>

          <IonLoading
            cssClass='uiFont'
            isOpen={this.state.isDownloading}
            message={'下載中...'}
          />

          <IonToast
            cssClass='uiFont'
            isOpen={this.state.showToast}
            onDidDismiss={() => this.setState({ showToast: false })}
            message={this.state.toastMessage}
            duration={2000}
          />
        </IonContent>
      </IonPage >
    );
  }
};

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    settings: JSON.parse(JSON.stringify(state.settings)),
    hasAppLog: state.settings.hasAppLog,
    theme: state.settings.theme,
    uiFontSize: state.settings.uiFontSize,
    speechRate: state.settings.speechRate,
    bookmarks: state.settings.bookmarks,
    voiceURI: state.settings.voiceURI,
    mainVersion: state.tmpSettings.mainVersion,
  }
};

const SettingsPage = withIonLifeCycle(_SettingsPage);

export default connect(
  mapStateToProps,
)(SettingsPage);
