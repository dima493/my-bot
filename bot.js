const http = require('http');
const bedrock = require('bedrock-protocol');

// 1. Фейковий веб-сервер для стабільної роботи на Render
http.createServer((req, res) => {
  res.write('Bot Status: Online');
  res.end();
}).listen(process.env.PORT || 3000);

// 2. Налаштування підключення (версія 1.21.130+)
const botOptions = {
    host: 'fill.aternos.me',
    port: 27843,
    username: 'StayOnline_Bot',
    offline: true,
    skipPing: true,
    version: '1.21.50',
};

function createBot() {
    console.log('🚀 Спроба підключення до fill.aternos.me...');
    const client = bedrock.createClient(botOptions);

    client.on('spawn', () => {
    console.log('✅ Бот зайшов!');
    
    setInterval(() => {
        if (client.status === 'open') {
            client.write('player_auth_input', {
                pitch: 0, yaw: 0,
                position: { x: 0, y: 0, z: 0 },
                move_vector: { x: 0, z: 0 },
                head_yaw: 0,
                input_data: { jump_down: false, sneak_down: true }, // Тепер він "присідає"
                input_mode: 'mouse', play_mode: 'normal', interaction_model: 'touch',
                tick: 0n, delta: { x: 0, y: 0, z: 0 }
            });
            console.log('📡 Пакет активності (Shift)');
        }
    }, 45000); 
});

client.on('disconnect', (packet) => {
    console.log('❌ Кікнуто з причини:', packet.reason);
});
    client.on('error', (err) => {
        console.log('❌ Помилка:', err.message);
    });

    client.on('close', () => {
        console.log('🔄 З’єднання розірвано. Перепідключення через 20 секунд...');
        setTimeout(createBot, 20000);
    });
}

createBot();
