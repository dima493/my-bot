const http = require('http');
const bedrock = require('bedrock-protocol');

http.createServer((req, res) => {
    res.write('Bot Status: Online');
    res.end();
}).listen(process.env.PORT || 3000);

const botOptions = {
    host: 'chamois.aternos.host',
    port: 27843,
    username: 'VNTU_Bot_' + Math.floor(Math.random() * 100),
    offline: true,
    skipPing: true,
    version: '1.21.50'
    // raknetBackend видалено для автоматичного вибору
};

function createBot() {
    console.log(`[${new Date().toLocaleTimeString()}] 🚀 Підключення...`);
    
    try {
        const client = bedrock.createClient(botOptions);

        client.on('spawn', () => {
            console.log('✅ Бот на сервері!');
            
            setInterval(() => {
                if (client.status === 'open') {
                    client.write('player_auth_input', {
                        pitch: 0, yaw: 0, position: { x: 0, y: 0, z: 0 },
                        move_vector: { x: 0, z: 0 }, head_yaw: 0,
                        input_data: { jump_down: false, sneak_down: true },
                        input_mode: 'mouse', play_mode: 'normal', interaction_model: 'touch',
                        tick: 0n, delta: { x: 0, y: 0, z: 0 }
                    });
                }
            }, 45000);
        });

        client.on('error', (err) => console.log('❌ Помилка:', err.message));
        client.on('close', () => setTimeout(createBot, 30000));
    } catch (e) {
        setTimeout(createBot, 30000);
    }
}

createBot();
