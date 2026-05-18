const http = require('http');
const bedrock = require('bedrock-protocol');

http.createServer((req, res) => {
  res.write('Bot Status: Online');
  res.end();
}).listen(process.env.PORT || 3000);

const botOptions = {
    // ВАЖЛИВО: Натисни на (i) в Атерносі та впиши сюди Address і Port
    host: 'fill.aternos.me', 
    port: 27843,
    username: 'VNTU_Bot_' + Math.floor(Math.random() * 100),
    offline: true,
    skipPing: true,
    version: '1.21.50',
    connectTimeout: 90000 // Чекаємо до 90 секунд
};

function createBot() {
    console.log(`[${new Date().toLocaleTimeString()}] 🚀 Початок підключення до ${botOptions.host}:${botOptions.port}`);
    
    const client = bedrock.createClient(botOptions);

    // Відстеження етапів підключення
    client.on('connect', () => console.log('📡 Етап 1: Встановлено зв\'язок з хостом...'));
    client.on('resource_packs_info', () => console.log('📡 Етап 2: Отримано інфо про ресурс-паки...'));
    client.on('join', () => console.log('📡 Етап 3: Сервер прийняв бот-пакет...'));

    client.on('spawn', () => {
        console.log('✅ Бот повністю заспавнився на сервері!');
    });

    client.on('error', (err) => {
        console.log('❌ Помилка:', err.message);
    });

    client.on('disconnect', (packet) => {
        console.log('❌ Від’єднано. Причина:', packet.reason);
    });

    client.on('close', () => {
        console.log('🔄 Закрито. Перепідключення через 30 сек...');
        setTimeout(createBot, 30000);
    });
}

createBot();
