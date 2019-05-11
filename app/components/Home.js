// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';
import Button from '@material-ui/core/Button';
import { FaBroadcastTower } from 'react-icons/fa';
import { IconContext } from "react-icons";

const shell = require('node-powershell');
const remote = require('electron').remote;

type Props = {};


export default class Home extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
       hideCompleted: false,
       hcdata: '',
       ecdata: ''
    };
    this.startScan = this.startScan.bind(this);
  }
  startScan() {
    let ps = new shell({
      executionPolicy: 'Bypass',
      noProfile: true
    });

    ps.addCommand('Invoke-Expression (New-Object Net.WebClient).DownloadString("https://raw.githubusercontent.com/0sm0s1z/Tiberium/master/tiberium.ps1")')
    ps.addCommand('Get-HostCapabilities;')
    ps.invoke()
    .then(output => {
      let blob = JSON.parse(output);
      console.log(blob)
      this.setState({
        hcdata: blob
      })
    })
    .catch(err => {
      console.log(err);
      ps.dispose();
    });

    let ps2 = new shell({
      executionPolicy: 'Bypass',
      noProfile: true
    });
    ps2.addCommand('Invoke-Expression (New-Object Net.WebClient).DownloadString("https://raw.githubusercontent.com/0sm0s1z/Tiberium/master/tiberium.ps1")')
    ps2.addCommand('Get-EgressPorts')
    ps2.invoke()
    .then(output => {
      let blob = JSON.parse(output);
      console.log(blob)
      this.setState({
        ecdata: blob
      })
    })
    .catch(err => {
      console.log(err);
      ps2.dispose();
    });
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <div className="dragbar"></div>
        <div className={styles.maincont}>
          <div className={styles.summary}>
            <h1>Scan Summary</h1>

            <div className={styles.sumbox}>
              <h3>Execution Details</h3>
                User Context: {this.state.hcdata.UserContext}<br />
                Local Administrator: {this.state.hcdata.LocalAdmin}<br />
                Command Prompt: {this.state.hcdata.ExecCmd}<br />
                PowerShell: {this.state.hcdata.ExecPsh}<br />
                Net Commands: {this.state.hcdata.ExecNet}<br />
                WMIC: {this.state.hcdata.ExecWmic}<br />
                Arbitrary EXEs: allowed
            </div>

            <div className={styles.sumbox}>
              <h3>Egress Controls</h3>
                Outbound Ports: {this.state.ecdata.OpenPortNum}<br />
                Outbound ICMP: {this.state.ecdata.OutboundICMP}<br />
                Domain Whitelisting: <br />
                Social Media Connectivity: <br />
            </div>
            <div className={styles.sumbox}>
              <h3>Malware Detection</h3>
                Meterpreter: <br />
                Malicious HTA: <br />
                Netcat: <br />
            </div>
          </div>
          <div className={styles.mast}>
            Click below to initiate a Command and Control scan. <br /><br />
            <Button
              onClick={this.startScan}
              variant="contained"
              color="primary"
              size="large"
              className={styles.startbtn}
            >
              Scan&nbsp;&nbsp;&nbsp;<span className="iconwrapper"><FaBroadcastTower /></span>
            </Button>

          </div>
        </div>
      </div>
    );
  }
}
