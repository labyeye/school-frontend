import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InboxIcon from '@mui/icons-material/Inbox';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import { Select, MenuItem, Typography, TextField, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Button, Card, CardContent, Grid, FormControl, InputLabel, IconButton } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import emailjs from 'emailjs-com';
import parentsData from './parents.json';

import MenuIcon from '@mui/icons-material/Menu';

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
    position: 'fixed', // Add this line to fix the position of the drawer
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  color: '#fff',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: '#4d4d4d',
}));

function SidebarMenu() {
  const parentEmail = parentsData.parents;
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [selectedStatus, setSelectedStatuses] = useState({});

  // NEW USER STATES
  const [newname, setnewName] = useState('');
  const [newemail, setnewEmail] = useState('');
  const [newpassword, setnewPassword] = useState('');
  const [newtype, setnewType] = useState('staff');
  const [users, setUsers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    handleGetNotifications();
    fetchUsers();
  }, []);

  const sendEmailToParents = (title, message, parentEmail) => {
    parentEmail.forEach(parentEmail => {
      const templateParams = {
        title: title,
        message: message,
        tomail: parentEmail
      };
  
      emailjs.send('service_o0zvik4', 'template_rgo8jsb', templateParams, 'crc_OthtMutwA5FNS')
        .then((response) => {
          console.log(`Email sent to ${parentEmail}:`, response);
        })
        .catch((error) => {
          console.error(`Error sending email to ${parentEmail}:`, error);
        });
    });
  };

  const handleGetNotifications = async () => {
    try {
      const response = await fetch('https://school-frontend-98qa.vercel.app/getnotifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error('Error fetching notifications:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://school-frontend-98qa.vercel.app/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };


  


  const renderRowColor = (index) => {
    return index % 2 === 0 ? 'white' : '#f2f2f2';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://school-frontend-98qa.vercel.app/createuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newname,
          email: newemail,
          password: newpassword,
          type: newtype,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User created successfully:', data);
        window.reload();
      } else {
        console.error('Failed to create user:', response.statusText);
      }
      
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          edge="start"
        >
          {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" noWrap style={{marginTop:'6px'}}>
          Admin Dashboard
        </Typography>
      </div>
      <StyledDrawer variant="temporary" anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} >
        <List>
          <ListItem
            button
            component={Link}
            onClick={() => {
              setSelectedSection('dashboard');
              setIsDrawerOpen(!isDrawerOpen);
            }}
          >
            <ListItemIcon>
              <DashboardIcon style={{ color: '#fff' }} />
            </ListItemIcon>
            <StyledListItemText primary="Dashboard" />
          </ListItem>

          <StyledDivider />
          <ListItem
            button
            component={Link}
            onClick={() => { setSelectedSection('inbox')
            setIsDrawerOpen(!isDrawerOpen);
            }}
          >
            <ListItemIcon>
              <InboxIcon style={{ color: '#fff' }} />
            </ListItemIcon>
            <StyledListItemText primary="Inbox" />
          </ListItem>

          <ListItem
            button
            component={Link}
            onClick={() => { setSelectedSection('add')
            setIsDrawerOpen(!isDrawerOpen);
            }}
          >
            <ListItemIcon>
              <GroupAddOutlinedIcon style={{ color: '#fff' }} />
            </ListItemIcon>
            <StyledListItemText primary="Add Staff" />
          </ListItem>

          <StyledDivider />
          <ListItem
            button
            component={Link}
            onClick={() => { setSelectedSection('settings')
            setIsDrawerOpen(!isDrawerOpen);
          }
            }
          >
            <ListItemIcon>
              <SettingsIcon style={{ color: '#fff' }} />
            </ListItemIcon>
            <StyledListItemText primary="Settings" />
          </ListItem>

          <StyledDivider />
          <ListItem button component={Link} onClick={() => {
            // Clear local storage values
            localStorage.removeItem('userType');
            localStorage.removeItem('name');
            localStorage.removeItem('email');

            // Redirect to root route
            window.location.href = '/';
          }}>
            <ListItemIcon>
              <InboxIcon style={{ color: 'red' }} />
            </ListItemIcon>
            <StyledListItemText style={{ color: 'red' }} primary="Logout" />
          </ListItem>
        </List>
      </StyledDrawer>

      <div style={{ marginLeft: isDrawerOpen ? '20px' : '0', marginTop: '50px', marginRight: '20px' }}>
      {selectedSection === 'dashboard' && (
          <div>
            <h2>👋 Welcome</h2>
            <p style={{ color: 'grey', fontSize: '20px' }}>Overview</p>
            <Grid container spacing={2} >
              
              <Grid item xs={12} sm={3} >
                <Card variant="outlined" sx={{ backgroundColor: '#2196F3' }} style={{ borderRadius: '12px' }}>
                  <CardContent>
                    <Typography variant="h5" color="white" gutterBottom>
                      Total Notifications
                    </Typography>
                    <Typography variant="h4" color="white">
                      {notifications.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card variant="outlined" sx={{ backgroundColor: '#4CAF50' }} style={{ borderRadius: '12px' }}>
                  <CardContent>
                    <Typography variant="h5" color="white" gutterBottom>
                      Total Approvals
                    </Typography>
                    <Typography variant="h4" color="white">
                      {notifications.filter(notification => notification.tick === 'a').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card variant="outlined" sx={{ backgroundColor: '#F44336' }} style={{ borderRadius: '12px' }}>
                  <CardContent>
                    <Typography variant="h5" color="white" gutterBottom>
                      Total Rejections
                    </Typography>
                    <Typography variant="h4" color="white">
                      {notifications.filter(notification => notification.tick === 'r').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card variant="outlined" sx={{ backgroundColor: 'silver' }} style={{ borderRadius: '12px' }}>
                  <CardContent>
                    <Typography variant="h5" color="white" gutterBottom>
                      Pending Approval
                    </Typography>
                    <Typography variant="h4" color="white">
                      {notifications.filter(notification => notification.tick === 'p').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        )}

{selectedSection === 'inbox' && (
          <div>
            <div>
              <h2>Inbox</h2>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow style={{ backgroundColor: 'black', color: 'white' }}>
                      <TableCell style={{ color: 'white' }}>Status</TableCell>
                      <TableCell style={{ color: 'white' }}>Title</TableCell>
                      <TableCell style={{ color: 'white' }}>Name</TableCell>
                      <TableCell style={{ color: 'white' }}>Message</TableCell>
                      <TableCell style={{ color: 'white' }}>ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notifications.map((notification, index) => (
                      <TableRow key={notification.id} style={{ backgroundColor: renderRowColor(index) }}>
                        <TableCell>
                          <Select
                            value={selectedStatus[notification.id] || ''}
                            onChange={(event) => handleChange(event, notification)}
                            style={{ color: selectedStatus[notification.id] === 'p' ? 'grey' : selectedStatus[notification.id] === 'r' ? 'red' : 'green' }}
                          >
                            <MenuItem value="p">Pending</MenuItem>
                            <MenuItem value="a">Approve</MenuItem>
                            <MenuItem value="r">Reject</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>{notification.title}</TableCell>
                        <TableCell>{notification.name}</TableCell>
                        <TableCell>{notification.message}</TableCell>
                        <TableCell>{notification.id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        )}


        {selectedSection === 'settings' && (
          <div>
            <h2>Settings</h2>
            <p>This is the settings content.</p>
          </div>
        )}

        {selectedSection === 'add' && (
          <div>
            <h2>User manager</h2>
            <form>
              <TextField
                label="Name"
                value={newname}
                onChange={(e) => setnewName(e.target.value)}
                fullWidth
                required
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Email"
                value={newemail}
                onChange={(e) => setnewEmail(e.target.value)}
                fullWidth
                required
                style={{ marginBottom: '10px' }}
              />
              <TextField
                type="password"
                label="Password"
                value={newpassword}
                onChange={(e) => setnewPassword(e.target.value)}
                fullWidth
                required
                style={{ marginBottom: '10px' }}
              />
              <FormControl fullWidth required style={{ marginBottom: '10px', marginTop: '10px' }}>
                <InputLabel id="user-type-label">User Type</InputLabel>
                <br />
                <Select
                  labelId="user-type-label"
                  value={newtype}
                  onChange={(e) => setnewType(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="it">IT</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" type="submit" onClick={handleSubmit} style={{ backgroundColor: 'black', color: 'white' }}>
                Submit
              </Button>
            </form>
            <br />
            <div>
              <h2>Existing Users</h2>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarMenu;
