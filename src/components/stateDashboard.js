import React, { Component } from 'react';
import SimpleDropdown from './simpleDropdown'
import Iframe from 'react-iframe'
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Header from "../components/header"
import { trackEvent } from 'react-with-analytics';
import { getIP } from './../utils/ip';
import ReactPiwik from 'react-piwik';
import {dispatchCustomEvent} from "../utils";

const styles = {
    iFrameStyle: {
      pointerEvents: 'none'
    },
}
// const baseURL = 'http://134.209.177.56:3000'
const baseURL = 'http://165.22.209.213:3000'

export default class StateDashboard extends Component {
    state = {
        urlGrade: `${baseURL}/public/dashboard/3edc45c9-6a9c-4785-bbad-0c75a27c9ade`,
        urlLO: `${baseURL}/public/dashboard/3edc45c9-6a9c-4785-bbad-0c75a27c9ade`,
        value: 0,
        width: 0,
        height: 0
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.onLoadIframe = this.onLoadIframe.bind(this);
        this.showFile = this.showFile.bind(this);
        this.downloadPDF = this.downloadPDF.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    showFile(blob){
        console.log("Inside show file")
        var newBlob = new Blob([blob], {type: "application/pdf"})

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data;
        link.download="StateDashboard.pdf";
        link.click();
        setTimeout(() => {window.URL.revokeObjectURL(data)}, 100);
    }

    downloadPDF() {
        let url ="";
        if(this.state.value === 0){
            url = this.state.urlGrade;
        }else{
            url = this.state.urlLO;
        }
        const tab = this.state.value === 0 ? "Grade" : "LO";
        ReactPiwik.push(['trackEvent', 'State Dashbaord', 'Download Started', tab, tab]);
        fetch("https://html-printer.samagra.io/export/pdf?url=" + url)
        // fetch("http://0.0.0.0:3022/export/pdf?url=" + url)
            .then(r =>  r.blob())
            .then((s) => {
                console.log("Calling showFile now");
                this.showFile(s);
                ReactPiwik.push(['trackEvent', 'State Dashbaord', 'Download Completed', tab, tab]);
            });
    }

    onLoadIframe () {
        console.log("Iframe loaded");
    }

    handleChange = (event, value) => {
        if(value !== 2) this.setState({ value });
    };

    componentDidMount() {
        getIP().then((ip) => this.setState({ip}));
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        dispatchCustomEvent({type: 'titleChange', data: {title: 'State Level Dashboard'}});
      }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render(){
        const { value } = this.state;
        return (
            <div>
                <Header/>
                {/*<Tabs value={value} onChange={this.handleChange}>*/}
                {/*    <Tab label="Grade" />*/}
                {/*    <Tab label="Learning Outcome" />*/}
                {/*    <Tab*/}
                {/*        icon={<SaveAlt/>}*/}
                {/*        className="download"*/}
                {/*        onClick={() => {this.downloadPDF()}}>*/}
                {/*    </Tab>*/}
                {/*</Tabs>*/}

                {value === 0 && <Iframe ref="metabaseIframeID1"
                    url= {this.state.urlGrade}
                    width="100%"
                    height={this.state.height-64-48-24}
                    id="metabaseIframeID1"
                    className={styles.iFrameStyle}
                    display="initial"
                    onLoad={this.onLoadIframe}
                    position="relative"/>}

                {value === 1 && <Iframe ref="metabaseIframeID2"
                    url= {this.state.urlLO}
                    width="100%"
                    height={this.state.height-64-48-24}
                    id="metabaseIframeID2"
                    className={styles.iFrameStyle}
                    display="initial"
                    onLoad={this.onLoadIframe}
                    position="relative"/>}
            </div>
        );
    }
}
