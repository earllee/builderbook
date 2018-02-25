import Head from 'next/head';
import withLayout from '../lib/withLayout';

const About = () => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>About page</title>
      <meta name="description" content="This is description of Index page" />
    </Head>
    <p>My name is Earl Lee.</p>
  </div>
);

export default withLayout(About);
