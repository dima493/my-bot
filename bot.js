const http = require('http');
const bedrock = require('bedrock-protocol');

// 1. Веб-сервер для стабільності на Render
http.createServer((req, res) => {
    res.write('Bot Status: Online');
    res.end();
}).listen(process.env.PORT || 3000);

// 2. Налаштування підключення
const botOptions = {
    host: 'zander.aternos.host', 
    port: 27843,
    username: 'VNTU_Bot_' + Math.floor(Math.random() * 100),
    offline: true,
    skipPing: true,
    version: '1.21.50',
    raknetBackend: 'js' // Важливо для Render
};

function createBot() {
    console.log(`[${new Date().toLocaleTimeString()}] 🚀 Підключення до ${botOptions.host}...`);
    
    const client = bedrock.createClient(botOptions);

    client.on('spawn', () => {
        console.log('✅ Бот успішно зайшов на сервер!');
        
        // Anti-AFK цикл
        setInterval(() => {
            if (client.status === 'open') {
                client.write('player_auth_input', {
                    pitch: 0, yaw: 0, position: { x: 0, y: 0, z: 0 },
                    move_vector: { x: 0, z: 0 }, head_yaw: 0,
                    input_data: { jump_down: false, sneak_down: true },
                    input_mode: 'mouse', play_mode: 'normal', interaction_model: 'touch',
                    tick: 0n, delta: { x: 0, y: 0, z: 0 }
                });
                console.log('📡 Пакет активності відправлено');
            }
        }, 45000);
    });

    client.on('error', (err) => {
        console.log('❌ Помилка:', err.message);
    });

    client.on('close', () => {
        console.log('🔄 З’єднання закрите. Перепідключення через 30 сек...');
        setTimeout(createBot, 30000);
    });
}

createBot();
