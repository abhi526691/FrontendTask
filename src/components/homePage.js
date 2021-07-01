import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {withRouter} from 'react-router-dom'
import {Typography, Button} from '@material-ui/core';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import GovtOfHPLogo from './../assets/govt_of_hp_logo.png'
import GovtOfHaryanaLogo from './../assets/Haryana Govt logo.jpeg'
import SakshamHaryanaLogo from './../assets/Saksham Haryana logo.png'
import SamarthLogo from './../assets/samarth_logo.png'
import SSALogo from './../assets/ssa_logo.png'
import Footer from '../components/footer';
import {trackPage, trackUser, trackEvent} from 'react-with-analytics';
import {dispatchCustomEvent} from "../utils";
import Toolbar from "@material-ui/core/Toolbar";

const styles = {
    dashboardLink: {
        color: 'white',
    },
    brandingContainer: {
        marginTop: "2%",
    },
    subHeading: {
        position: "absolute",
        bottom: "20%",
        color: 'white',
        fontSize: "1rem"
    }
};

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.thisIsTheEndMyOnlyFriendTheEnd = React.createRef();
        this.state = {width: 0, height: 0};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.getLinkElement = this.getLinkElement.bind(this);
        this.getBranding = this.getBranding.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        dispatchCustomEvent({type: 'titleChange', data: {title: 'Mission Prerna: Supportive Supervision Dashboard'}});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    getLinkElement(text, route, shouldFloatRight, subHeading) {
        let linkStyle, divStyle;
        if (shouldFloatRight && this.state.width >= 1280) {
            linkStyle = {textDecoration: 'none', float: "right"};
            divStyle = {float: "right", position: "relative"};
        } else {
            linkStyle = {textDecoration: 'none'};
            divStyle = {};
        }
        return (
            <Grid item style={{width: this.state.width / 3}} alignContent="center" alignItems="center" xs={12} sm={6}>
                <Link
                    style={linkStyle}
                    className="App-link Dashboard-Links"
                    to={route}>
                    <Paper className="route-link" elevation={1} square={true} style={divStyle}>
                        <Typography variant="h5" component="h3" className="dashboard-link-title" align="center">
                            {text}
                        </Typography>
                        {subHeading !== "" && this.state.width > 600 &&
                        <Typography variant="h6" component="h6" style={styles.subHeading}>
                            {subHeading}
                        </Typography>
                        }

                    </Paper>
                </Link>
            </Grid>
        );
    }

    scrollToBottom() {
        trackEvent('HomePage', 'View Dashboard', 'Click');
        try {
            this.thisIsTheEndMyOnlyFriendTheEnd.current.scrollIntoView({behavior: "smooth"});
        } catch (e) {
        }
    }


    getBranding(containerClass) {
        return (
            <Grid container spacing={40} justify="center" alignContent="center" alignItems="center"
                  className={containerClass}>
                <Grid className="branding-div" item xs={4} justify="center" alignContent="center" alignItems="center">
                    <img className="branding-image" src={GovtOfHPLogo} alt="govtOfHPLogo"/>
                </Grid>
                <Grid className="branding-div" item xs={4} justify="center" alignContent="center" alignItems="center">
                    <img className="branding-image" src={SamarthLogo} alt="samarthLogo"/>
                </Grid>
                <Grid className="branding-div" item xs={4} justify="center" alignContent="center" alignItems="center">
                    <img className="branding-image2" src={SSALogo} alt="SSALogo"/>
                </Grid>
            </Grid>
        );
    }

    render() {
        const {classes} = this.props;
        const dashboards = [
            {
                text: 'State Dashboard',
                link: '/state-dashboard/'
            },
            {
                text: 'District Dashboard',
                link: '/district-dashboard/'
            },
            {
                text: 'Block Dashboard',
                link: '/block-dashboard/'
            },
            {
                text: 'School Dashboard',
                link: '/school-dashboard/'
            }
        ];

        return (
            <header className="App-header">
                <div className="App-background" style={{height: (this.state.height - 84) + 'px'}}>
                    <div className="center-section">
                        <div className="center-banner">
                            <div className={'center-banner-text'}>        
                        <div className="App-background" style={{height: (this.state.height - 84) + 'px'}}>
                    <div className="center-section1">
                        <div className="center-banner">
                            <div className={'center-banner-text'}>
                            This Dashboard shows the compliance level and insights from the school visits recorded on Prerna Gunvatta App.
                            </div>
                            <br></br>
                            <div className={'center-banner-text'}>
                            
यह डैशबोर्ड मेंटर्स यानि SRGs, ARPs एवं DIET मेंटर्स द्वारा प्रेरणा गुणवत्ता एप पर दर्ज की गई मासिक स्कूल विज़िट की जानकारी को दर्शाता है ।
                            </div>
                            
                        </div>
                  
                         </div>
                         
                         <div class="home-link-item">
                             <a href="#" style={{color:'white', textDecoration: 'none'}}>
                             {/* <Link to="google.com" style={{ textDecoration: 'none' }}> */}
                             Monthly Compliance Dashboard<br></br> </a>
                             <div>मासिक लक्ष्य के सापेक्ष सहयोगात्मक टीमों द्वारा की गई विज़िट की स्थिति</div>
                             {/* </a> */}
                         </div>
                         <div class="home-link-item">
                             <a href="#" style={{color: 'white',textDecoration: 'none'}}>
                             Monthly School Insights Dashboard-Primary<br></br>
                             <div>प्राथमिक विद्यालयों में की गई विज़िट से मिली विद्यालयों की जानकारी</div>
                             </a>
                         </div>
                         <div class="home-link-item">
                             <a href="#" style={{color:'white', textDecoration: 'none'}}>
                             Monthly School Insights Dashboard- Upper Primary<br></br>
                             <div>उच्च प्राथमिक विद्यालयों में की गई विज़िट से मिली विद्यालयों की जानकारी</div>
                             </a>
                         </div>
                
                </div>
                            </div>
                            
                        </div>
                  
                         </div>
                  
                </div>



            </header>
        );
    }
}

HomePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);

