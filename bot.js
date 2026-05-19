const http = require('http');
const bedrock = require('bedrock-protocol');

http.createServer((req, res) => {
    res.write('Bot Status: Online');
    res.end();
}).listen(process.env.PORT || 3000);

const botOptions = {
    // Використовуємо динамічну адресу для обходу фільтрів
    host: 'steelhead.aternos.host', 
    port: 27843, // УВАГА: перевір, чи не змінився порт у вікні Connect
    username: 'VNTU_Bot_' + Math.floor(Math.random() * 1000),
    offline: true,
    skipPing: true,
    version: '1.21.50', // Залишаємо 50 для стабільності бібліотеки
    connectTimeout: 90000 
};

function createBot() {
    console.log(`[${new Date().toLocaleTimeString()}] 🚀 Підключення...`);
    
    try {
        const client = bedrock.createClient(botOptions);

        // Додай це всередину функції createBot після створення client
        client.on('packet', (packet) => {
            // Виводимо назву будь-якого пакету, що прийшов від сервера
            if (packet.data.name) {
                console.log('📡 Отримано пакет:', packet.data.name);
            }
        });
        
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
