import TelegramBot from 'node-telegram-bot-api';   
import axios from 'axios';
import { config } from 'dotenv';
import {generateOutput} from './utils.js';
config({path:'./.env'});

const telegramToken = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(telegramToken,{polling:true});

// Set up the inline keyboard
const inlineKeyboard = {
    inline_keyboard: [
        [{ text: '<<', callback_data: 'moveBack' }],
        [{ text: '>>', callback_data: 'moveForward' }],
    ]
};

const handleButtonClick = (callbackQuery)=>{
    try {
        const data = callbackQuery.data;
        let newMessage ='';
        // Perform some operation based on the button clicked
        if (data === 'moveBack') {
            // Do something for button1
            newMessage = "button 1 clicked!";
        } else if (data === 'moveForward') {
            // Do something for button2
            newMessage = "button 2 clicked!";
        }
        bot.editMessageText(newMessage, { chat_id: callbackQuery.message.chat.id, message_id: callbackQuery.message.message_id });
    } catch (error) {
        console.log("button pressing error:   ",error);
    }
}

bot.on('callback_query', handleButtonClick);

bot.on("message",async(msg)=>{
    const chatId = msg.chat.id;
    const messageText = msg.text.toString().toLowerCase();
    if(messageText === "/start"){
        bot.sendMessage(chatId,
            "Hey There! Welcome to the Dictionary bot.\n Simply send me the word and i will send you it's meaning.");
            return;
    }
    try {
        const resp = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${messageText}`);
        const data = await resp.data; 
        let index = 0;
        let output =  generateOutput(data,index);
        await bot.sendMessage(chatId, output,{parse_mode:"HTML", reply_markup:JSON.stringify(inlineKeyboard)})
        if(!data[0].phonetics && !data[0].phonetics[0].audio)
            bot.sendAudio(chatId, data[0].phonetics[0].audio).catch(e=>console.log("no audio found"));
        
    } catch (error) {
        if (error.response && error.response.status === 404) {
            bot.sendMessage(chatId, "Sorry, the word was not found in the dictionary 😔😔. \n<b>NOTE:</b> sentences are not allowed, send a word.",{ parse_mode: "HTML" });
        } else {
            // Handle other errors
            console.log(error);
        }
    }
})

