// IMPORTS 
const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'mln45eneko9hqqbeli47jeerm0krt1cabp9dv7gg';

// EXPORTED FUNCTIONS
module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id,
            moderator: userData.moderator
        },
        JWT_SIGN_SECRET, {
            expiresIn: '24h'
        })
    },
};