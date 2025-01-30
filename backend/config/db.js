const mongoose = require('mongoose')

exports.connectToDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected Successfully!");
        console.log("Database Host:", connection.connection.host);
        console.log("Database Name:", connection.connection.name);
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};
