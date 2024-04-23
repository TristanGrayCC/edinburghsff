import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

import ReactMarkdown from 'react-markdown';

import {imageURL} from '../../utils/utils';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

import { styled } from '@mui/material/styles';

// Custom UI
import EventsDetailsImage from '../EventsDetailsImage';

// Icons
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Theme helpers
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    backgroundColor: '#383838',
    color: '#fff',
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: '#383838',
    color: '#fff',
  },
}));

const EventDetails = ({ selectedEvent, isOpen, onCloseCallback, isLoadingEvent }) => {

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const style = {
    title: {
      textAlign: "center"
    },
    date: {
      marginBottom: "1rem"
    },
    meta: {
      textAlign: "center"
    },
    description: {
      backgroundColor: "#f5f5f5",
      padding: "1rem",
      marginBottom: "1rem",
      marginTop: "1rem"
    },
  }

  useEffect(() => {
    setCurrentEvent(selectedEvent);
    setIsOpenDialog(isOpen);
  }, [selectedEvent, isOpen, isLoadingEvent]);

  const eventDate = () => {
    if (!currentEvent.eventStart) return;

    let displayDate = "";

    if (currentEvent.eventIsAllDay) {
      const _startDate = dayjs(currentEvent.eventStart.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YYYY');
      const _endDate = dayjs(currentEvent.eventEnd.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YYYY');
      displayDate = _startDate === _endDate ? _startDate : `${_startDate} to ${_endDate}`;
    } else {
      const _startDate = dayjs(currentEvent.eventStart.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YYYY, HH:mm');
      const _endDate = dayjs(currentEvent.eventEnd.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('HH:mm');
      displayDate = `${_startDate} to ${_endDate}`;
    }

    return <>
      <EventAvailableOutlinedIcon />
      <Typography component="p" style={style.date}>
        When: {displayDate}
      </Typography>
    </>;
  }

  const cleanUrl = (url) => {
    if (!url) return;
    return url.replace(/^(https?:\/\/)?(www\.)?|\/$/g, '');
  }

  const handleView = () => {
    window.open(currentEvent.url, '_blank');
  };

  const handleCloseDetails = () => {
    onCloseCallback();
  };

  return (
    <BootstrapDialog
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      open={isOpenDialog}
      onClose={handleCloseDetails}
      scroll="paper"
      aria-labelledby="add-dialog-title">
      <DialogTitle id="add-dialog-title" sx={style.title}>
        <Typography variant="h2" component="span">{currentEvent.title}</Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseDetails}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        { isLoadingEvent &&
          <>
            <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px" }}>
              <CircularProgress />
            </Box>
          </>
        }
        { !isLoadingEvent && <>
          { currentEvent?.image && (
          <EventsDetailsImage image={imageURL(currentEvent?.image, 'medium')} alt={currentEvent?.title} />
          )}
          <Box style={style.meta}>
            {eventDate()}
            <LocationOnOutlinedIcon />
            <Typography component="p" variant='p'> {currentEvent.eventLocation}</Typography>
          </Box>
          <Box style={style.description}>
            <ReactMarkdown children={currentEvent.description} />
            <Button onClick={handleView} color='brand' endIcon={<LaunchOutlinedIcon />}>Go to Event site</Button>
          </Box>
        </>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDetails} color='brand'>Close</Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default EventDetails;