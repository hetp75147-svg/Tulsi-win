const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let users = [];
let gameHistory = [];
let currentTimer = 30; // 30 सेकंड का गेम राउंड
let winningColor = '';

// गेम का टाइमर और रिजल्ट जनरेटर
setInterval(() => {
    currentTimer--;
    if (currentTimer <= 0) {
        currentTimer = 30; // टाइमर रीसेट
        // रैंडम रिजल्ट चुनना (Green, Red, Violet)
        const colors = ['Green', 'Red', 'Green', 'Red', 'Violet'];
        winningColor = colors[Math.floor(Math.random() * colors.length)];
        
        gameHistory.unshift({ color: winningColor, time: new Date().toLocaleTimeString() });
        if (gameHistory.length > 10) gameHistory.pop(); // सिर्फ आखिरी 10 रिजल्ट रखें
    }
}, 1000);

// टाइमर और पिछले परिणाम देखने की एपीआई
app.get('/api/gamestate', (req, res) => {
    res.json({ timer: currentTimer, history: gameHistory });
});

// बेट लगाने (Bet Place करने) की एपीआई
app.post('/api/bet', (req, res) => {
    const { phone, betColor, amount } = req.body;
    let user = users.find(u => u.phone === phone);

    if (!user) {
        return.status(404).json({ success: false, message: "User not found" });
    }

    if (user.balance < amount) {
        return.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // पैसे काट लें
    user.balance -= amount;

    // सरल जीत का नियम (अगर चुना गया रंग और रिजल्ट मैच हुआ तो पैसा डबल)
    let won = betColor === winningColor;
    let winAmount = 0;
    if (won) {
        winAmount = amount * 2;
        user.balance += winAmount;
    }

    res.json({ 
        success: true, 
        won, 
        winAmount, 
        newBalance: user.balance, 
        winningColor 
    });
});

app.listen(3000, () => {
    console.log('Tulsi Win Backend running on port 3000');
});
