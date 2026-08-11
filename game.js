const mysql = require('mysql2');

// डेटाबेस कनेक्शन बनाएं
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // अपना डेटाबेस पासवर्ड यहाँ लिखें
    database: 'tulsi_win'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database as id ' + db.threadId);
});

module.exports = db;
