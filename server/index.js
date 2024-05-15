
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Your Firebase configuration
const serviceAccount = require('./school-ee33a-firebase-adminsdk-sa3e3-329ccc1738.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://admin-staff-dashboard.firebaseio.com'
});

const db = admin.firestore();

// Middleware
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
  origin: 'https://school-frontend-wheat.vercel.app', // Update with your frontend URL
};
app.use(cors(corsOptions));

// admin.firestore.setLogFunction(console.log);


app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmailAndPassword(email, password);
        res.json(user);
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(400).json({ error: 'Invalid email or password.' });
    }
});

async function getUserByEmailAndPassword(email, password) {

    const querySnapshot = await db.collection('users').where('email', '==', email).get();

    if (querySnapshot.empty) {
        throw new Error('User not found.');
    }
    const userDoc = querySnapshot.docs[0].data();
    if (userDoc.password !== password) {
        throw new Error('Invalid password.');
    }
    return userDoc;
}

app.post('/addnotification', async (req, res) => {
    try {
        const { message, name, title } = req.body;
        const tick = 'p';
        const notificationRef = await db.collection('notifications').add({
            message,
            name,
            title,
            tick
        });

        res.status(201).json({ message: 'Notification added successfully', id: notificationRef.id });
    } catch (error) {
        console.error('Error adding notification:', error);
        res.status(500).json({ error: 'Failed to add notification' });
    }
});
app.delete('/deleteuser', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const userQuerySnapshot = await db.collection('users').where('email', '==', email).get();
    if (userQuerySnapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    userQuerySnapshot.forEach(async (doc) => {
      await db.collection('users').doc(doc.id).delete();
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.get('/getnotifications', async (req, res) => {
    try {
        const snapshot = await db.collection('notifications').get();

        const notifications = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            notifications.push({ id: doc.id, ...data });
        });

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});


app.put('/updatenotification/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { tick } = req.body;
  
      const notificationRef = db.collection('notifications').doc(id);
      await notificationRef.update({ tick });
  
      res.status(200).json({ message: 'Notification status updated successfully' });
    } catch (error) {
      console.error('Error updating notification status:', error);
      res.status(500).json({ error: 'Failed to update notification status' });
    }
  });
  

  app.post('/createuser', async (req, res) => {
    try {
      const { name, email, password, type } = req.body;
  
      // Check if the user already exists
      const userQuerySnapshot = await db.collection('users').where('email', '==', email).get();
      if (!userQuerySnapshot.empty) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
  
      // If the user doesn't exist, create a new user
      const userRef = await db.collection('users').add({
        name: name,
        email: email,
        password: password,
        type: type,
      });
  
      res.status(201).json({ message: 'User created successfully', id: userRef.id });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });
  app.post('/addparentemail', async (req, res) => {
    try {
      const {email} = req.body;
  
      const userRef = await db.collection('parents').add({
        email: email,
      });
  
      res.status(201).json({ message: 'Parents Email Added successfully', id: userRef.id });
    } catch (error) {
      console.error('Error adding email:', error);
      res.status(500).json({ error: 'Failed to add parents email' });
    }
  });

  app.get('/users', async (req, res) => {
    try {
      const snapshot = await db.collection('users').get();
      const users = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        users.push({ id: doc.id, ...data });
      });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
