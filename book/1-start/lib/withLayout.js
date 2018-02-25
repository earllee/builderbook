/* eslint-disable */
import React from 'react';
import Reboot from 'material-ui/Reboot';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '../components/Header';
import getContext from './context';

function withLayout(BaseComponent) {
  class App extends React.Component {
    componentWillMount() {
      this.pageContext = this.props.pageContext || getContext();
    }

    componentDidMount() {
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return (
        <div>
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            <Reboot />
            <div>
              <Header {...this.props} />
              <BaseComponent {...this.props} />
            </div>
          </MuiThemeProvider>
        </div>
      );
    }
  }

  App.propTypes = {
    pageContext: PropTypes.object, // eslint-disable-line
  };

  App.defaultProps = {
    pageContext: null,
  };

  App.getInitialProps = ctx => {
    if (BaseComponent.getInitialProps) {
      return BaseComponent.getInitialProps(ctx);
    }

    return {};
  };

  return App;
}

export default withLayout;
