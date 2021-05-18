import express from 'express';
const router = express.Router();

router.get('*', (req, res) => {
	res.render('404', {
		TITLE: 'Puppala Koushik | 404',
		DESCRIPTION: '',
		KEYWORDS: '',
		success: false,
	});
});

export default router;
