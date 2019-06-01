// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';

import { withStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import { FaBroadcastTower } from 'react-icons/fa';
import { IconContext } from "react-icons";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import Dashboard from './Dashboard';

const shell = require('node-powershell');
const remote = require('electron').remote;

type Props = {};

const StyledSelect = withStyles({
  root: {
    background: '#3e3b3c',
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .1)',
    color: 'white',
    minWidth: 200,
    minHeight: 50,
    fontSize: "20px",
    color: "#fff",
  },
  MenuItem: {
    paddingTop: "20px",
  },
  selectMenu: {
    paddingTop: "15px",
  }
})(Select);

const StyledFormControl = withStyles({
  root: {
    color: "#fff",
  },
})(FormControl);

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
       hideCompleted: false,
       hcdata: '',
       ecdata: '',
       scantype: 'Quick Scan',
       scanning: false,
       hcscanning: false,
       ecscanning: false,
       scan: true,
       st: 0,
    };
    this.startScan = this.startScan.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  startScan() {
    let ps = new shell({
      executionPolicy: 'Bypass',
      noProfile: true
    });
    this.setState({
      scanning: true,
      ecscanning: true,
      hcscanning: true,
    })

    ps.addCommand('Invoke-Expression (New-Object Net.WebClient).DownloadString("https://raw.githubusercontent.com/0sm0s1z/Tiberium/master/tiberium.ps1")')
    ps.addCommand('Get-HostCapabilities;')
    ps.invoke()
    .then(output => {
      let blob = JSON.parse(output);
      console.log(blob)
      this.setState({
        hcdata: blob,
        hcscanning: false,
      })
    })
    .catch(err => {
      console.log(err);
      ps.dispose();
      this.setState({
        hcscanning: false,
      })
    });

    let ps2 = new shell({
      executionPolicy: 'Bypass',
      noProfile: true
    });
    ps2.addCommand('Invoke-Expression (New-Object Net.WebClient).DownloadString("https://raw.githubusercontent.com/0sm0s1z/Tiberium/master/tiberium.ps1")')

    if (this.state.st === 1) {
      ps2.addCommand('Get-EgressPorts -QuickScan')
      ps2.invoke()
      .then(output => {
        let blob = JSON.parse(output);
        console.log(blob)
        this.setState({
          ecdata: blob,
          scanning: false,
          ecscanning: false,
        })
      })
      .catch(err => {
        console.log(err);
        ps2.dispose();
        this.setState({
          scanning: false,
          ecscanning: false,
        })
      });
    } else {
      ps2.addCommand('Get-EgressPorts')
      ps2.invoke()
      .then(output => {
        let blob = JSON.parse(output);
        console.log(blob)
        this.setState({
          ecdata: blob,
          scanning: false,
          ecscanning: false,
        })
      })
      .catch(err => {
        console.log(err);
        ps2.dispose();
        this.setState({
          scanning: false,
          ecscanning: false,
        })
      });
    }
  }
  handleChange(event) {
    console.log(event.target.value)
    this.setState({
      scantype: event.target.value,
      st: event.target.value,
      });
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">

        <div className={styles.maincont}>
          <div className={styles.summary}>
            <h1>Scan Summary</h1>

              <div className={styles.controlbar}>
                <Grid
                  container
                  direction="row"
                  spacing={3}
                >
                  <Grid item xs={3}>
                    <FormControl>
                      <InputLabel><em className={styles.form}>Scan Mode</em></InputLabel>
                      <StyledSelect
                        className={styles.form}
                        value={this.state.scantype}
                        onChange={this.handleChange}
                        displayEmpty={true}
                      >
                        <MenuItem value={1} className={styles.formselect}>Quick Scan</MenuItem>
                        <MenuItem value={2} className={styles.formselect}>Top 1024</MenuItem>
                        <MenuItem value={3} className={styles.formselect}>Full Scan</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel className={styles.form}><em className={styles.formlabel}>Execute Scan</em></InputLabel>
                    <Button
                      onClick={this.startScan}
                      variant="contained"
                      color="primary"
                      size="large"
                      className={styles.startbtn}
                    >
                      Scan&nbsp;&nbsp;&nbsp;<span className="iconwrapper"><FaBroadcastTower /></span>
                    </Button>
                  </Grid>
                </Grid>
            </div>
              <br/>
              <br/>

            { this.state.scan ? <Dashboard hcdata={this.state.hcdata} ecdata={this.state.ecdata} scanning={this.state.scanning} ecscanning={this.state.ecscanning} hcscanning={this.state.hcscanning}/> : null }

          </div>
        </div>
      </div>
    );
  }
}
