const mongoose = require('mongoose');

const connectToDatabase = async (link) => {
    return await mongoose.connect(link);
}

module.exports = {
    connectToDatabase
}