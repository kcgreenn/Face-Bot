import React, { useState } from 'react';

import {
  makeStyles,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  ListItemIcon,
  ListItemText,
  Hidden,
  ListItem
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

interface Props {}

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '80vh',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      overflowX: 'hidden'
    }
  }
}));

const NewPost: React.FC<Props> = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [newPost, setnewPost] = useState({
    topic: '',
    text: ''
  });
  const [formErrors, setFormErrors] = useState({ email: null, password: null });

  //   Make dialog responsive
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const target = e.currentTarget.name;
    const value = e.currentTarget.value;
    setnewPost({
      ...newPost,
      [target]: value
    });
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // TODO dispatch new post request
    // Reset Form
    setnewPost({ topic: '', text: '' });
  };
  return (
    <>
      <ListItem button onClick={handleClickOpen}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <Hidden>
          <ListItemText>New Post</ListItemText>
        </Hidden>
      </ListItem>
      <Dialog
        fullScreen={fullScreen}
        className={classes.root}
        open={open}
        onClose={handleClose}
        aria-labelledby="new-post-dialog-title"
      >
        <DialogTitle id="new-post-dialog-title">New Post</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="newPostTopic"
              label="Topic"
              name="topic"
              autoComplete="topic"
              type="text"
              fullWidth
              value={newPost.topic}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              id="new-post-text"
              type="text"
              value={newPost.text}
              name="text"
              onChange={handleInputChange}
              autoComplete="new-post-text"
              label="Text"
              multiline={true}
              rows={5}
            ></TextField>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleClose}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewPost;
