import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';

class Index extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      displayName: PropTypes.string,
      email: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    user: null,
  };

  render() {
    const { user } = this.props;
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Index page on Harbor</title>
          <meta name="description" content="This is description of Index page" />
        </Head>
        <p>Content on Index page</p>
        <p>Email: {user.email}</p>
      </div>
    );
  }
}

export default withAuth(withLayout(Index));
