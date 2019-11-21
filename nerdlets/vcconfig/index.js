import React from 'react'
import PropTypes from 'prop-types'
import OsHostSelector from '../components/host/osHostSelector';

/**
 * @see https://pages.datanerd.us/wanda/wanda-ec-ui/v1/class/src/artifacts/nerdlet/Nerdlet.js~Nerdlet.html
 */
export default class MyNerdlet extends React.Component {
    static propTypes = {
        entity: PropTypes.object,
        nr1: PropTypes.object,
    }

    constructor(props) {
        super(props)
        this._closeNerdlet = this._closeNerdlet.bind(this)
    }

    _closeNerdlet() {
        this.props.nr1.paneManager.closeNerdlet(1)
    }

    _getHook() {
        return this.props.nr1.catalog.getHookAndExecute('vcpoc.vcmsg-bus');
    }

    componentDidMount() {
        this._getHook().then((messageBus) => {
            messageBus.listen(this._closeNerdlet);
        });
    }

    componentWillUnmount() {
        this._getHook().then((messageBus) => {
            messageBus.unlisten(this._closeNerdlet);
        })
    }

    render() {
        return <div>
            <OsHostSelector nr1={this.props.nr1} entity={this.props.entity} />
        </div>
    }
}
