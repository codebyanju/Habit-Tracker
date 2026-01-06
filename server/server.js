import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;


app.use(cors());
app.use(bodyParser.json());


const USER_DATA_DIR = path.join(__dirname, '../userdata');

// Ensure userdata directory exists
if (!fs.existsSync(USER_DATA_DIR)) {
    fs.mkdirSync(USER_DATA_DIR);
}

const DEFAULTS_FILE = path.join(USER_DATA_DIR, 'defaults.json');

// Get Global Defaults
app.get('/api/defaults', (req, res) => {
    if (fs.existsSync(DEFAULTS_FILE)) {
        const data = fs.readFileSync(DEFAULTS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } else {
        res.json([]);
    }
});

// Save Global Defaults
app.post('/api/defaults', (req, res) => {
    try {
        fs.writeFileSync(DEFAULTS_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true, message: 'Defaults saved' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to save defaults' });
    }
});

// Get data for a specific month (with Auto-Seeding)
app.get('/api/data/:monthId', (req, res) => {
    const { monthId } = req.params;
    const filePath = path.join(USER_DATA_DIR, `${monthId}.json`);

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        res.json(JSON.parse(data));
    } else {
        // Month doesn't exist: SEED from Defaults
        let defaultHabits = [];
        if (fs.existsSync(DEFAULTS_FILE)) {
            try {
                const defaults = JSON.parse(fs.readFileSync(DEFAULTS_FILE, 'utf8'));
                // Map defaults to full habit objects
                defaultHabits = defaults.map(d => ({
                    id: crypto.randomUUID(),
                    name: d.name,
                    color: d.color,
                    createdAt: new Date().toISOString()
                }));
            } catch (e) {
                console.error("Error reading defaults for seeding:", e);
            }
        }

        res.json({
            monthId,
            habits: defaultHabits,
            dailyLogs: {},
            reflection: { summary: "", mood: "" }
        });
    }
});

// Save data for a specific month
app.post('/api/data/:monthId', (req, res) => {
    const { monthId } = req.params;
    const data = req.body;
    const filePath = path.join(USER_DATA_DIR, `${monthId}.json`);

    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        res.json({ success: true, message: 'Data saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to save data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
