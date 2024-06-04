import React, { useState } from 'react';
import { Grid, Paper, Avatar, TextField, Button, Typography, Link, Checkbox, FormControlLabel, useMediaQuery } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [name, setName] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a data object to send to the backend
        const data = {
            email: email,
            password: password
        };

        fetch('https://school-frontend-98qa.vercel.app/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json()) // Parse response JSON
            .then(data => {
                // Set user type in state
                setUserType(data.type);

                localStorage.setItem('userType', data.type);
                localStorage.setItem('name', data.name);
                localStorage.setItem('email', data.email);
                console.log(data.type, data.name, data.email);

                // Redirect based on user type
                if (data.type === 'admin') {
                    window.location.href = '/admin'; // Redirect to admin page
                } else if (data.type === 'staff') {
                    window.location.href = '/staff'; // Redirect to staff page
                } else if (data.type === 'it') {
                    window.location.href = '/parents'; // Redirect to parents page
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const paperStyle = { padding: 20, margin: "100px auto", maxWidth: 380,borderRadius: 12};
    const avatarStyle = { backgroundColor: '#1bbd7e' };
    const btnstyle = { margin: '8px 0',color: 'white', backgroundColor: 'black',borderRadius:'12px',height:'40px'};

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
<Grid container justifyContent="center" >
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Paper elevation={0} style={paperStyle} >
                    <form onSubmit={handleSubmit}>
                        <Grid container justifyContent="center" alignItems="center" spacing={2}>
                            {/* <Grid item>
                                <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                            </Grid> */}
                            <Grid item xs={12}>
                                <Typography variant="h5" align="center">Sign In</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label='Email' placeholder='Enter Email' variant="outlined" style={{}} fullWidth required value={email} onChange={handleEmailChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label='Password' placeholder='Enter password' type='password' variant="outlined" fullWidth required value={password} onChange={handlePasswordChange} />
                            </Grid>
                            <Grid item xs={12}>
                                {/* <FormControlLabel
                                    control={<Checkbox name="checkedB" color="primary" />}
                                    label="Remember me"
                                /> */}
                            </Grid>
                            <Grid item xs={12}>
                                <Button type='submit' variant="contained" fullWidth style={btnstyle}>Sign in</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Login;
