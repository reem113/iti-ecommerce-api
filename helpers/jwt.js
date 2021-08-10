const expressJwt = require("express-jwt");

const authJwt = () => {
	return expressJwt({
		secret: process.env.JWT_SECRET,
		algorithms: ["HS256"],
		isRevoked: async function (req, payload, done) {
			if (!payload.isAdmin) {
				done(null, true);
			}
			done();
		},
	}).unless({
		path: [
			// /\/api\/v1\/(.*)/, // <-- to exclude all routes uncomment this line
			{ url: /\/api\/v1\/products(.*)/, method: ["GET", "OPTIONS"] },
			{ url: /\/api\/v1\/categories(.*)/, method: ["GET", "OPTIONS"] },
			`${process.env.API_URL}/users/login`,
			`${process.env.API_URL}/users/register`,
		],
	});
};

module.exports = authJwt;
