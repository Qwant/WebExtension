import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
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
                <div className="header2">{this.props.t("Le_moteur_de_recherche_qui_respecte_votre_privee_.message")}</div>
                <div className="logo-europe"><img src="/img/logo1.png" /></div>
                <div className="search-engine">{this.props.t("Moteur_Europeen.message")}</div>
                <div className="logo-spy"><img src="/img/logo2.png" /></div>
                <div className="no-tracking">{this.props.t("Pas_de_tracking_publicitaire.message")}</div>
                <div className="logo-eye"><img src="/img/logo3.png" /></div>
                <div className="privacy">{this.props.t("Vie_privee_respectee.message")}</div>
                <div className="sep1"></div>
                <div className="sep2"></div>
                <div className="divider"></div>
                <div className="group1">
                    <div className="title1">{this.props.t("Qwant_est_votre_moteur_de_recherche_par_defaut.message")}</div>
                    <div className="subtitle1">{this.props.t("lorsque_vous_lancez_une_recherche_depuis_la_barre_d_adresse_de_votre_navigateur.message")}</div>
                </div>
                <div className="title2">{this.props.t("Qwant_s_affiche_en_page_de_demarrage.message")}</div>
                <div className="subtitle2">{this.props.t("au_lancement_de_votre_navigateur.message")}</div>
                <div className="badge1"><img src={this.state.darkTheme ? "/img/ok-dt.png" : "/img/ok.png"} /></div>
                <div className="badge2"><img src={this.state.darkTheme ? "/img/ok-dt.png" : "/img/ok.png"} /></div>
                {
                    !!this.props.firefox.isFirefox() && (
                        <div className="group-firefox">
                            <div className="firefox" onClick={() => this.props.tabs.open('https://help.qwant.com/fr/aide/qwant-com/add-qwant-on-desktop/sur-firefox/')}>{this.props.t("Comment_changer_cela_sur_Firefox.message")}</div>
                            <div className="external-link" onClick={() => this.props.tabs.open('https://help.qwant.com/fr/aide/qwant-com/add-qwant-on-desktop/sur-firefox/')}><img src={this.state.darkTheme ? "/img/external-link-blue-dt.png" : "/img/external-link-blue.png"} /></div>
                        </div>
                    )
                }
                <div className="button-menu" onClick={() => this.setState({ open: !this.state.open })}><img src={this.state.darkTheme ? "/img/menu-dt.png" : "/img/menu.png"} /></div>
                {
                    this.state.open && (
                        <div className="menu">
                            <div className="link-politic">
                                <div onClick={() => this.props.tabs.open('https://about.qwant.com/fr/legal/confidentialite/')}>{this.props.t("Politique_de_confidentialite.message")}</div>
                                <div className="external-link-politic"><img src={this.state.darkTheme ? "/img/external-link.png" : "/img/external-link-black.png"} /></div>
                            </div>
                            <div className="link-contact">
                                <div onClick={() => this.props.tabs.open('https://about.qwant.com/fr/contact/')} >{this.props.t("Contactez_nous.message")}</div>
                                <div className="external-link-contact"><img src={this.state.darkTheme ? "/img/external-link.png" : "/img/external-link-black.png"} /></div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default withTranslation("messages")(firefox((Welcome)))

