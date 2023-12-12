import axios from 'axios';
import botConfig from './configBot.js';
import http from 'http';
import url from 'url';

// just creating a server to keep active 
http.createServer((req,res)=>{
    let parsedUrl = url.parse(req.url,true);
    const path = parsedUrl.pathname;

    if(path === '/'){
    res.writeHead(200,{'Content-type':'text/html'})
    res.write("hello world");
    res.end();
    }
}).listen(3000);

const bot = botConfig();
    
function generateOutput(data){
    let output = `(${data[0].meanings[0].partOfSpeech})\n`;
    data[0].meanings[0].definitions.forEach((e,ind) => {
    output += `<b>${ind+1}</b>. ${e.definition}\n \t ${e.example?`<i>->${e.example}</i>`:""} \n \n`;
    })
    return output;
}

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

        let output =  generateOutput(data);
        await bot.sendMessage(chatId, output,{parse_mode:"HTML"})
        // sending the audio if availiable :
        if(data[0].phonetics!==undefined && data[0].phonetics[0].audio!==undefined){
            bot.sendAudio(chatId, data[0].phonetics[0].audio).catch(e=>console.log("no audio found"));
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            bot.sendMessage(chatId, "Sorry, the word was not found in the dictionary 😔😔. \n<b>NOTE:</b> sentences are not allowed, send a word.",{ parse_mode: "HTML" });
        } else {
            // Handle other errors
            console.log(error);
        }
    }
})








