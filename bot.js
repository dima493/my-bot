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
    version: '1.21.130', // Оновлено згідно з логами твого сервера
    raknetBackend: 'js'   // Щоб уникнути помилок з C++ бібліотеками
};

function createBot() {
    console.log('🚀 Спроба підключення до fill.aternos.me...');
    const client = bedrock.createClient(botOptions);

    client.on('spawn', () => {
        console.log('✅ Бот успішно зайшов на сервер!');

        // 3. Логіка АНТИ-AFK (Бот буде надсилати пакети активності)
        // Кожні 30 секунд бот "махає рукою" або оновлює свою позицію
        setInterval(() => {
            if (client.status === 'open') {
                // Відправляємо пакет руху (навіть якщо стоїмо на місці)
                // Це змушує сервер думати, що гравець активний
                client.write('player_auth_input', {
                    pitch: 0,
                    yaw: 0,
                    position: { x: 0, y: 0, z: 0 },
                    move_vector: { x: 0, z: 0 },
                    head_yaw: 0,
                    input_data: { jump_down: true }, // Спроба стрибка
                    input_mode: 'mouse',
                    play_mode: 'normal',
                    interaction_model: 'touch',
                    tick: 0n,
                    delta: { x: 0, y: 0, z: 0 }
                });
                console.log('📡 Пакет активності відправлено (Anti-AFK)');
            }
        }, 30000);
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