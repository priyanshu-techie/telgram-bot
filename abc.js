import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
config({path:'./.env'});


const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Set up the inline keyboard
const inlineKeyboard = {
    inline_keyboard: [
        [{ text: 'Button 1', callback_data: 'button1' }],
        [{ text: 'Button 2', callback_data: 'button2' }],
    ]
};

// Function to handle button clicks
const handleButtonClick = (callbackQuery) => {
    try {
        const data = callbackQuery.data;
        let newMessage ='';
        // Perform some operation based on the button clicked
        if (data === 'button1') {
            // Do something for button1
            newMessage = "button 1 clicked!";
        } else if (data === 'button2') {
            // Do something for button2
            newMessage = "button 2 clicked!";
        }
        bot.editMessageText(newMessage, { chat_id: callbackQuery.message.chat.id, message_id: callbackQuery.message.message_id });
    } catch (error) {
        console.log("button pressing error:   ",error);
    }
};



bot.on('callback_query', handleButtonClick);

bot.on('message',(msg)=>{
    const chatId = msg.chat.id;
    // Send a message with the inline keyboard
    bot.sendMessage(chatId, 'Click a button:', { reply_markup: JSON.stringify(inlineKeyboard) })
    }) 