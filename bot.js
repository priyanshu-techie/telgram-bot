import TelegramBot from 'node-telegram-bot-api';   
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({path:'./.env'});
const telegramToken = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(telegramToken,{polling:true});


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
        const output = 
        await bot.sendMessage(chatId, data[0].meanings[0].definitions[0].definition);
        bot.sendAudio(chatId, data[0].phonetics[0].audio);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            bot.sendMessage(chatId, "Sorry, the word was not found in the dictionary 😔😔. \n<b>NOTE:</b> sentences are not allowed, send a word.",{ parse_mode: "HTML" });
        } else {
            // Handle other errors
            console.log(error);
        }
    }
})
