const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserRequestSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    uploadedFilename: {
        type: String,
        required: true
    }
});

module.exports = UserRequest = mongoose.model('userRequest', UserRequestSchema);