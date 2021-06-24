import React, { Component } from 'react';
import pages from '../lib/pages'

import '../scss/background.scss'


class ExtensionRouter extends Component {

    constructor(props) {
        super(props)
        this.state = {
            page: "root"
        }
        this.props.pages.get(page => {
            if (page)
                this.setState({page})
        })
    }

    render() {
        return React.cloneElement(this.props[this.state.page], {
            ...this.props[this.state.page], toGo: (nextPage) => {
                this.props.pages.set(nextPage)
                this.setState({ page: nextPage })
            }
        });
    }
}

export default pages(ExtensionRouter)
