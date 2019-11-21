import React from 'react'
import { Button } from 'reactstrap'

export default class VcJumbotron extends React.Component {
    render() {
        return (
            <div style={{padding:'10px', backgroundColor:'#E5E5E5'}}>
                <img src="https://www.vividcortex.com/hubfs/images/Logo/logo.svg" width="180px" />
                {this.props.subtitle && <p style={{marginTop:'10px', marginBottom:'0'}}>
                    {this.props.subtitle}
                </p>}
                {this.props.showButton && <Button outline color="primary" style={{float:'right'}} onClick={() => {
                    this.props.nr1.paneManager.openCard({
                        id: 'vcpoc.vcconfig'
                    })
                }}>Config</Button>}
            </div>
        );
    }
}