import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";

// Context
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

// MUI
import Box from '@mui/material/Box';

// Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export default function Navigation() {

  const { isExploded } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdmin, setIsAdmin] = useState(false);

  const style = {
    navigation: {
      display: "flex",
      position: "relative",
      justifyContent: "center",
      gap: "1rem",
      padding: "0.5rem 0",
    },
    icon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: "0.5rem",
      left: "0.5rem",
      color: "rgb(255, 255, 255)",
      zIndex: 10000,
    }
  }

  const handleClickBack = () => {
    navigate("/");
  }

  useEffect(() => {
    location.pathname.includes("/admin") ? setIsAdmin(true) : setIsAdmin(false);
  }, [location]);

  return (
    <>
      {isExploded &&
        <Box style={style.icon} onClick={() => handleClickBack()}>
          <ChevronLeftIcon />
        </Box>
      }
      {isAdmin && <Box style={style.navigation} className="sff-navigation">
        <Link to='/admin'>Dashboard</Link>
        <Link to='/admin/locations'>Locations</Link>
        <Link to='/admin/events'>Events</Link>
        <Link to='/admin/links'>Links</Link>
        <Link to='/admin/pages'>Pages</Link>
      </Box>}
      {!isAdmin && <>
      <Box style={style.navigation} className="sff-navigation">
        <Link to='/events'>Events</Link>
        <Link to='/links'>Resources</Link>
      </Box>
      </>}
    </>
  );
}
