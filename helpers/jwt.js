const expressJwt = require("express-jwt");

const authJwt = () => {
	return expressJwt({
		secret: process.env.JWT_SECRET,
		algorithms: ["HS256"],
	}).unless({
		path: [
			{ url: /\/api\/v1\/products(.*)/, method: ["GET", "OPTIONS"] },
			{ url: /\/api\/v1\/categories(.*)/, method: ["GET", "OPTIONS"] },
			`${process.env.API_URL}/users/login`,
			`${process.env.API_URL}/users/register`,
		],
	});
};

module.exports = authJwt;
