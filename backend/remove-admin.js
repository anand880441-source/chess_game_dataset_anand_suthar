const mongoose = require('mongoose');
require('dotenv').config();

async function removeAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const email = 'test@example.com';  // CHANGE THIS
        
        const result = await mongoose.connection.db.collection('users').updateOne(
            { email: email },
            { $set: { role: 'user' } }
        );
        
        if (result.modifiedCount > 0) {
            console.log(`✅ User ${email} is now a regular USER`);
        } else {
            console.log(`⚠️ User not found or already user`);
        }
        
        await mongoose.disconnect();
    } catch(err) {
        console.error('Error:', err.message);
    }
}
removeAdmin();
