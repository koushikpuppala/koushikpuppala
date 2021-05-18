import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
	res.sendFile(__dirname, '/../public/js/arc-sw.js');
});

export default router;
