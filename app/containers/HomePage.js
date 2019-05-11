// @flow
import React, { Component } from 'react';
import Home from '../components/Home';
import Nav from '../components/Nav';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import yellow from '@material-ui/core/colors/yellow';
import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import 'typeface-roboto';

type Props = {};

const defaultTheme = createMuiTheme({
  palette: {
    secondary: purple,
    primary: {
      main: '#2f7a32'
    }
  },
  typography: {
    fontFamily: ['Roboto', 'Helvetica'],
  }
})

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit *3,
    width: '100%'
  },
  flex: {
    flex: 1
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})


export default class HomePage extends Component<Props> {
  props: Props;
  state = {
    theme: defaultTheme
  }

  render() {
    return (
      <MuiThemeProvider theme={this.state.theme}>
        <Nav />
        <Home />
      </MuiThemeProvider>
    );
  }
}
