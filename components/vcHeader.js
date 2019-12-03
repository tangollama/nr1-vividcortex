import React from 'react'
import { Button } from 'nr1'

export default class VCHeader extends React.Component {
  render() {
    return (
      <div style={{padding:'10px', backgroundColor:'#E5E5E5'}}>
        <img src="https://www.vividcortex.com/hubfs/images/Logo/logo.svg" width="180px" />
        {this.props.hideButton ? null : <Button type={Button.TYPE.PRIMARY} style={{float:'right'}}
        iconType={Button.ICON_TYPE.HARDWARE_AND_SOFTWARE__HARDWARE__SERVER__A_CONFIGURE}
        onClick={() => {
          this.props.callbacks.openConfig()
        }}>Config</Button>}
      </div>
    );
  }
}