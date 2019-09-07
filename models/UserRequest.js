const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

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
    filename: {
        type: String,
        required: true
    },
    md5: {
        type: String,
        required: true
    },
    uploadedOn: {
        type: Date,
        required: true
    },
    status: {
        type:String,
        required: true
    },
    id: {
        type: ObjectId
    }
});

module.exports = UserRequest = mongoose.model('userRequest', UserRequestSchema);