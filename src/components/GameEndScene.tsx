import React from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';
import { Game } from '../models/Game';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';

interface Props {
  game: Game;
  restart: (ev: any) => void;
  dispatch: Function;
  settings: Settings;
  tmpSettings: TmpSettings;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
  path: string;
}> { }

interface State {
}

class _GameEndScene extends React.Component<PageProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'stretch', justifyContent: 'center' }}>
        <IonLabel className='uiFont' style={{ textAlign: 'center' }}>遊戲結束 - 成績：{this.props.game.score()} 分</IonLabel>

        <IonList>
          {
            this.props.game.questions.map((q, i) =>
              <IonItem className='uiFont' key={`q${i}`}>
                <IonLabel>{q}</IonLabel>
                {
                  this.props.game.results[i] ?
                    <IonIcon className='uiFont' icon={checkmarkCircleOutline} color='success' />
                    :
                    <IonIcon className='uiFont' icon={closeCircleOutline} color='danger' />
                }
              </IonItem>)
          }
        </IonList>
        <div style={{ textAlign: 'center' }}>
          <IonButton className='uiFont' fill='outline' shape='round' size='large' onClick={this.props.restart}>
            重新開始
          </IonButton>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    settings: state.settings,
    tmpSettings: state.tmpSettings,
  }
};

//const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
)(_GameEndScene);
