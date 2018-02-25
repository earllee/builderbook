import Link from 'next/link';

import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';

import { styleToolbar } from './SharedStyles';

const Header = () => (
  <div>
    <Toolbar style={styleToolbar}>
      <Grid container direction="row" justify="space-around" align="center">
        <Grid item xs={12} style={{ textAlign: 'right' }}>
          <Link prefetch href="/index">
            <a style={{ margin: '0px 20px 0px auto' }}>Home</a>
          </Link>
          <Link prefetch href="/login">
            <a style={{ margin: '0px 20px 0px auto' }}>Log In</a>
          </Link>
          <Link prefetch href="/about">
            <a style={{ margin: '0px 20px 0px auto' }}>About</a>
          </Link>
        </Grid>
      </Grid>
    </Toolbar>
  </div>
);

export default Header;
