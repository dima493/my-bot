const http = require('http');
const bedrock = require('bedrock-protocol');

// Тримає порт відкритим для Render, запобігаючи зупинці процесу
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot Process is Active');
}).listen(process.env.PORT || 3000);

// Конфігурація цільового сервера
const hostAddress = 'steelhead.aternos.host'; // Замінити на поточну динамічну адресу
const hostPort = 27843;                       // Замінити на поточний динамічний порт

function createBot() {
    const botUsername = 'VNTU_' + Math.floor(Math.random() * 9000 + 1000);
    console.log(`[${new Date().toISOString()}] Ініціалізація підключення: ${botUsername}`);

    try {
        const client = bedrock.createClient({
            host: hostAddress,
            port: hostPort,
            username: botUsername,
            offline: true,
            skipPing: true,
            version: '1.21.50',
            raknetBackend: 'js',
            connectTimeout: 120000
        });

        let afkInterval;

        client.on('spawn', () => {
            console.log(`[${new Date().toISOString()}] Підключення встановлено успішно.`);
            
            // Генерація пакетів активності для обходу таймера Aternos
            afkInterval = setInterval(() => {
                if (client.status === 'open') {
                    client.write('player_auth_input', {
                        pitch: 0, yaw: 0, position: { x: 0, y: 0, z: 0 },
                        move_vector: { x: 0, z: 0 }, head_yaw: 0,
                        input_data: { jump_down: false, sneak_down: true },
                        input_mode: 'mouse', play_mode: 'normal', interaction_model: 'touch',
                        tick: 0n, delta: { x: 0, y: 0, z: 0 }
                    });
                }
            }, 30000); 
        });

        client.on('error', (err) => {
            console.log(`[${new Date().toISOString()}] Помилка клієнта: ${err.message}`);
        });

        client.on('disconnect', (packet) => {
            console.log(`[${new Date().toISOString()}] Відключено сервером. Причина: ${packet.reason}`);
        });

        client.on('close', () => {
            clearInterval(afkInterval);
            console.log(`[${new Date().toISOString()}] З'єднання закрито. Рестарт процесу через 30 секунд.`);
            setTimeout(createBot, 30000);
        });

    } catch (error) {
        console.log(`[${new Date().toISOString()}] Критична помилка ініціалізації: ${error.message}`);
        setTimeout(createBot, 30000);
    }
}

createBot();
