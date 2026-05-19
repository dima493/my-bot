// ЖОРСТКА ПІДМІНА МОДУЛІВ ДО БУДЬ-ЯКИХ ІМПОРТІВ
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function (id) {
    // Перехоплюємо сам raknet-native
    if (id === 'raknet-native') {
        return { RakClient: undefined, RakServer: undefined };
    }
    // Перехоплюємо внутрішній модуль протоколу node-raknet
    if (id === 'node-raknet' || id.includes('node-raknet')) {
        return {
            Client: function() {
                this.connect = () => {};
                this.ping = () => {};
                this.close = () => {};
            },
            Server: function() {}
        };
    }
    return originalRequire.apply(this, arguments);
};

const http = require('http');
const bedrock = require('bedrock-protocol');

// 1. Веб-сервер для успішного проходження Health Check на Render
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot Status: Online\n');
}).listen(process.env.PORT || 3000, () => {
    console.log(`[Система] HTTP сервер запущено на порту ${process.env.PORT || 3000}`);
});

// 2. Параметри підключення
const HOST = 'fill.aternos.me'; 
const PORT = 27843;                  

const botOptions = {
    host: HOST,
    port: PORT,
    username: 'VNTU_Bot_' + Math.floor(Math.random() * 100),
    offline: true,
    skipPing: true,
    version: '1.21.50',
    raknetBackend: 'js' // Використовуємо вбудований у бібліотеку чистий JS-рушій
};

function createBot() {
    console.log(`[${new Date().toLocaleTimeString()}] 🚀 Спроба підключення до ${HOST}:${PORT}...`);
    
    try {
        const client = bedrock.createClient(botOptions);
        let afkInterval;

        client.on('spawn', () => {
            console.log(`[${new Date().toLocaleTimeString()}] ✅ Бот успішно заспавнився на сервері.`);
            
            afkInterval = setInterval(() => {
                if (client.status === 'open') {
                    try {
                        client.write('player_auth_input', {
                            pitch: 0, yaw: 0, position: { x: 0, y: 64, z: 0 },
                            move_vector: { x: 0, z: 0 }, head_yaw: 0,
                            input_data: { jump_down: false, sneak_down: true },
                            input_mode: 'mouse', play_mode: 'normal', interaction_model: 'touch',
                            tick: 0n, delta: { x: 0, y: 0, z: 0 }
                        });
                    } catch (e) {
                        console.log('⚠️ Помилка відправки Anti-AFK пакета');
                    }
                }
            }, 30000);
        });

        client.on('error', (err) => {
            console.log(`[${new Date().toLocaleTimeString()}] ❌ Помилка протоколу: ${err.message}`);
        });

        client.on('close', () => {
            if (afkInterval) clearInterval(afkInterval);
            console.log(`[${new Date().toLocaleTimeString()}] 🔄 З'єднання втрачено. Перепідключення через 30 секунд...`);
            setTimeout(createBot, 30000);
        });

    } catch (e) {
        console.log(`[${new Date().toLocaleTimeString()}] 🛑 Помилка ініціалізації: ${e.message}`);
        setTimeout(createBot, 30000);
    }
}

createBot();
