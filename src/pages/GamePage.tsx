import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonToast, IonButton, IonIcon, IonLoading } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { shareSocial } from 'ionicons/icons';

import { Bookmark } from '../models/Bookmark';
import GameStartScene from '../components/GameStartScene';
import GameQuestionScene from '../components/GameQuestionScene';
import GameEndScene from '../components/GameEndScene';
import { Game } from '../models/Game';
import Globals from '../Globals';
import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';

enum GameState {
  START,
  PLAYING_Qn,
  WAIT_Qn,
  END,
};

interface Props {
  bookmarks: Bookmark[];
  dispatch: Function;
  settings: Settings;
  tmpSettings: TmpSettings;
}

interface State {
  game: Game;
  gameState: GameState;
  gameTime: number;
  showToast: boolean;
  toastMessage: string;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
  path: string;
}> { }

class _GamePage extends React.Component<PageProps, State> {
  timer: NodeJS.Timeout;
  constructor(props: any) {
    super(props);
    this.state = {
      game: new Game([''], 1),
      gameState: GameState.START,
      gameTime: 0,
      showToast: false,
      toastMessage: '',
    }

    this.timer = setTimeout(() => { }, 0);

    setInterval(() => {
      this.nextGameState();
    }, 20);


    setInterval(() => {
      this.setState({ gameTime: this.state.gameTime + 1 });
    }, 1e3);
  }

  nextGameState() {
    switch (this.state.gameState) {
      case GameState.START:
        break;

      case GameState.PLAYING_Qn:
        if (this.state.game.ended()) {
          this.setState({ gameState: GameState.END });
          break;
        }

        this.setState({ gameTime: 0 });
        this.timer = setTimeout(() => {
          const finish = this.state.game.currQuestionFinish();
          if (finish) {
            clearTimeout(this.timer);
            return;
          }

          this.setNextQuestion();
        }, this.state.game.questionTimeout * 1e3);

        this.setState({ gameState: GameState.WAIT_Qn });
        break;

      case GameState.WAIT_Qn:
        break;

      case GameState.END:
        break;
    }
  }

  setNextQuestion() {
    this.state.game.setCurrQuestionFinish();
    // Play next question.
    this.state.game.setNextQuestion();
    this.setState({ gameState: GameState.PLAYING_Qn });
  }

  ionViewWillEnter() {
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle style={{ fontSize: 'var(--ui-font-size)' }}>你比我猜</IonTitle>

            <IonButton fill="clear" slot='end' onClick={e => {
              Globals.shareByLink(this.props.dispatch, decodeURIComponent(window.location.href));
            }}>
              <IonIcon icon={shareSocial} slot='icon-only' />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {this.props.tmpSettings.loadingData ?
            <IonLoading
              cssClass='uiFont'
              isOpen={this.props.tmpSettings.loadingData}
              message={'下載資料庫...'}
            />
            :
            <></>
          }

          <div className='contentCenter' hidden={this.state.gameState !== GameState.START}>
            <GameStartScene
              start={(game: Game) => {
                this.setState({ game, gameState: GameState.PLAYING_Qn });
              }}
              history={this.props.history}
              match={this.props.match}
              location={this.props.location}
            />
          </div>

          <div hidden={!(this.state.gameState === GameState.PLAYING_Qn || this.state.gameState === GameState.WAIT_Qn)}
            style={{ height: '100%' }}
          >
            <GameQuestionScene
              correct={() => {
                clearTimeout(this.timer);
                this.state.game.setCurrResult(true);
                this.setNextQuestion();
              }}
              wrong={() => {
                clearTimeout(this.timer);
                this.state.game.setCurrResult(false);
                this.setNextQuestion();
              }}
              title={`第${this.state.game.currQuestionId + 1}題`}
              question={this.state.game.currQuestion()}
              progress={this.state.gameTime / this.state.game.questionTimeout}
              history={this.props.history}
              match={this.props.match}
              location={this.props.location}
            />
          </div>

          <div hidden={this.state.gameState !== GameState.END}>
            <GameEndScene
              game={this.state.game}
              restart={() => {
                this.setState({ gameState: GameState.START });
              }}
              history={this.props.history}
              match={this.props.match}
              location={this.props.location}
            />
          </div>

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
    settings: state.settings,
    tmpSettings: state.tmpSettings,
  }
};

//const mapDispatchToProps = {};

const GamePage = withIonLifeCycle(_GamePage);

export default connect(
  mapStateToProps,
)(GamePage);
