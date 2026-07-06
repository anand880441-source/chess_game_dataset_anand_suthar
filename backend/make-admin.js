const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function makeAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // CHANGE THIS EMAIL TO YOUR LOGIN EMAIL
        const email = 'anand880441@gmail.com';  // <--- CHANGE THIS LINE

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        // Find the user
        const user = await usersCollection.findOne({ email: email });

        if (!user) {
            console.log(`❌ User with email ${email} not found!`);
            console.log('Available users:');
            const allUsers = await usersCollection.find({}).toArray();
            allUsers.forEach(u => console.log(`  - ${u.email}`));
            await mongoose.disconnect();
            return;
        }

        console.log(`Found user: ${user.email}, Current role: ${user.role || 'user'}`);

        // Update to admin
        const result = await usersCollection.updateOne(
            { email: email },
            { $set: { role: 'admin' } }
        );

        if (result.modifiedCount > 0) {
            console.log(`✅ User ${email} is now an ADMIN!`);
        } else {
            console.log(`⚠️ Could not update. User may already be admin.`);
        }

        // Verify
        const updated = await usersCollection.findOne({ email: email });
        console.log(`Verified role: ${updated.role}`);

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

makeAdmin();
