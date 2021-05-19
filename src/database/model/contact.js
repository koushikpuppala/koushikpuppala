const { Schema, model } = require('mongoose');

const ContactSchema = Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Subject: {
        type: String,
        required: true,
    },
    Message: {
        type: String,
        required: true,
    },
});

module.exports = model('Contact Forms', ContactSchema);