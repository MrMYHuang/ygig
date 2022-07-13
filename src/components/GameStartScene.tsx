import React from 'react';
import { IonButton, IonInput } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';
import { Game } from '../models/Game';
import Globals from '../Globals';

interface Props {
  start: Function;
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

class _GameStartScene extends React.Component<PageProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  gameStart() {
    const questions = new Array(this.props.settings.questionCount).fill(0).map((v, i) => {
      return Globals.dictItems[Math.floor(Globals.dictItems.length * Math.random())].成語
    })
    const game = new Game(questions, this.props.settings.questionTimeout);
    this.props.start(game);
  }

  render() {
    return (
      <>
        <div className='uiFont' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0px 20px' }}>
          題數：
          <div style={{ padding: '20px 0px', textAlign: 'start' }}>
            <IonInput className='uiFont' inputmode='numeric'
              value={this.props.settings.questionCount}
              onIonChange={(ev) => {
                this.props.dispatch({
                  type: 'SET_KEY_VAL',
                  key: 'questionCount',
                  val: +(ev.target.value || 0),
                });
              }}></IonInput>
          </div>
          每題限時(秒)：
          <div style={{ padding: '20px 0px', textAlign: 'start' }}>
            <IonInput className='uiFont' inputmode='numeric' value={this.props.settings.questionTimeout}
              onIonChange={(ev) => {
                this.props.dispatch({
                  type: 'SET_KEY_VAL',
                  key: 'questionTimeout',
                  val: +(ev.target.value || 0),
                });
              }}></IonInput>
          </div>

          <div style={{ padding: '20px 0px' }}>
          <IonButton className='uiFont' fill='outline' shape='round' size='large' onClick={this.gameStart.bind(this)}>遊戲開始</IonButton>
          </div>
        </div>
      </>
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
)(_GameStartScene);
