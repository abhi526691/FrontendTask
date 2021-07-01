import React, {Component} from 'react';
import SimpleDropdown from './simpleDropdown'
import Iframe from 'react-iframe'
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {withRouter} from 'react-router';
import {Typography, Button} from '@material-ui/core';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Header from "../components/header"
import {trackEvent} from 'react-with-analytics';
import {getIP} from './../utils/ip';
import ReactPiwik from 'react-piwik';
import {baseURLPrinter} from './../configs'
import {dispatchCustomEvent} from "../utils";

const styles = {
    iFrameStyle: {
        pointerEvents: 'none'
    },
}

// const baseURL = 'http://134.209.177.56:3000'
const baseURL = 'http://165.22.209.213:3000'
class SchoolDashboard extends Component {

    state = {
        allData: [],
        districts: [],
        blocks: [],
        clusters: [],
        schools: [],
        url: "",
        selectedBlock: "",
        selectedCluster: "",
        selectedDistrict: "",
        selectedSchool: "",
        value: 0,
        years: ["2018-19", "2017-18"],
        selectedYear: "2018-19",
        width: 0,
        height: 0,
        ip: ""
    };

    handleChange = (event, value) => {
        if (value !== 2) this.setState({value}, () => {
            console.log(this.state.ip);
            const filters = {
                tab: this.state.value === 0 ? "Grade" : "LO",
                selectedYear: this.state.selectedYear,
                district: this.state.selectedDistrict,
                block: this.state.selectedBlock,
                cluster: this.state.selectedCluster,
                school: this.state.selectedSchool,
                ip: this.state.ip
            }
            trackEvent('School Dashbaord', 'View', JSON.stringify(filters));
            ReactPiwik.push(['trackEvent', 'School Dashbaord', 'View', JSON.stringify(filters), JSON.stringify(filters)]);
        });
    };

    constructor(props) {
        super(props);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.loadData = this.loadData.bind(this);
        this.onSelectDistrict = this.onSelectDistrict.bind(this);
        this.download = this.download.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
        this.showFile = this.showFile.bind(this);
        this.downloadPDF = this.downloadPDF.bind(this);
        this.loadData();
    }

    showFile(blob) {
        console.log("Inside show file")
        var newBlob = new Blob([blob], {type: "application/pdf"})

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data;
        link.download = "SchoolDashboard.pdf";
        link.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(data)
        }, 100);
    }

    downloadPDF() {
        let url = "";
        if (this.state.value === 0) {
            url = this.state.urlGrade;
        } else {
            url = this.state.urlLO;
        }
        const tab = this.state.value === 0 ? "Grade" : "LO";
        ReactPiwik.push(['trackEvent', 'School Dashbaord', 'Download Started', tab, tab]);
        fetch(baseURLPrinter + encodeURIComponent(url))
        // fetch("http://0.0.0.0:3022/export/pdf?url=" + url)
            .then(r => r.blob())
            .then((s) => {
                console.log("Calling showFile now");
                this.showFile(s);
                ReactPiwik.push(['trackEvent', 'School Dashbaord', 'Download Completed', tab, tab]);
            });
    }


    download(url) {
        fetch(url)
            .then(response => response.json())
            .then(json => {
                var districts = json['districts'];
                this.setState({allData: json, districts: districts});
            });
    }

    loadData() {
        console.log("Loading data...");
        const url = process.env.PUBLIC_URL + '/data.json';
        this.download(url);
    }

    onSelectDistrict = (district) => {
        const blocks = this.state.allData['Blocks-' + district];
        this.setState({
            blocks: blocks,
            selectedDistrict: district,
            urlGrade: `${baseURL}/public/dashboard/830d52fe-29dd-4305-ae45-9ba5c5b246ca?district=${district}`,
            urlLO: `${baseURL}/public/dashboard/830d52fe-29dd-4305-ae45-9ba5c5b246ca?district=${district}`
        });
    }

    onSelectBlock = (block) => {
        const schools = this.state.allData['Blocks-' + this.state.selectedDistrict + '-Schools-' + block];
        console.log("Block selected", block);
        // this.setState({schools: schools, selectedBlock: block});
        this.setState({
            schools: schools, selectedBlock: block,
            urlGrade: `${baseURL}/public/dashboard/5ea14558-25d6-4a91-af30-6b475079cc5d?block=${block}`,
            urlLO: `${baseURL}/public/dashboard/5ea14558-25d6-4a91-af30-6b475079cc5d?block=${block}`
        });
    }

    onSelectCluster = (cluster) => {
        console.log("Cluster selected", cluster);
        const filteredSchoolsForCluster = this.state.allData.filter((school, index, arr) => school.Cluster === cluster && school.Block === this.state.selectedBlock && school.District === this.state.selectedDistrict);
        var schoolNames = [...new Set(filteredSchoolsForCluster.map(school => school.SchoolName))];
        this.setState({schools: schoolNames, selectedCluster: cluster});
    }

    onSelectSchool = (selectedSchool) => {
        this.setState({selectedSchool: selectedSchool});
        this.setState({urlGrade: `${baseURL}/public/dashboard/8aa86357-a2db-4c39-ab6b-2b5bf79131a1?school=${selectedSchool}`})
        this.setState({urlLO: `${baseURL}/public/dashboard/8aa86357-a2db-4c39-ab6b-2b5bf79131a1?school=${selectedSchool}`})
    };

    onYearChange = (selectedYear) => {
        console.log(this.state.selectedSchool);
        if (this.state.selectedSchool !== "") {
            this.setState({selectedYear: selectedYear}, () => {
                this.onSelectSchool(this.state.selectedSchool);
            });
        } else {
            this.setState({selectedYear: selectedYear});
        }
    }

    componentDidMount() {
        getIP().then((ip) => this.setState({ip}));
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        dispatchCustomEvent({type: 'titleChange', data: {title: 'School Level Dashboard'}});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    render() {
        const {value, height, width} = this.state;
        return (
            <div>
                <Header/>
                <div>
                    {/* <Grid container spacing={0} style={{margin: 0, width: '100%'}}>
                        <Grid item xs>
                            <SimpleDropdown
                                title={"District"}
                                data={this.state.districts}
                                onSelect={this.onSelectDistrict}>
                            </SimpleDropdown>
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                title={"Block"}
                                data={this.state.blocks}
                                onSelect={this.onSelectBlock}>
                            </SimpleDropdown>
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                title={"School"}
                                data={this.state.schools}
                                onSelect={this.onSelectSchool}>
                            </SimpleDropdown>
                        </Grid>
                       
                    </Grid> */}
                    
                    
                    <Iframe url="http://159.65.152.166:3000/public/dashboard/aa8bd7c7-f977-442a-805e-0595becffb54"
                            width="100%"
                            // height="10px"
                            id="myId"
                            className="myClassname"
                            display="initial"
                            height="100%"
                            // styles={{height: "184px"}}
                            position="absolute"/>
              </div>
              </div>
        
        );
      
    }
}

export default withRouter(SchoolDashboard)
