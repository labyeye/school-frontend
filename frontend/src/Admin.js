import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InboxIcon from "@mui/icons-material/Inbox";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ApprovalIcon from "@mui/icons-material/Approval";
import SettingsIcon from "@mui/icons-material/Settings";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import {
  Select,
  MenuItem,
  Typography,
  TextField,
  Drawer,
  List,
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  IconButton,
  Box,
  Icon,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import emailjs from "emailjs-com";
import parentsData from "./parents.json";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckIcon from "@mui/icons-material/Check";
import toast, { Toaster } from "react-hot-toast";
import MenuIcon from "@mui/icons-material/Menu";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 220,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 220,
    backgroundColor: "white",
    color: "black",
    margin: "10px",
    borderRadius: "20px",
    padding: "10px",
    position: "fixed", // Add this line to fix the position of the drawer
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  color: "#fff",
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: "#4d4d4d",
}));

function SidebarMenu() {
  const parentEmail = parentsData.parents;
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  // const [selectedStatus, setSelectedStatuses] = useState({});

  // NEW USER STATES
  const [newname, setnewName] = useState("");
  const [newemail, setnewEmail] = useState("");
  const [newpassword, setnewPassword] = useState("");
  const [newtype, setnewType] = useState("staff");
  const [users, setUsers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // PARENT EMAILS
  const [parentEmails, setParentEmails] = useState([]);

  // DELETE USER
  const [open, setOpen] = useState(false);
  // const [email, setEmail] = useState('');
  const [deleteemail, setDeleteEmail] = useState("");

  const [selectedStatus, setSelectedStatus] = useState({});

  const [filteredEmails, setFilteredEmails] = useState([]);

  const handleProfileDrawerOpen = () => {
    setIsProfileDrawerOpen(true);
  };

  const handleProfileDrawerClose = () => {
    setIsProfileDrawerOpen(false);
  };

  useEffect(() => {
    handleGetNotifications();
    fetchUsers();
    fetchParentEmails();
  }, []);

  const fetchParentEmails = async () => {
    try {
      const response = await fetch(
        "https://school-frontend-98qa.vercel.app/getparentemails"
      );
      const data = await response.json();
      setParentEmails(data);
    } catch (error) {
      console.error("Error fetching parent emails:", error);
    }
  };

  // OLD

  // const sendEmailToParents = (title, message) => {
  //   parentEmails.forEach((parentEmail) => {
  //     const templateParams = {
  //       title: title,
  //       message: message,
  //       tomail: parentEmail,
  //     };

  //     emailjs
  //       .send(
  //         "service_o0zvik4",
  //         "template_rgo8jsb",
  //         templateParams,
  //         "crc_OthtMutwA5FNS"
  //       )
  //       .then((response) => {
  //         console.log(`Email sent to ${parentEmail}:`, response);
  //         toast.success("Emails successfully sent");
  //       })
  //       .catch((error) => {
  //         console.error(`Error sending email to ${parentEmail}:`, error);
  //       });
  //   });
  // };

  // NEW
  const sendEmailToParents = (title, message, emails) => {
    emails.forEach((email) => {
      const templateParams = {
        title: title,
        message: message,
        tomail: email,
      };

      // Send email to each filtered email
      emailjs
        .send(
          "service_o0zvik4",
          "template_rgo8jsb",
          templateParams,
          "crc_OthtMutwA5FNS"
        )
        .then((response) => {
          console.log(`Email sent to ${email}:`, response);
          toast.success("Emails successfully sent");
        })
        .catch((error) => {
          console.error(`Error sending email to ${email}:`, error);
        });
    });
  };

  // const sendEmailToParents = (title, message, parentEmail) => {
  //   parentEmail.forEach((parentEmail) => {
  //     const templateParams = {
  //       title: title,
  //       message: message,
  //       tomail: parentEmail,
  //     };

  //     emailjs
  //       .send(
  //         "service_o0zvik4",
  //         "template_rgo8jsb",
  //         templateParams,
  //         "crc_OthtMutwA5FNS"
  //       )
  //       .then((response) => {
  //         console.log(`Email sent to ${parentEmail}:`, response);
  //         toast.success("Emails successfully send")
  //       })
  //       .catch((error) => {
  //         console.error(`Error sending email to ${parentEmail}:`, error);
  //       });
  //   });
  // };

  // const handleGetNotifications = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://school-frontend-98qa.vercel.app/getnotifications"
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       setNotifications(data);

  //     } else {
  //       console.error("Error fetching notifications:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //   }
  // };

  const handleGetNotifications = async () => {
    try {
      const response = await fetch(
        "https://school-frontend-98qa.vercel.app/getnotifications"
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);

        // Populate selectedStatus state with the current status of notifications
        const statuses = {};
        data.forEach((notification) => {
          statuses[notification.tick] = notification.status;
        });
        setSelectedStatus(statuses);
      } else {
        console.error("Error fetching notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const initialSelectedStatus = {};
    notifications.forEach((notification) => {
      initialSelectedStatus[notification.tick] = notification.status;
    });
    setSelectedStatus(initialSelectedStatus);
  }, [notifications]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://school-frontend-98qa.vercel.app/users"
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = async (event, notification) => {
    const newStatus = event.target.value;
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [notification.tick]: newStatus,
    }));

    // if (newStatus === "a") {
    //   try {
    //     // Fetch parent emails
    //     const response = await fetch('https://school-frontend-98qa.vercel.app/getparentemails');
    //     const data = await response.json();
    //     // Filter parent emails based on grade
    //     const filteredParentEmails = data.parentEmails.filter(email => email.grade === notification.grade);
    //     // Send email to filtered parent emails
    //     sendEmailToParents(notification.title, notification.message, filteredParentEmails);
    //   } catch (error) {
    //     console.error('Error fetching parent emails:', error);
    //   }
    // }

    if (newStatus === "a") {
      try {
        const response = await fetch(
          "https://school-frontend-98qa.vercel.app/getparentemails"
        );
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          const filteredParentEmails = data.filter(
            (item) => item.grade === notification.grade
          );
          console.log(filteredParentEmails);

          const emails = filteredParentEmails.map((item) => item.email);
          console.log(emails);

          sendEmailToParents(notification.title, notification.message, emails);
          console.log(notification.title, notification.message, emails);
        } else {
          toast.error("Invalid or missing data in API response");
          console.error("Invalid or missing data in API response");
        }
      } catch (error) {
        console.error("Error fetching parent emails:", error);
      }
    }

    try {
      const response = await fetch(
        `https://school-frontend-98qa.vercel.app/updatenotification/${notification.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tick: newStatus }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update notification status");
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  const renderRowColor = (index) => {
    return index % 2 === 0 ? "white" : "#f2f2f2";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://school-frontend-98qa.vercel.app/createuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newname,
            email: newemail,
            password: newpassword,
            type: newtype,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("User created successfully:", data);
        toast.success("User created");
        window.location.reload();
      } else {
        toast.error("Some error occured");
        const errorData = await response.json();
        console.error("Failed to create user:", errorData.error);
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Some error occured");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleEmailChange = (event) => {
    setDeleteEmail(event.target.value);
  };

  const handleDeleteSubmit = async () => {
    try {
      toast.loading("Deleting...");
      await fetch("https://school-frontend-98qa.vercel.app/deleteuser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: deleteemail }), // Sending an object with email property
      });
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error deleting user:", error);
      toast.error("Some error occured");
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "p":
        return "Pending";
      case "r":
        return "Rejected";
      case "a":
        return "Approved";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "p":
        return "grey";
      case "a":
        return "green";
      case "r":
        return "red";
      default:
        return "black";
    }
  };
  const ProfileCircle = styled(Avatar)(({ theme }) => ({
    width: 30,
    height:30,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 220,
    backgroundColor: "#1e1e1e",
    height:10,
    color: "#fff",
    margin: "0px",
    borderRadius: "20px",
    padding: "10px",
    position: "fixed", // Add this line to fix the position of the drawer
  },
    
  }));
  
  return (
    <div>
      
      <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
        
      <div style={{ display: "flex",justifyContent:'space-between'}}>
        
      </div>
      <div>
        
      <ProfileCircle onClick={handleProfileDrawerOpen}>
          <AccountCircleIcon style={{height:'40px',
    width:'50px',}}/>
        </ProfileCircle>
      </div>

      </div>
      <StyledDrawer
        variant="permanent"
        
        open={isDrawerOpen}
       
      >
        <List>
          
          <ListItem
            button
            component={Link}
            onClick={() => {
              setSelectedSection("dashboard");
              setIsDrawerOpen(!isDrawerOpen);
            }}
            style={{ backgroundColor: selectedSection === "dashboard" ? "#DADADA" : "transparent",borderRadius:9,marginTop:20 }}
          >
            <ListItemIcon>
              <DashboardIcon style={{ color: "black" }} />
            </ListItemIcon>
            <StyledListItemText primary="Dashboard" style={{color:'black'}}/>
        </ListItem>

  
          <ListItem
            button
            component={Link}
            onClick={() => {
              setSelectedSection("inbox");
              setIsDrawerOpen(!isDrawerOpen);
            }}
            style={{ backgroundColor: selectedSection === "inbox" ? "#DADADA" : "transparent",borderRadius:9  }}
          >
            <ListItemIcon>
              <InboxIcon style={{ color: "black" }} />
            </ListItemIcon>
            <StyledListItemText primary="Inbox" style={{color:'black'}}/>
          </ListItem>

          <ListItem
            button
            component={Link}
            onClick={() => {
              setSelectedSection("add");
              setIsDrawerOpen(!isDrawerOpen);
            }}
            style={{ backgroundColor: selectedSection === "add" ? "#DADADA" : "transparent",borderRadius:9  }}
          >
            <ListItemIcon>
              <GroupAddOutlinedIcon style={{ color: "black" }} />
            </ListItemIcon>
            <StyledListItemText primary="Add Staff" style={{color:'black'}} />
          </ListItem>

  
          <ListItem
            button
            component={Link}
            onClick={() => {
              setSelectedSection("settings");
              setIsDrawerOpen(!isDrawerOpen);
            }}
            style={{ backgroundColor: selectedSection === "settings" ? "#DADADA" : "transparent",borderRadius:9 }}
          >
            <ListItemIcon>
              <SettingsIcon style={{ color: "black" }} />
            </ListItemIcon>
            <StyledListItemText primary="Settings" style={{color:'black'}}/>
          </ListItem>

    
          <ListItem
            button
            component={Link}
            onClick={() => {
              localStorage.removeItem("userType");
              localStorage.removeItem("name");
              localStorage.removeItem("email");

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
      <StyledDrawer
        variant="temporary"
        anchor="right"
        open={isProfileDrawerOpen}
        onClose={handleProfileDrawerClose}
      >
        <List>
          <ListItem button onClick={() => console.log("Go to Profile")}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={() => console.log("Go to Settings")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={Link}
            onClick={() => {
              localStorage.removeItem("userType");
              localStorage.removeItem("name");
              localStorage.removeItem("email");

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

      <div
        style={{
          marginLeft:"300px",
          marginTop: "-40px",
          marginRight: "20px",
        }}
      >
        {selectedSection === "dashboard" && (
          <div>
            <h2>👋 Welcome</h2>
            
            <p style={{ color: "grey", fontSize: "20px" }}>Overview</p>
            <Grid container spacing={10} style={{ marginTop: "20px" }}>
              <Grid item xs={1} sm={3}>
                <Card
                  variant="outlined"
                  sx={{ backgroundColor: "#A0E9FF", maxWidth: "270px" ,boxShadow: "0px 0px 10px rgba(69, 187, 223, 10)"}}
                  style={{ borderRadius: "12px" }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <NotificationsIcon
                      style={{
                        height: "60px",
                        width: "60px",
                        color: "#0C356A",
                      }}
                    />

                    <Typography variant="h4" color="#0C356A">
                      {notifications.length}
                    </Typography>
                    <Typography
                      variant="h16"
                      color="#0C356A"
                      fontWeight={1000}
                      gutterBottom
                    >
                      Total Notifications
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={15} sm={3}>
                <Card
                  variant="outlined"
                  sx={{ backgroundColor: "#BFF6C3", maxWidth: "270px" ,boxShadow: "0px 0px 10px rgba(21, 167, 32, 10)"}}
                  style={{ borderRadius: "12px" }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <ApprovalIcon
                      style={{
                        height: "60px",
                        width: "60px",
                        color: "#1A4D2E",
                      }}
                    />

                    <Typography variant="h4" color="#1A4D2E">
                      {
                        notifications.filter(
                          (notification) => notification.tick === "a"
                        ).length
                      }
                    </Typography>
                    <Typography
                      variant="h16"
                      color="#1A4D2E"
                      fontWeight={1000}
                      gutterBottom
                    >
                      Total Approvals
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card
                  variant="outlined"
                  sx={{ backgroundColor: "#FEFFD2", maxWidth: "270px" ,boxShadow: "0px 0px 10px rgba(240, 245, 0, 10)"}}
                  style={{ borderRadius: "12px" }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <SpeakerNotesOffIcon
                      style={{
                        height: "60px",
                        width: "60px",
                        color: "#FEB941",
                      }}
                    />

                    <Typography variant="h4" color="#FEB941">
                      {
                        notifications.filter(
                          (notification) => notification.tick === "r"
                        ).length
                      }
                    </Typography>
                    <Typography
                      variant="h16"
                      color="#FEB941"
                      fontWeight={1000}
                      gutterBottom
                    >
                      Total Rejections
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card
                  variant="outlined"
                  sx={{ backgroundColor: "#FFA27F", maxWidth: "270px" ,boxShadow: "0px 0px 10px rgba(255, 70, 0, 10)"}}
                  style={{ borderRadius: "12px" }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <PendingActionsIcon
                      style={{
                        height: "60px",
                        width: "60px",
                        color: "#C40C0C",
                      }}
                    />

                    <Typography variant="h4" color="#C40C0C">
                      {
                        notifications.filter(
                          (notification) => notification.tick === "p"
                        ).length
                      }
                    </Typography>
                    <Typography
                      variant="h16"
                      color="#C40C0C"
                      fontWeight={1000}
                      gutterBottom
                    >
                      Pending Approval
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        )}
        {selectedSection === "inbox" && (
          <div>
            <div>
              <h2>Inbox</h2>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow
                      style={{ backgroundColor: "black", color: "white" }}
                    >
                      <TableCell style={{ color: "white" }}>Status</TableCell>
                      <TableCell style={{ color: "white" }}>Title</TableCell>
                      <TableCell style={{ color: "white" }}>Name</TableCell>
                      <TableCell style={{ color: "white" }}>Message</TableCell>
                      <TableCell style={{ color: "white" }}>ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notifications.map((notification, index) => (
                      <TableRow
                        key={index}
                        style={{ backgroundColor: renderRowColor(index) }}
                      >
                        <TableCell>
                          <InputLabel
                            id={`status-label-${index}`}
                            style={{ color: getStatusColor(notification.tick) }}
                          >
                            {getStatusText(notification.tick)}
                          </InputLabel>
                          <Select
                            value={selectedStatus[index] || ""}
                            onChange={(event) =>
                              handleChange(event, notification)
                            }
                            style={{
                              color:
                                selectedStatus[index] === "p"
                                  ? "grey"
                                  : selectedStatus[index] === "r"
                                  ? "red"
                                  : "green",
                            }}
                            labelId={`status-label-${index}`} // Associate Select with the label
                          >
                            <MenuItem value="p">Pending</MenuItem>
                            <MenuItem value="a">Approve</MenuItem>
                            <MenuItem value="r">Reject</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>{notification.title}</TableCell>
                        <TableCell>{notification.name}</TableCell>
                        <TableCell>{notification.message}</TableCell>
                        <TableCell>{index}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        )}

        {selectedSection === "settings" && (
          <div>
            <h2>Settings</h2>
            <p>This is the settings content.</p>
          </div>
        )}

        {selectedSection === "add" && (
          <div>
            <h2>User manager</h2>

            <form>
              <TextField
                label="Name"
                value={newname}
                onChange={(e) => setnewName(e.target.value)}
                fullWidth
                required
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Email"
                value={newemail}
                onChange={(e) => setnewEmail(e.target.value)}
                fullWidth
                required
                style={{ marginBottom: "10px" }}
              />
              <TextField
                type="password"
                label="Password"
                value={newpassword}
                onChange={(e) => setnewPassword(e.target.value)}
                fullWidth
                required
                style={{ marginBottom: "10px" }}
              />
              <FormControl
                fullWidth
                required
                style={{ marginBottom: "10px", marginTop: "10px" }}
              >
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
              <Button
                variant="contained"
                type="submit"
                onClick={handleSubmit}
                style={{ backgroundColor: "black", color: "white" }}
              >
                Submit
              </Button>
            </form>
            <br />
            <h2>Account Termination</h2>
            <div>
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpen}
              >
                Select Account
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter the email ID of the user you want to delete.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={deleteemail}
                    onChange={handleEmailChange}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="inherit">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteSubmit}
                    color="error"
                    startIcon={<CheckIcon />}
                  >
                    Confirm & Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
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
      <Toaster />
    </div>
  );
}

export default SidebarMenu;
