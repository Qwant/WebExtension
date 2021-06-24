import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import api from "../lib/api"
import tabs from "../lib/tabs"
import storage from "../lib/storage"
import notif from "../lib/notification"
import firefox from '../lib/firefox';

import '../scss/background.scss'
import '../scss/welcome.scss'

class Welcome extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false,
            darkTheme: false,
        }
    }

    componentDidMount() {
        this.setState({
            darkTheme: window.matchMedia('(prefers-color-scheme: dark)').matches
        })
    }

    render() {
        return (
            <div className={this.state.darkTheme ? "welcome darktheme" : "welcome"}>
                <div className="header"><img src={this.state.darkTheme ? "/img/logo-dt.png" : "/img/logo.png"} /></div>
                <div className="header2">Le moteur de recherche qui respecte votre privée.</div>
                <div className="logo-europe"><img src="/img/logo1.png" /></div>
                <div className="search-engine">Moteur Européen</div>
                <div className="logo-spy"><img src="/img/logo2.png" /></div>
                <div className="no-tracking">Pas de tracking publicitaire</div>
                <div className="logo-eye"><img src="/img/logo3.png" /></div>
                <div className="privacy">Vie privée respectée</div>
                <div className="sep1"></div>
                <div className="sep2"></div>
                <div className="divider"></div>
                <div className="title1">Qwant est votre moteur de recherche par défaut</div>
                <div className="subtitle1">lorsque vous lancez une recherche depuis la barre d'adresse de votre navigateur</div>
                <div className="title2">Qwant s'affiche en page de démarrage</div>
                <div className="subtitle2">au lancement de votre navigateur</div>
                {
                    !!this.props.firefox.isFirefox() && (<div className="firefox" onClick={() => this.props.tabs.open('https://help.qwant.com/fr/aide/qwant-com/add-qwant-on-desktop/sur-firefox/')}>Comment changer cela sur Firefox</div>)
                }
                <div className="badge1"><img src={this.state.darkTheme ? "/img/ok-dt.png" : "/img/ok.png"} /></div>
                <div className="badge2"><img src={this.state.darkTheme ? "/img/ok-dt.png" : "/img/ok.png"} /></div>
                {
                    !!this.props.firefox.isFirefox() && (<div className="external-link" onClick={() => this.props.tabs.open('https://help.qwant.com/fr/aide/qwant-com/add-qwant-on-desktop/sur-firefox/')}><img src={this.state.darkTheme ? "/img/external-link-blue-dt.png" : "/img/external-link-blue.png"} /></div>)
                }
                <div className="button-menu" onClick={() => this.setState({ open: !this.state.open })}><img src={this.state.darkTheme ? "/img/menu-dt.png" : "/img/menu.png"} /></div>
                {
                    this.state.open && (
                        <div className="menu">
                            <div className="link-politic" onClick={() => this.props.tabs.open('https://about.qwant.com/fr/legal/confidentialite/')}>Politique de confidentialité</div>
                            <div className="link-contact" onClick={() => this.props.tabs.open('https://about.qwant.com/fr/contact/')} >Nous contacter</div>
                            <div className="external-link-politic"><img src={this.state.darkTheme ? "/img/external-link.png" : "/img/external-link-black.png"} /></div>
                            <div className="external-link-contact"><img src={this.state.darkTheme ? "/img/external-link.png" : "/img/external-link-black.png"} /></div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default withTranslation("messages")(firefox(notif(storage(tabs(api(Welcome))))))

