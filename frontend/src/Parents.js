import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Drawer, List, ListItem,TableHead, ListItemIcon, ListItemText, Divider, Button, TextField, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InboxIcon from "@mui/icons-material/Inbox";
import axios from 'axios';
import { Link } from 'react-router-dom';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    margin: '10px',
    borderRadius: '20px',
    padding: '10px',
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  color: '#fff',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: '#4d4d4d',
}));

function Parents() {
  const [newemail, setnewEmail] = useState('');
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    getParentEmails();
  }, []);

  const getParentEmails = async () => {
    try {
      const response = await axios.get('/getparentemailslist');
      setEmails(response.data.parentEmails || []);
    } catch (error) {
      console.error('Error fetching parent emails:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/deleteparentemail/${id}`);
      setEmails(emails.filter((email) => email.id !== id));
    } catch (error) {
      console.error('Error deleting parent email:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/addparentemail', { email: newemail });
      console.log('Parent Email Added successfully:', response.data);
      setnewEmail('');
      getParentEmails();
    } catch (error) {
      console.error('Error creating email:', error);
    }
  };

  return (
    <div style={{ display: 'flex' ,flexDirection:'column'}}>
      <StyledDrawer variant="permanent" anchor="left">
        <List>
          {/* Dashboard Section */}
          <ListItem button component={Link}>
            <ListItemIcon>
              <DashboardIcon style={{ color: '#fff' }} />
            </ListItemIcon>
            <StyledListItemText primary="Dashboard" />
          </ListItem>

          {/* Inbox Section */}
          <StyledDivider />
          <ListItem button component={Link}>
            <ListItemIcon>
              <InboxIcon style={{ color: "red" }} />
            </ListItemIcon>
            <StyledListItemText style={{ color: "red" }} primary="Logout" />
          </ListItem>
        </List>
      </StyledDrawer>

      <div style={{width:'40%',marginLeft:'200px'}}>
        <form onSubmit={handleSubmit}>
          <h3 style={{marginLeft:'100PX'}}>Add emails ids below</h3>
          <TextField
            label="Email"
            value={newemail}
            onChange={(e) => setnewEmail(e.target.value)}
            fullWidth
            required
            type="email"
            style={{ marginBottom: '10px', marginTop: '20px', marginLeft: '100px' }}
          />
          <Button
            variant="contained"
            type="submit"
            style={{ backgroundColor: 'black', color: 'white', marginBottom: '10px', marginTop: '20px', marginLeft: '100px' }}
          >
            Submit
          </Button>
        </form>

        <br />
        <br />
        <br />
        <TableContainer component={Paper} style={{marginLeft:'100px'}} >
          <Table aria-label="parent-emails-table">
            <TableHead>
              <TableRow style={{ backgroundColor: 'black' }}>
                <TableCell style={{ color: 'white' }}>Email id</TableCell>
                <TableCell style={{ color: 'white' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>{email.email}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleDelete(email.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Parents;
