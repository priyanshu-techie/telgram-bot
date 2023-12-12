import TelegramBot from 'node-telegram-bot-api';   
import { config } from 'dotenv';
config({path:'./.env'});

export default function botConfig(){
    const telegramToken = process.env.TELEGRAM_TOKEN;
    
    const bot = new TelegramBot(telegramToken,{polling:true});
    return bot;
}
