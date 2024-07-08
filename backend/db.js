const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/byyy'; 

module.exports = async function (callback) {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("connected to mongo");

        const foodCollection = mongoose.connection.db.collection("food_items");
        const data = await foodCollection.find({}).toArray();

        const categoryCollection = mongoose.connection.db.collection("Categories");
        const Catdata = await categoryCollection.find({}).toArray();

        callback(null, data, Catdata);
    } catch (err) {
        console.error("---" + err);
        callback(err, null, null);
    }
};
