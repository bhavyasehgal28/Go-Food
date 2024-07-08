const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://bhavyasehgal28:8PnNAw438zzPjJ7v@cluster0.dwz8ug2.mongodb.net/?retryWrites=true&w=majority&appName=cluster0'; 

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
