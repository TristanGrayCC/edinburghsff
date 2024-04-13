import React from 'react';
import { Link, useNavigate } from "react-router-dom";

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// Context
import { useAuth } from '../context/AuthContext';

// Resources
import 'css.gg/icons/scss/chevron-left.scss'

export default function Footer({isExploded}) {

  const theme = useTheme();

  const styleWelcome={
    display: "block",
    height: "100%",
    overflow: "auto",
    padding: "1rem",
    maxWidth: "calc(300px - 2rem)",
  }

  return (
    <Box style={styleWelcome} className="sff-welcome">
      <Typography component="p" variant="p" color={theme.palette.brand.main}>
        Edinburgh SFF
      </Typography>
      <Typography component="p" variant="p" color="primary">
        Hub
      </Typography>
      <Typography component="p" variant="p" color="primary">
        Edinburgh SFF is a vibrant community of Science Fiction and Fantasy writers in Scotland.
      </Typography>
    </Box>
  );
}
