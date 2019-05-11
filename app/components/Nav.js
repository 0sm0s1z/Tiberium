// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';
import { FaAngular, FaHotjar, FaWhmcs, FaShieldAlt } from 'react-icons/fa';
import { IconContext } from "react-icons";

export default class Nav extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
       hideCompleted: false,
    };
  }

  render() {
    return (
      <div className={styles.navbar}>
        <div className={styles.navwidget}>
          <img className={styles.navlogo} width="75" src="img/logo.png" />
        </div>
        <div className={styles.navwidget}>
          <IconContext.Provider value={{ size: 60 }}>
            <div className={styles.navicon}>
              <FaShieldAlt />
            </div>
          </IconContext.Provider>
        </div>
        <div className={styles.navwidget}>
          <IconContext.Provider value={{ size: 60 }}>
            <div className={styles.navicon}>
              <FaHotjar />
            </div>
          </IconContext.Provider>
        </div>
        <div className={styles.navwidget}>
          <IconContext.Provider value={{ size: 60 }}>
            <div className={styles.navicon}>
              <FaWhmcs />
            </div>
          </IconContext.Provider>
        </div>
      </div>
    );
  }
}
