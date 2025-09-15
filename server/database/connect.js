const mongoose = require('mongoose'); // Mongoose là thư viện để làm việc với MongoDB

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_STR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Database successfully connected at host: ${conn.connection.host}, db: ${conn.connection.name}`);
    return conn.connection;
  } catch (err) {
    console.error(`❌ Database connection error: ${err.message}`);
    process.exit(1); // Dừng server nếu kết nối DB thất bại
  }
};

module.exports = connectDb;
//exports the connection function for use anywhere