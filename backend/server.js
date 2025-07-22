// backend/server.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// --- A More Realistic In-Memory Database ---
// We now model Artists, Beats, Users, Purchases, and Projects.
const db = {
    artists: [
        { artistId: 'artist1', name: 'neofantasia' }
    ],
    users: [
        { userId: 'user1', name: 'John Doe' }
    ],
    beats: [
        { id: 'beat1', artistId: 'artist1', title: 'Still', price: 29.99, audioSrc: '/sfx/still.mp3', artwork: '/artwork/artw1.png' },
        { id: 'beat2', artistId: 'artist1', title: 'Shrine', price: 29.99, audioSrc: '/sfx/shrine.mp3', artwork: '/artwork/ffx1.gif' },
        { id: 'beat3', artistId: 'artist1', title: 'Summers Gone', price: 29.99, audioSrc: '/sfx/summersgone.wav', artwork: '/artwork/ffx1.gif' }
    ],
    // This tracks the raw purchase requests from the cart.
    purchases: [],
    // This is the NEW table. It represents the actual collaboration spaces.
    projects: []
};


// --- API Routes ---

// GET all available beats for the store page
app.get('/api/beats', (req, res) => {
    // We can enrich the beat data with the artist's name.
    const beatsWithArtist = db.beats.map(beat => {
        const artist = db.artists.find(a => a.artistId === beat.artistId);
        return { ...beat, artist: artist ? artist.name : 'Unknown Artist' };
    });
    res.status(200).json(beatsWithArtist);
});

// POST a new purchase request from the CartPage
app.post('/api/purchase', (req, res) => {
  const { userId, beatId } = req.body;
  if (!userId || !beatId) {
    return res.status(400).json({ msg: 'User ID and Beat ID are required.' });
  }
  const newPurchase = {
    purchaseId: `purchase_${Date.now()}`,
    userId,
    beatId,
    status: 'pending',
    requestedAt: new Date().toISOString()
  };
  db.purchases.push(newPurchase);
  res.status(201).json({ msg: 'Purchase request received. Awaiting admin approval.', purchase: newPurchase });
});


// --- Collaboration Hub Route ---

// GET all active projects for a user's CollaborationHub
app.get('/api/hub/projects/:userId', (req, res) => {
    const { userId } = req.params;
    const userProjects = db.projects
        .filter(p => p.userId === userId)
        .map(project => {
            // Enrich the project data with beat and artist info for the frontend
            const beat = db.beats.find(b => b.id === project.beatId);
            const artist = db.artists.find(a => a.artistId === project.artistId);
            return {
                ...project,
                beatTitle: beat ? beat.title : 'Unknown Beat',
                artistName: artist ? artist.name : 'Unknown Artist',
                artwork: beat ? beat.artwork : ''
            };
        });
    res.status(200).json(userProjects);
});


// --- Admin Routes ---

// GET all pending purchases for the admin panel
app.get('/api/admin/pending', (req, res) => {
    const pending = db.purchases.filter(p => p.status === 'pending');
    res.status(200).json(pending);
});

// THIS IS THE MOST IMPORTANT ENDPOINT
// It approves a purchase AND creates the collaboration project.
app.post('/api/admin/approve/:purchaseId', (req, res) => {
    const { purchaseId } = req.params;
    const purchase = db.purchases.find(p => p.purchaseId === purchaseId);

    if (!purchase) {
        return res.status(404).json({ msg: 'Purchase not found.' });
    }
    if (purchase.status === 'approved') {
        return res.status(400).json({ msg: 'This purchase has already been approved.' });
    }

    // 1. Mark the purchase as 'approved'
    purchase.status = 'approved';

    // 2. Create the new Collaboration Project
    const beat = db.beats.find(b => b.id === purchase.beatId);
    if (!beat) {
        return res.status(500).json({ msg: 'Could not find the beat associated with this purchase.' });
    }

    const newProject = {
        projectId: `proj_${Date.now()}`,
        userId: purchase.userId,
        beatId: purchase.beatId,
        artistId: beat.artistId,
        createdAt: new Date().toISOString(),
        // These fields make it a real workspace
        tasks: [],
        messages: [],
        files: []
    };
    db.projects.push(newProject);
    console.log('New Project Created:', newProject);

    res.status(200).json({ msg: 'Purchase approved and project created!', project: newProject });
});


// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Backend server is running perfectly on http://localhost:${PORT}`);
});