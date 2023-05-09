import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
}

const SnackBar = () => {
  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
  });

  const handleClick = (Transition = SlideTransition) => () => {
    setState({
      open: true,
      Transition,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  handleClick();

  return (
    <div>
      {/* <Button onClick={handleClick(GrowTransition)}>Grow Transition</Button>
      <Button onClick={handleClick(Fade)}>Fade Transition</Button>
      <Button onClick={handleClick(SlideTransition)}>Slide Transition</Button> */}
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message="Received 1 Carbon Credit"
        key={state.Transition.name}
      />
    </div>
  );
}

export default SnackBar;