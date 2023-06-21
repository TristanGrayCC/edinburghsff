import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";

import ReactMarkdown from 'react-markdown';

import { getDocs, collection, query, orderBy, where  } from 'firebase/firestore';
import { db } from "../firebase";

// MUI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// Custom Components
import PageHeading from '../components/PageHeading';

const styleCard={
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  marginBottom: "1rem"
}

const styleContent={
  height: "100%"
}

const stylePage={
  maxWidth: '80ch',
  margin: '0 auto'
}

export default function Pages() {
  const params = useParams();
  const [page, setPage] = useState({});
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (params.pageSlug) {
      getPage(params.pageSlug);
    } else {
      getPages();
    }
  }, [params.pageSlug])

  const getPage = async (s) => {
    console.log('getPage')

    const q = query(collection(db, "pages"), where("slug", "==", s));
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setPage(l);
    setPages([]);
  }

  const getPages = async () => {
    const q = query(collection(db, "pages"), orderBy("title", "asc"));
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setPage({});
    setPages(l);
  }

  const renderPage = () => {
    if (!page.length) {
      return null;
    }
    const firstMatchingPage = page[0];
    const r = <Box style={ stylePage }>
      <Typography variant="h1" component="h1" gutterBottom align='center'>
        {firstMatchingPage.title}
      </Typography>
      <ReactMarkdown children={firstMatchingPage.content} />
    </Box>
    return r;
  }

  const renderPages = () => {
    if (!pages.length) return null;
    const r = <>
      <Typography variant="h1" component="h1" gutterBottom align='center'>
        Pages
      </Typography>
      {pages.map((data, index) => (
        <Card variant="outlined" key={index} style={styleCard}>
          <CardContent style={styleContent}>
            <Stack spacing={2}>
              <Typography component="p" variant='p' gutterBottom>
                <Link to={`/pages/${data.slug}`}>{data.title}</Link>
              </Typography>
              <Typography component="p" variant='p' gutterBottom>
                {data.description}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </>
    return r;
  }

  return (
    <>
      <Container>
        { renderPages() }
        { renderPage() }
      </Container>
    </>
  )
}

