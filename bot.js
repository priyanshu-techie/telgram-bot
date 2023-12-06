import axios from 'axios';
import botConfig from './configBot.js';

const bot = botConfig();

class OutputClass{
    constructor(data,index){
        this.data =data;
        this.index = index;
        this.length = data.length;
    }
    
    generateOutput(){
        let output = `(${this.data[this.index].meanings[0].partOfSpeech})\n`;
        this.data[this.index].meanings[0].definitions.forEach((e,ind) => {
            output += `<b>${ind+1}</b>. ${e.definition}\n \t ${e.example?`<i>->${e.example}</i>`:""} \n \n`;
        })
        return output;
    }
// Function to handle button clicks
    handleButtonClick(callbackQuery) {
        try {
            const data = callbackQuery.data;
            let newMessage ='';
            // Perform some operation based on the button clicked
            if (data === 'moveBack') {
                if(this.index>0){
                    this.index--;
                    newMessage = this.generateOutput();
                }
            } else if (data === 'moveForward') {
                if(this.index< (this.length)-1){
                    this.index++;                    
                    newMessage = this.generateOutput();
                }
            }
            // if(newMessage !== '')
                bot.editMessageText(newMessage, { chat_id: callbackQuery.message.chat.id, message_id: callbackQuery.message.message_id });
        } catch (error) {
            console.error('Error handling button click:', error);
        }
    };
}

// Set up the inline keyboard
const inlineKeyboard = {
    inline_keyboard: [
        [{ text: '<<', callback_data: 'moveBack' }],
        [{ text: '>>', callback_data: 'moveForward' }],
    ]
};

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
        let index = 2;
        let outputObject = new OutputClass(data,index);
        let output = outputObject.generateOutput();
        await bot.sendMessage(chatId, output,{parse_mode:"HTML", reply_markup:JSON.stringify(inlineKeyboard)})
        bot.on('callback_query', outputObject.handleButtonClick);

        // sending the audio if availiable :
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
