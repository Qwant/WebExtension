import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import api from "../lib/api"
import tabs from "../lib/tabs"
import storage from "../lib/storage"
import notif from "../lib/notification"

import '../scss/background.scss'
import '../scss/msg.scss'

class Msg extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { t } = this.props
        return (
            <div className="msg">
            </div>
        )
    }
}

export default withTranslation("messages")(notif(storage(tabs(api(Msg)))))

