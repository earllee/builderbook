import React from 'react';
import Snackbar from 'material-ui/Snackbar';

let openSnackbarFn;

class Notifier extends React.Component {
  state = {
    open: false,
    message: '',
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  handleSnackbarRequestClose = () => {
    this.setState({
      open: false,
      message: '',
    });
  };

  openSnackbar = ({ message }) => {
    this.setState({ open: true, message });
  };

  render() {
    const message = (
      <span id="snackbar-message-id" dangerouslySetInnerHTML={{ __html: this.state.message }} />
    );

    return (
      <Snackbar
        open={this.state.open}
        message={message}
        onClose={this.handleSnackbarRequestClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={5000}
        SnackbarContentProps={{
          'aria-describedby': 'snackbar-message-id',
        }}
      />
    );
  }
}

export function openSnackbar({ message }) {
  openSnackbarFn({ message });
}

export default Notifier;
