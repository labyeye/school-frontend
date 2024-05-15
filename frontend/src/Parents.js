import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Button, TextField } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';
import InboxIcon from "@mui/icons-material/Inbox";
import {TableContainer,TableCell,TableBody,Paper,Table,TableHead,TableRow} from '@mui/material';


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
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [newemail, setnewEmail] = useState('');
  const [emails, setEmails] = useState([]);

  const fetchParents = async () => {
    try {
      const response = await fetch(
        "https://school-frontend-98qa.vercel.app/getparentemails"
      );
      if (response.ok) {
        const data = await response.json();
        setEmails(data);
      } else {
        console.error("Failed to fetch users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://school-frontend-98qa.vercel.app/addparentemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newemail,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Parents Email Added successfully:', data);
      } else {
        console.error('Failed to add email:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating email:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <StyledDrawer variant="permanent" anchor="left">
        <List>
          {/* Dashboard Section */}
          <ListItem
            button
            component={Link}
            onClick={() => setSelectedSection('dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon style={{ color: '#fff' }} />
            </ListItemIcon>
            <StyledListItemText primary="Dashboard" />
          </ListItem>

          {/* Inbox Section */}
          
          <StyledDivider />
          <ListItem
            button
            component={Link}
            onClick={() => {
              // Clear local storage values
              localStorage.removeItem("userType");
              localStorage.removeItem("name");
              localStorage.removeItem("email");

              // Redirect to root route
              window.location.href = "/";
            }}
          >
            <ListItemIcon>
              <InboxIcon style={{ color: "red" }} />
            </ListItemIcon>
            <StyledListItemText style={{ color: "red" }} primary="Logout" />
          </ListItem>
        </List>
      </StyledDrawer>

      <form>

        <TextField
          label="Email"
          value={newemail}
          onChange={(e) => setnewEmail(e.target.value)}
          fullWidth
          required
          style={{ marginBottom: '10px', marginTop: '20px', marginLeft: '100px' }}
        />


        <Button variant="contained" type="submit" onClick={handleSubmit} style={{ backgroundColor: 'black', color: 'white', marginBottom: '10px', marginTop: '20px', marginLeft: '100px' }}>
          Submit
        </Button>
        
      </form>
      <div>
              <h2>Existing Users</h2>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {emails.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
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
