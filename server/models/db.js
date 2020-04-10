const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (!err) {
        console.log('MongoDB connection successful.');
    } else {
        console.log(`MongoDB connection error: ${JSON.stringify(err, undefined, 2)}`);
    }
});

require('./user.model');
require('./match.model');
require('./deliveries.model');
require('./performance.model');
