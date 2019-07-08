import React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

function MyFunctionComponent(props) {

  let classes = useStyles();

  return (
    <div>
      <Button variant="contained" color="primary" className={classes.button}>
        Hello World
      </Button>
      <IconButton className={classes.button}>
        <DeleteIcon />
      </IconButton>
      <TextField />
    </div>
  );
}

class App extends React.Component {


  render() {
    return (
      <MyFunctionComponent />
    );
  }
}

export default App;