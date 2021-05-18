import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/arc-sw.js', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/js/arc-sw.js'));
});

export default router;
