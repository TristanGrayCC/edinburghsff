import React, { lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";

import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './theme/theme';

import { ConfirmProvider } from "material-ui-confirm";

// MUI Components
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Custom Components
import Map from './components/Map';
import MainPanel from './components/MainPanel';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Regular Pages
const Welcome = lazy(() => import('./pages/public/Welcome'));
const Links = lazy(() => import('./pages/public/Links'));
const Events = lazy(() => import('./pages/public/Events'));
const About = lazy(() => import('./pages/public/About'));
const NotFound = lazy(() => import('./pages/public/NotFound'));
const Signin = lazy(() => import('./pages/public/Signin'));

// Dynamic Pages
const Pages = lazy(() => import('./pages/public/Pages'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLinks = lazy(() => import('./pages/admin/AdminLinks'));
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'));
const AdminMap = lazy(() => import('./pages/admin/AdminMap'));
const AdminPages = lazy(() => import('./pages/admin/AdminPages'));

// Assets
import './App.scss';

const styleLayout = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgb(0, 0, 0)",
  position: "relative",
}

const styleLoader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: "100%",
  minHeight: "300px"
}

function App() {
  const renderLoader = () => {
    return (
      <Box style={styleLoader}>
        <CircularProgress />
      </Box>
    )
  }
  return (
    <ThemeProvider theme={customTheme}>
      <Box style={styleLayout} className="sff">
        <Map />
        <ConfirmProvider>
          <Suspense fallback={renderLoader()}>
            <Routes>
              <Route path="/" element={<MainPanel />}>
                <Route path="welcome" element={<Welcome />} />
                <Route path="signin" element={<Signin />} />
                <Route path="links/:classification" element={<Links />} />
                <Route path="links" element={<Links />} />
                <Route path="about" element={<About />} />
                <Route path="events/:eventID/:eventTitle" element={<Events />} />
                <Route path="events" element={<Events />} />
                <Route path="pages/:pageSlug" element={<Pages />} />
                <Route path="pages" element={<Pages />} />
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path='links' element={<AdminLinks />} />
                  <Route path='events' element={<AdminEvents />} />
                  <Route path='map' element={<AdminMap />} />
                  <Route path='pages' element={<AdminPages />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ConfirmProvider>
      </Box>
      <Analytics />
    </ThemeProvider>
  )
}

export default App;
