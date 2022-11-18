const TelegramApi = require('node-telegram-bot-api')

const { gameOptions, againOptions } = require('./options')

const token = ''

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Let's play game with me, about found numbers at 0 to 9`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Found it`, gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Welcome to chat'},
        {command: '/info', description: 'Information about user'},
        {command: '/game', description: 'Game to play'}
    ])
    
    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
           return bot.sendMessage(chatId, `Hello ${msg.from.username}, Welcome to Somsa Bot Uz`)
        }
    
        if (text === '/info') {
           return bot.sendMessage(chatId, `You're name is ${msg.from.first_name}`)
        }
    
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, " I can't understand you, please try again!) ");
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Congratulations you found the number ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Oh my :(  u cannot found the number ${chats[chatId]}`, againOptions)
        } 
    })
}

start()
