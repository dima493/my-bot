const bedrock = require('bedrock-protocol')

const botOptions = {
    host: 'fill.aternos.me',
    port: 27843,
    username: 'StayOnline_Bot',
    offline: true,
    skipPing: true, 
    // Вказуємо версію сервера зі скриншоту
    version: '1.21.50' 
}

function createBot() {
    console.log('🚀 Пробую зайти на Bedrock 1.21.50...');
    const client = bedrock.createClient(botOptions);

    client.on('spawn', () => {
        console.log('✅ Бот на сервері! Тепер сервер НЕ вимкнеться.');
    });

    client.on('error', (err) => {
        console.log('❌ Помилка:', err.message);
    });

    client.on('close', () => {
        // Якщо версія все одно не підходить, бібліотека може викинути помилку тут
        console.log('🔄 З’єднання розірвано. Перепідключення...');
        setTimeout(createBot, 20000);
    });
}

createBot();