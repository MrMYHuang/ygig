import React from 'react';
import { IonIcon } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';

const twoPi = 2 * Math.PI;

interface Props {
  title: string;
  question: string;
  progress: number;
  correct: (ev: any) => void;
  wrong: (ev: any) => void;
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

class _GameQuestionScene extends React.Component<PageProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.createProgressCircles();
  }

  fitText(text: string) {
    const fontSize = window.innerWidth / text.length * 0.9;
    return <div style={{ width: '100%', height: '100%', fontSize: `${fontSize}px`, fontFamily: 'monospace', display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>{text}</div>
  }

  width = this.props.settings.uiFontSize * 2;
  height = this.props.settings.uiFontSize * 2;
  meter: d3.Selection<SVGPathElement, unknown, HTMLElement, any> | undefined;
  arc = d3.arc<number>().startAngle(0).endAngle(twoPi).innerRadius(0).outerRadius(this.width / 2);

  createProgressCircles() {
    d3.selectAll('.progressCircle').selectChildren().remove();
    const g = d3.selectAll('.progressCircle')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

    this.meter = g.append('path')
      .attr('class', 'progressCircleMeter');
  }

  render() {
    this.meter?.attr('d', this.arc.startAngle(twoPi * this.props.progress)(0));
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', alignItems: 'strench' }}>
          <div className='uiFontX2' style={{ display: 'flex', justifyContent: 'center' }}>
            {this.props.title}&nbsp;
            <div className='progressCircle' style={{ display: 'flex', alignItems: 'center' }} key='progressCircle' />
          </div>
          <div style={{ flexGrow: 1 }}>
            {this.fitText(this.props.question)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <IonIcon icon={closeCircleOutline} color='danger' style={{ fontSize: `${this.props.settings.uiFontSize * 3}px` }} onClick={this.props.wrong} />
            <IonIcon icon={checkmarkCircleOutline} color='success' style={{ fontSize: `${this.props.settings.uiFontSize * 3}px` }} onClick={this.props.correct} />
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
)(_GameQuestionScene);
