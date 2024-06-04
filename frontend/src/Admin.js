import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardIconSVG from "./Icons/ic_analytics.svg";
import InboxSVG from "./Icons/ic_mail.svg";
import UsersSVG from "./Icons/ic_user.svg";
import LogoutSVG from "./Icons/ic_lock.svg";
import InboxIcon from "@mui/icons-material/Inbox";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ApprovalIcon from "@mui/icons-material/Approval";
import SettingsIcon from "@mui/icons-material/Settings";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import ErrorIconPNG from "./Icons/error.png";
import PendingPNG from "./Icons/pending.png";
import CheckPNG from "./Icons/check.png";
import NotificationPNG from "./Icons/notification.png";
import useMediaQuery from "@mui/material/useMediaQuery";

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

import "./admin.css";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 220,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 200,
    backgroundColor: "rgb(249, 250, 251)",
    color: "black",
    margin: "10px",
    marginTop: "-20px",
    marginLeft: "-20px",
    borderRadius: "20px",
    paddingTop: "40px",
    padding: "40px",
    position: "fixed",
    border: "1px dashed #e3e3e3",
    [theme.breakpoints.down("sm")]: {
      margin: 0,
      borderRadius: 0,
      width: '100%',
    },
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  color: "#fff",
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: "#4d4d4d",
}));

function SidebarMenu() {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));


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
  // const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // PARENT EMAILS
  const [parentEmails, setParentEmails] = useState([]);

  // DELETE USER
  const [open, setOpen] = useState(false);
  // const [email, setEmail] = useState('');
  const [deleteemail, setDeleteEmail] = useState("");

  const [selectedStatus, setSelectedStatus] = useState({});

  const [filteredEmails, setFilteredEmails] = useState([]);

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

  //DRAWER
  useEffect(() => {
    const handleResize = () => {
      if (isSmallScreen) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSmallScreen]);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };



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
    width: 40,
    height: 40,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 220,
      backgroundColor: "#1e1e1e",
      height: 10,
      color: "#fff",
      margin: "0px",
      borderRadius: "20px",
      padding: "0px",
      position: "fixed",
    },
    "@media (max-width: 768px)": {
      width: 30,
      height: 30,
      marginTop: "-40px",
    },
  }));

  const ResponsiveIcon = styled(AccountCircleIcon)`
    height: 60px;
    width: 50px;

    @media (max-width: 768px) {
      height: 40px;
      width: 40px;
    }
  `;

  
  const getSpacing = () => {
    if (isSmallScreen) return 3;
    if (isLargeScreen) return 8;
    return 3; 
  };

  return (
    <div>
      {isSmallScreen && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}></div>
        <div>
          <ProfileCircle>
            <ResponsiveIcon />
          </ProfileCircle>
        </div>
      </div>
      <StyledDrawer
        variant={isSmallScreen ? 'temporary' : 'permanent'}
        open={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <List>
          <ListItem
            button
            component={Link}
            onClick={() => {
              setSelectedSection("dashboard");
              setIsDrawerOpen(!isDrawerOpen);
            }}
            style={{
              backgroundColor:
                selectedSection === "dashboard" ? "#DADADA" : "transparent",
              borderRadius: 9,
              marginTop: 20,
            }}
          >
            <ListItemIcon>
              {/* <DashboardIcon style={{ color: "black" }} /> */}
              <img src={DashboardIconSVG} />
            </ListItemIcon>
            <StyledListItemText primary="Dashboard" style={{ color: "grey" }} />
          </ListItem>

          <ListItem
            button
            component={Link}
            onClick={() => {
              setSelectedSection("inbox");
              setIsDrawerOpen(!isDrawerOpen);
            }}
            style={{
              backgroundColor:
                selectedSection === "inbox" ? "#DADADA" : "transparent",
              borderRadius: 9,
            }}
          >
            <ListItemIcon>
              {/* <InboxIcon style={{ color: "black" }} /> */}
              <img src={InboxSVG} alt="" />
            </ListItemIcon>
            <StyledListItemText primary="Inbox" style={{ color: "grey" }} />
          </ListItem>

          <ListItem
            button
            component={Link}
            onClick={() => {
              setSelectedSection("add");
              setIsDrawerOpen(!isDrawerOpen);
            }}
            style={{
              backgroundColor:
                selectedSection === "add" ? "#DADADA" : "transparent",
              borderRadius: 9,
            }}
          >
            <ListItemIcon>
              <img src={UsersSVG} />
            </ListItemIcon>
            <StyledListItemText primary="Add Staff" style={{ color: "grey" }} />
          </ListItem>

          {/* <ListItem
            button
            component={Link}
            onClick={() => {
              setSelectedSection("settings");
              setIsDrawerOpen(!isDrawerOpen);
            }}
            style={{ backgroundColor: selectedSection === "settings" ? "#DADADA" : "transparent", borderRadius: 9 }}
          >
            <ListItemIcon>
              <SettingsIcon style={{ color: "black" }} />
            </ListItemIcon>
            <StyledListItemText primary="Settings" style={{ color: 'black' }} />
          </ListItem> */}

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
              {/* <InboxIcon style={{ color: "red" }} /> */}
              <img src={LogoutSVG} alt="" />
            </ListItemIcon>
            <StyledListItemText style={{ color: "grey" }} primary="Logout" />
          </ListItem>
        </List>
      </StyledDrawer>
      <StyledDrawer
        variant="temporary"
        anchor="right"
        // open={isProfileDrawerOpen}
        // onClose={handleProfileDrawerClose}
      >
        <List>
          <ListItem button onClick={() => console.log("Go to Profile")}>
            <ListItemIcon>
              {/* <AccountCircleIcon /> */}
              <img src={UsersSVG} alt="" />
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
              {/* <InboxIcon style={{ color: "red" }} /> */}
              <img src={InboxSVG} alt="" />
            </ListItemIcon>
            <StyledListItemText style={{ color: "red" }} primary="Logout" />
          </ListItem>
        </List>
      </StyledDrawer>

      <div
        class="responsive-margin"
        // style={{
        //   marginLeft: "300px",
        //   marginTop: "-40px",
        //   marginRight: "20px",
        // }}
      >
        {selectedSection === "dashboard" && (
          <div style={{ marginTop: "40px" }}>
            <h2>Hi, Welcome back 👋</h2>

            <p style={{ color: "grey", fontSize: "20px" }}>Overview</p>
            <Grid container spacing={getSpacing()} style={{ marginTop: "-30px" }}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    maxWidth: "270px",
                    border: "1px solid #eee",
                    boxShadow:
                      "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px",
                    borderRadius: "12px",
                    padding: "10px",
                    height: "110px",
                    width: "270px",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={NotificationPNG}
                      height="60px"
                      style={{ marginRight: "16px" }}
                    />

                    <div style={{ flex: 1 }}>
                      <Typography
                        variant="h4"
                        color="#0C356A"
                        sx={{ textAlign: "center" }}
                      >
                        {notifications.length}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="#0C356A"
                        fontWeight={500}
                        fontSize={17}
                        sx={{ textAlign: "center" }}
                      >
                        Total Notifications
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    maxWidth: "270px",
                    border: "1px solid #eee",
                    boxShadow:
                      "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px",
                    borderRadius: "12px",
                    padding: "10px",
                    height: "110px",
                    width: "270px",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={CheckPNG}
                      height="60px"
                      style={{ marginRight: "16px" }}
                    />

                    <div style={{ flex: 1 }}>
                      <Typography
                        variant="h4"
                        color="#1A4D2E"
                        sx={{ textAlign: "center" }}
                      >
                        {
                          notifications.filter(
                            (notification) => notification.tick === "a"
                          ).length
                        }
                      </Typography>
                      <Typography
                        variant="h6"
                        color="#1A4D2E"
                        fontWeight={500}
                        fontSize={17}
                        sx={{ textAlign: "center" }}
                      >
                        Total Approvals
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    maxWidth: "270px",
                    border: "1px solid #eee",
                    boxShadow:
                      "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px",
                    borderRadius: "12px",
                    padding: "10px",
                    height: "110px",
                    width: "270px",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={ErrorIconPNG}
                      height="50px"
                      style={{ marginRight: "16px" }}
                    />

                    <div style={{ flex: 1 }}>
                      <Typography variant="h4" sx={{ textAlign: "center" }}>
                        {
                          notifications.filter(
                            (notification) => notification.tick === "r"
                          ).length
                        }
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={500}
                        fontSize={17}
                        sx={{ textAlign: "center" }}
                      >
                        Total Rejections
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    maxWidth: "270px",
                    border: "1px solid #eee",
                    boxShadow:
                      "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px",
                    borderRadius: "12px",
                    padding: "10px",
                    height: "110px",
                    width: "270px",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={PendingPNG}
                      height="60px"
                      style={{ marginRight: "16px" }}
                    />

                    <div style={{ flex: 1 }}>
                      <Typography variant="h4" sx={{ textAlign: "center" }}>
                        {
                          notifications.filter(
                            (notification) => notification.tick === "p"
                          ).length
                        }
                      </Typography>
                      <Typography
                        variant="h6"
                        fontSize={17}
                        fontWeight={500}
                        sx={{ textAlign: "center" }}
                      >
                        Pending Approval
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        )}
        {selectedSection === "inbox" && (
          <div>
            <div>
              <h2 style={{marginTop:'40px'}}>Inbox</h2>
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
            <h2 style={{marginTop:'70px'}}>User manager</h2>

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
            <Divider orientation="vertical" flexItem />
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
