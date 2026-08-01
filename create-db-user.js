const { MongoClient } = require('mongodb');

async function run() {
  // Connect to the local MongoDB without auth first
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    // We create the user in the 'admin' database so it can authenticate properly 
    // as per the connection string: ?authSource=admin
    const db = client.db('admin');
    
    console.log("Creating user 'athira'...");
    
    // Check if user exists, if not create it
    try {
      await db.command({
        createUser: "athira",
        pwd: "athira123",
        roles: [
          { role: "readWrite", db: "capstoneproject" },
          { role: "readWrite", db: "CapstoneProject" }
        ]
      });
      console.log("✅ User 'athira' created successfully!");
    } catch (err) {
      if (err.codeName === 'DuplicateKey' || err.message.includes('already exists')) {
        console.log("User 'athira' already exists. Updating password to ensure it's correct...");
        await db.command({
          updateUser: "athira",
          pwd: "athira123",
          roles: [
            { role: "readWrite", db: "capstoneproject" },
            { role: "readWrite", db: "CapstoneProject" }
          ]
        });
        console.log("✅ User 'athira' password updated successfully!");
      } else {
        throw err;
      }
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
  }
}

run();
