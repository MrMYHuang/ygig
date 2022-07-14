import React, { ReactNode } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonReorderGroup, IonReorder, IonItem, IonLabel, withIonLifeCycle, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonButton, IonToast } from '@ionic/react';
import { ItemReorderEventDetail } from '@ionic/core';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Bookmark } from '../models/Bookmark';
import { swapVertical } from 'ionicons/icons';
import queryString from 'query-string';
import Globals from '../Globals';

interface Props {
  dispatch: Function;
  bookmarks: Bookmark[];
  fontSize: number;
}

interface State {
  reorder: boolean;
  showToast: boolean;
  toastMessage: string;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
  path: string;
}> { }

const helpDoc = Globals.isStoreApps() ?
  <></>
  :
  <>
    <div style={{ fontSize: 'var(--ui-font-size)', textAlign: 'center' }}><a href="https://github.com/MrMYHuang/ygig#web-app" target="_new">程式安裝說明</a></div>
    <div style={{ fontSize: 'var(--ui-font-size)', textAlign: 'center' }}><a href="https://github.com/MrMYHuang/ygig#shortcuts" target="_new">程式捷徑</a></div>
  </>
  ;

class _BookmarkPage extends React.Component<PageProps, State> {
  bookmarkListRef: React.RefObject<HTMLIonListElement>;
  constructor(props: any) {
    super(props);
    this.state = {
      reorder: false,
      showToast: false,
      toastMessage: '',
    }
    this.bookmarkListRef = React.createRef<HTMLIonListElement>();
  }

  ionViewWillEnter() {
    let queryParams = queryString.parse(this.props.location.search) as any;
    if (queryParams.item && queryParams.item < this.props.bookmarks.length) {
      const bookmark = this.props.bookmarks[queryParams.item];
      this.props.history.push(`${Globals.pwaUrl}/dictionary/${bookmark.uuid}`);
    } else if (!this.hasBookmark) {
      this.setState({ showToast: true, toastMessage: '無書籤！請搜尋成語並加至書籤。' });
      this.props.history.push(`${Globals.pwaUrl}/dictionary/search`);
    }
    //console.log( 'view will enter' );
  }

  get hasBookmark() {
    return this.props.bookmarks.length > 0;
  }

  delBookmarkHandler(uuidStr: string) {
    this.props.dispatch({
      type: "DEL_BOOKMARK",
      uuid: uuidStr,
    });

    setTimeout(() => {
      if (!this.hasBookmark) {
        this.setState({ showToast: true, toastMessage: '無書籤！請搜尋成語並加至書籤。' });
        this.props.history.push(`${Globals.pwaUrl}/dictionary/search`);
      }
    }, 0);
  }

  reorderBookmarks(event: CustomEvent<ItemReorderEventDetail>) {
    const bookmarks = event.detail.complete(this.props.bookmarks);
    this.props.dispatch({
      type: "UPDATE_BOOKMARKS",
      bookmarks: bookmarks,
    });
  }

  getBookmarkRows() {
    let bookmarks = this.props.bookmarks;
    let rows = Array<ReactNode>();
    bookmarks.forEach((bookmark, i) => {
      let routeLink = ``;
      let label = `${bookmark.uuid}`;
      routeLink = `${Globals.pwaUrl}/dictionary/idiom/${bookmark.uuid}`;
      rows.push(
        <IonItemSliding key={`bookmarkItemSliding_` + i}>
          <IonItem key={`bookmarkItem_` + i} button={true} onClick={async event => {
            if (this.state.reorder) {
              this.setState({ showToast: true, toastMessage: '請先關閉排列功能，才可點擊書籤！' });
              return;
            }

            event.preventDefault();
            this.props.history.push({
              pathname: routeLink,
            });
          }}>
            <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
            <IonLabel className='ion-text-wrap uiFont' key={`bookmarkItemLabel_` + i}>
              {label}
            </IonLabel>
            <IonReorder slot='end' />
          </IonItem>

          <IonItemOptions side="end">
            <IonItemOption style={{ fontSize: 'var(--ui-font-size)' }} color='danger' onClick={(e) => {
              this.delBookmarkHandler(bookmark.uuid);
              this.bookmarkListRef.current?.closeSlidingItems();
            }}>刪除</IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      );
    });
    return rows;
  }

  render() {
    const rows = this.getBookmarkRows();

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle style={{ fontSize: 'var(--ui-font-size)' }}>書籤</IonTitle>

            <IonButton fill={this.state.reorder ? 'solid' : 'clear'} slot='end'
              onClick={ev => this.setState({ reorder: !this.state.reorder })}>
              <IonIcon icon={swapVertical} slot='icon-only' />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {this.hasBookmark ?
            <>
              <IonList key='bookmarkList0' ref={this.bookmarkListRef}>
                <IonReorderGroup disabled={!this.state.reorder} onIonItemReorder={(event: CustomEvent<ItemReorderEventDetail>) => { this.reorderBookmarks(event); }}>
                  {rows}
                </IonReorderGroup>
              </IonList>
              {helpDoc}
            </> :
            <>
              <IonList key='bookmarkList1'>
                {rows}
              </IonList>
              {helpDoc}
            </>
          }

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

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    bookmarks: JSON.parse(JSON.stringify(state.settings.bookmarks)),
  }
};

//const mapDispatchToProps = {};

const BookmarkPage = withIonLifeCycle(_BookmarkPage);

export default connect(
  mapStateToProps,
)(BookmarkPage);
