import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getDocs, collection, query } from 'firebase/firestore';
import { db } from "../firebase";
import GoogleMapReact from 'google-maps-react-markers';
import { useHead } from 'hoofd';

// Contexts
import { useApp } from '../context/AppContext';

// MUI
import Box from '@mui/material/Box';

// Custom UI
import MapPanel from './MapPanel';
import MapPin from './MapPin';
import MapModal from './modals/MapModal';
import Spinner from './Spinner';
import Filter from './Filter';
import Logo from './Logo';

// Helpers
import { slugify } from '../utils/utils';

export default function Map() {

  const {
    mapLocations,
    setMapLocations,
    focusMapPin,
    isExpanded,
    setIsExpanded,
    isExploded,
    setIsExploded,
    mapSearchText,
    setMapSearchText
  } = useApp();

  const params = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const location = useLocation();

  useHead({
    title: "Edinburgh SFF",
    language: 'en',
    metas: [{ name: 'description', content: "The writers hub. Writer-friendly cafes, bookshops and venues" }],
  });

  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const [mapReady, setMapReady] = useState(false);
  const [pinData, setPinData] = useState({});

  const mapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
    mapId: import.meta.env.VITE_GOOGLEMAPS_MAP_ID
  }

  const defaultLocation = {
    center: {
      lat: 55.9579741,
      lng: -3.1966372,
    },
    zoom: 13
  }

  const style = {
    map: {
      display: "block",
      position: "relative",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      opacity: mapReady ? 1 : 0,
      transition: "opacity 2000ms",
    },
    logo: {
      display: "flex",
      position: "absolute",
      top: "0",
      right: "0",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }
  }

  const getLocations = async () => {
    const data = await getDocs(query(collection(db, "locations")));
    const docs = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      hidden: false,
      focus: false
    }));
    setMapLocations(docs);
    setFilteredLocations(docs);
    setIsLoaded(true);
  }

  const centerMapOnPin = (pin) => {
    if (!pin) return;
    mapRef.current.panTo({
      lat: parseFloat(pin.lat), lng: parseFloat(pin.lng)
    });
    mapRef.current.setZoom(18);
  }

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    handleOnSearchMap();
  }, [mapSearchText]);

  useEffect(() => {
    const thisPin = mapLocations.find(location => location.id === focusMapPin);
    if (!thisPin) return;
    centerMapOnPin(thisPin);
  }, [focusMapPin]);

  useEffect(() => {
    // Runs every time the URL changes or the mapLocations updates
    if (location.pathname === '/') {
      setIsOpenDialog(false);
      return;
    }
    if (!params.id || !mapLocations.length) {
      return;
    }

    const place = mapLocations.find(location => location.id === slugify(params.place));
    if (place) {
      setPinData(place);
      setIsOpenDialog(true);
    }
  }, [mapLocations, params.id]);

  const onGoogleApiLoaded = ({map}) => {
    mapRef.current = map;
    setMapReady(true);
  }

  const onClickPin = (data) => {
    setPinData(data);
    setIsOpenDialog(true)
    navigate(`/places/${slugify(data.title)}`);
  }

  const handleCloseDetails = () => {
    setPinData({});
    setIsOpenDialog(false);
    navigate(`/`);
  };

  const handleFilterMap = (tag) => {
    const filtered = tag ? mapLocations.filter(entry => entry.tags.includes(tag)) : mapLocations;
    setFilteredLocations(filtered);
  }

  const handleOnSearchMap = () => {
    const filtered = mapLocations.filter(entry => entry.title.toLowerCase().includes(mapSearchText.toLowerCase()));
    if (mapSearchText === "") {
      setFilteredLocations(mapLocations);
    } else {
      setFilteredLocations(filtered);
    }
  }

  return (
    isLoaded ?
      <>
        <Box style={style.map} className="sff-map">
          <GoogleMapReact
            apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}
            onGoogleApiLoaded={onGoogleApiLoaded}
            options={mapOptions}
            loadingContent={<Spinner />}
            defaultCenter={defaultLocation.center}
            defaultZoom={defaultLocation.zoom}
            >
            {filteredLocations.map((place, i) => (
              <MapPin
                onClickPin={onClickPin}
                key={i}
                data={place}
                lat={parseFloat(place.lat)}
                lng={parseFloat(place.lng)}
              />
            ))}
          </GoogleMapReact>
        </Box>
        <Box style={style.logo} className="sff-logo">
          <Logo />
        </Box>
        {!isExploded && <Filter onFilterMap={handleFilterMap} onSearchMap={handleOnSearchMap} />}
        <MapModal
          pinData={pinData}
          isOpenDialog={isOpenDialog}
          handleCloseDetails={handleCloseDetails}
        />
        <MapPanel onSearchMap={handleOnSearchMap}/>
      </>
    : <Spinner />
  )
}

