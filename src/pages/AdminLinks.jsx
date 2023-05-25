import React, { useEffect, useState } from 'react';

import { doc, getDocs, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from "../firebase";

// MUI
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom Components
import LinkList from '../components/LinkList';

export default function AdminLinks() {

  const [links, setLinks] = useState([])

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');

  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateUrl, setUpdateURL] = useState('');
  const [updateId, setUpdateId] = useState('');

  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [error, setError] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    getLinks()
  }, [])

  const getLinks = async () => {
    const querySnapshot = await getDocs(collection(db, "links"));
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setLinks(l);
  }

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenUpdate = (data) => {
    setUpdateTitle(data.title);
    setUpdateDescription(data.description);
    setUpdateURL(data.url);
    setUpdateId(data.id);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('')
    try {
      const docRef = await addDoc(collection(db, "links"), {
        title: title,
        description: description,
        url: url
      });

      getLinks();
      handleCloseAdd();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleDelete = async (id) => {
    console.log('delete', id);
    try {
      await deleteDoc(doc(db, "links", id));
      getLinks();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleUpdate = async () => {
    console.log('update', updateId);
    try {
      const l = doc(db, "links", updateId);

      await updateDoc(l, {
        title: updateTitle,
        description: updateDescription,
        url: updateUrl
      });

      getLinks();
      handleCloseUpdate();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <Container>
      <Dialog
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        open={openAdd}
        onClose={handleCloseAdd}
        scroll="paper"
        aria-labelledby="add-dialog-title">
        <DialogTitle id="add-dialog-title">
          <Typography variant="h2" component="span">Add</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <div>
              <TextField sx={{ width: '100%' }} label="Title" onChange={(e) => setTitle(e.target.value)} type='text' />
            </div>
            <div>
              <TextField sx={{ width: '100%' }} label="URL" onChange={(e) => setURL(e.target.value)} type='url' />
            </div>
            <div>
              <TextField sx={{ width: '100%' }} multiline rows={8} label="Description" onChange={(e) => setDescription(e.target.value)}  />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} variant='outlined'>Cancel</Button>
          <Button onClick={handleAdd} variant='contained' type="submit">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        open={openUpdate}
        onClose={handleCloseUpdate}
        scroll="paper"
        aria-labelledby="update-dialog-title">
        <DialogTitle id="update-dialog-title">
          <Typography variant="h2" component="span">Update</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <div>
              <TextField sx={{ width: '100%' }} label="Title" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} type='text' />
            </div>
            <div>
              <TextField sx={{ width: '100%' }} label="URL" value={updateUrl} onChange={(e) => setUpdateURL(e.target.value)} type='url' />
            </div>
            <div>
              <TextField sx={{ width: '100%' }} multiline rows={8} value={updateDescription} label="Description" onChange={(e) => setUpdateDescription(e.target.value)}  />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate} variant='outlined'>Close</Button>
          <Button onClick={handleUpdate} variant='contained' type="submit">Save</Button>
        </DialogActions>
      </Dialog>

      <Stack>
        <Typography component="h1" variant='h1'>Links</Typography>
        <Button onClick={() => handleOpenAdd()} variant='outlined'>Add</Button>
      </Stack>

      <LinkList data={links} onDelete={handleDelete} onUpdate={handleOpenUpdate} />

    </Container>
  )
}

