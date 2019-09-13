import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  Typography,
  makeStyles,
  Divider,
  Button
} from '@material-ui/core';
import SideDrawer from '../Layout/SideDrawer';
import Header from '../Layout/Header';

import DeleteProfile from './DeleteProfile';
import { axiosInstance as axios, axiosInstance } from '../../App';
import { authContext } from '../../context/auth/AuthProvider';
import EditProfile from './EditProfile';

// TODO add profile props
interface Props {
  match: any;
}

const dtDrawerWidth = 240;
const mobDrawerWidth = 60;

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '80vh',
    width: `calc(100% - ${dtDrawerWidth}px)`,
    marginLeft: dtDrawerWidth,
    marginTop: '10vh',
    paddingLeft: '5vw',
    [theme.breakpoints.down('sm')]: {
      width: `calc(75% - ${mobDrawerWidth}px)`,
      marginTop: '5vh',
      marginLeft: '90px',
      paddingLeft: '0'
    }
  },
  notFound: {
    marginLeft: `${dtDrawerWidth}px`,
    marginTop: '64px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: `${mobDrawerWidth}px`
    }
  },
  secondColumn: {
    [theme.breakpoints.down('sm')]: {
      marginTop: '64px'
    }
  }
}));

const Profile: React.FC<Props> = ({ match }) => {
  const authCtxt = useContext(authContext);
  const classes = useStyles();
  const [profile, setProfile] = useState({
    handle: '',
    bio: '',
    createdDate: '',
    interests: '',
    following: ['']
  });

  const handle = match.params.handle;
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/profile/${handle}`);
        const { data } = res;
        if (data) {
          const interests = data.interests.join(', ');
          const following = data.following.join(', ');
          setProfile({
            handle: data.handle,
            bio: data.bio,
            createdDate: data.createdDate,
            interests,
            following
          });
        }
      } catch (err) {
        throw err;
      }
    })();
  }, [handle]);

  const followUser = async () => {
    try {
      if (authCtxt.isAuth) {
        await axiosInstance.patch(`/api/profile/follow/${handle}`);
        window.location.reload();
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      throw err;
    }
  };

  // Buttons for current user's profile
  const curUserBtn = (
    <>
      <Grid item container xs={12}>
        <EditProfile bio={profile.bio} interests={profile.interests} />
      </Grid>
      <Grid item container xs={12}>
        <DeleteProfile />
      </Grid>
    </>
  );

  // Buttons for other user's profile
  const otherUserBtn = (
    <>
      <Grid item container xs={12}>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          onClick={followUser}
        >
          Follow {profile.handle}
        </Button>
      </Grid>
      <Grid item container xs={12}>
        <Button fullWidth color="primary" variant="outlined">
          Go To {profile.handle}'s Feed
        </Button>
      </Grid>
    </>
  );
  let profileBtns = authCtxt.isAuth
    ? authCtxt.user.handle === handle
      ? curUserBtn
      : otherUserBtn
    : null;

  return (
    <>
      <Header />
      <SideDrawer />
      {profile.handle && (
        <Grid
          container
          justify="flex-start"
          alignItems="flex-start"
          className={classes.root}
        >
          <Grid item container xs={12} md={9} spacing={4}>
            <Grid item xs={12} md={9} container>
              <Grid item xs={12}>
                <Typography color="textPrimary" variant="h4">
                  {profile.handle}'s Profile
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid alignItems="baseline" container item xs={12} md={9}>
              <Grid item xs={12} md={3}>
                <Typography variant="h5">Bio:</Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <Typography variant="body1">{profile.bio}</Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid
              spacing={0}
              alignItems="baseline"
              container
              item
              xs={12}
              md={9}
            >
              <Grid item xs={12} md={3}>
                <Typography variant="h5">Interests:</Typography>
              </Grid>
              <Grid item xs={6} md={9}>
                <Typography variant="body1">{profile.interests}</Typography>
              </Grid>
            </Grid>
            <Grid
              spacing={0}
              alignItems="baseline"
              container
              item
              xs={12}
              md={9}
            >
              <Grid item xs={12} md={3}>
                <Typography variant="h5">Following:</Typography>
              </Grid>
              <Grid item xs={6} md={9}>
                <Typography variant="body1">{profile.following}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            spacing={4}
            item
            container
            xs={12}
            md={2}
            className={classes.secondColumn}
          >
            {profileBtns}
          </Grid>
        </Grid>
      )}
      {!profile.handle && (
        <Typography className={classes.notFound} variant="h5">
          Could Not Find User's Profile
        </Typography>
      )}
    </>
  );
};

export default Profile;