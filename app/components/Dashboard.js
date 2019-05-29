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

type Props = {};

export default class Dashboard extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
       hideCompleted: false,
       hcdata: '',
       ecdata: '',
       scantype: 'Quick Scan'
    };
  }

  render() {
    return (
      <div>
        <div className={styles.sumbox}>
          <h3>Execution Details</h3>
            User Context: {this.props.hcdata.UserContext}<br />
            Local Administrator: {this.props.hcdata.LocalAdmin}<br />
            Command Prompt: {this.props.hcdata.ExecCmd}<br />
            PowerShell: {this.props.hcdata.ExecPsh}<br />
            Net Commands: {this.props.hcdata.ExecNet}<br />
            WMIC: {this.props.hcdata.ExecWmic}<br />
            Arbitrary EXEs: allowed
        </div>

        <div className={styles.sumbox}>
          <h3>Egress Controls</h3>
            Outbound Ports: {this.props.ecdata.OpenPortNum}<br />
            Outbound ICMP: {this.props.ecdata.OutboundICMP}<br />
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
    );
  }
}
