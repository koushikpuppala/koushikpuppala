const router = require("express").Router();

router.get("*", (req, res) => {
	res.status(404).render("404", {
		TITLE: "Puppala Koushik | 404",
		DESCRIPTION: "",
		KEYWORDS: "",
		BODY: "",
		success: false,
	});
});

module.exports = router;
