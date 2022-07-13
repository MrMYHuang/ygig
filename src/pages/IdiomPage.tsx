import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, withIonLifeCycle, IonButton, IonIcon, IonList, IonItem, IonLabel, IonLoading, IonToast, IonTitle } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import Globals from '../Globals';
import { shareSocial, arrowBack, bookmark } from 'ionicons/icons';
import { Bookmark } from '../models/Bookmark';
import { IDictItem, sortedKeys } from '../models/DictItem';

interface Props {
  dispatch: Function;
  loadingData: boolean;
}

interface PageProps extends Props, RouteComponentProps<{
  path: string;
  tab: string;
  keyword: string;
}> { }

interface State {
  keyword: string;
  search: IDictItem | null;
  showNoSelectedTextAlert: boolean;
  popover: any;
  showToast: boolean;
  toastMessage: string;
}

class _IdiomPage extends React.Component<PageProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      keyword: '',
      search: null,
      showNoSelectedTextAlert: false,
      popover: {
        show: false,
        event: null,
      },
      showToast: false,
      toastMessage: '',
    }
  }

  ionViewWillEnter() {
    //console.log( 'view will enter' );
    //console.log(this.props.match.url);
    //console.log(this.props.history.length);
    if (this.props.match.params.keyword) {
      this.setState({ keyword: this.props.match.params.keyword });
    }
    this.lookupDict(this.props.match.params.keyword);
  }

  componentDidMount() {
    //console.log(`did mount: ${this.props.match.url}`);
  }

  ionViewWillLeave() {
  }

  get isTopPage() {
    return this.props.match.url === `/${this.props.match.params.tab}`;
  }

  async lookupDict(keyword: string) {
    await new Promise<void>((ok, fail) => {
      let timer = setInterval(() => {
        if (!this.props.loadingData) {
          clearInterval(timer);
          ok();
        }
      }, 50);
    });

    const res = Globals.dictItems.find((dictItem) => dictItem.成語 === keyword) || null;
    this.setState({ search: res });
  }

  addBookmarkHandler() {
    const search = this.state.search!;
    const dictItemId = search.成語;
    this.props.dispatch({
      type: "ADD_BOOKMARK",
      bookmark: ({
        uuid: dictItemId,
      }) as Bookmark,
    });
    this.setState({ showToast: true, toastMessage: '書籤新增成功！' });
    return;
  }

  render() {
    let dictView: any = [];
    if (this.props.match.params.keyword && this.state.search != null) {
      const search = this.state.search!;
      sortedKeys.forEach((key, index) => {
        const value = (search as any)[key];
        dictView.push(
          <IonItem button={true} key={`contentItem` + index}
            onClick={async event => {
              event.preventDefault();
              Globals.copyToClipboard(value);
              this.setState({ showToast: true, toastMessage: `複製"${key}"成功` })
            }}>
            <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
            <IonLabel className='ion-text-wrap textFont' key={`contentItemlabel_` + index}>
              {key}: {value}
            </IonLabel>
          </IonItem>
        )
      });
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton fill="clear" slot='start' onClick={e => this.props.history.goBack()}>
              <IonIcon icon={arrowBack} slot='icon-only' />
            </IonButton>

            <IonTitle style={{ fontSize: 'var(--ui-font-size)' }}>成語資料</IonTitle>

            <IonButton fill="clear" slot='end' onClick={e => {
              Globals.shareByLink(this.props.dispatch, decodeURIComponent(window.location.href));
            }}>
              <IonIcon icon={shareSocial} slot='icon-only' />
            </IonButton>

            <IonButton hidden={this.props.loadingData} fill="clear" slot='end' onClick={e => {
              this.setState({ popover: { show: false, event: null } });
              this.addBookmarkHandler();
            }}>
              <IonIcon icon={bookmark} slot='icon-only' />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>

          <IonLoading
            cssClass='uiFont'
            isOpen={this.props.loadingData}
            message={'載入中...'}
          />

          <IonList key='contentList1'>
            {dictView}
          </IonList>

          <IonToast
            cssClass='uiFont'
            isOpen={this.state.showToast}
            onDidDismiss={() => this.setState({ showToast: false })}
            message={this.state.toastMessage}
            duration={2000}
          />
        </IonContent>
      </IonPage>
    );
  }
};

const IdiomPage = withIonLifeCycle(_IdiomPage);

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    loadingData: state.tmpSettings.loadingData,
  };
};


//const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
)(IdiomPage);
