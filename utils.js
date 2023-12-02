export default class OutputClass{
    constructor(data,index,bot){
        this.data =data;
        this.index = index;
        this.bot = bot;
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
            // Perform some operation based on the button clicked
            if (data === 'moveBack') {
                // Do something for button1
                bot.editMessageText('Button 1 clicked! Updated', {
                    chat_id: callbackQuery.message.chat.id,
                    message_id: callbackQuery.message.message_id
                });
            } else if (data === 'moveForward') {
                // Do something for button2
                bot.editMessageText('Button 2 clicked! Updated', {
                    chat_id: callbackQuery.message.chat.id,
                    message_id: callbackQuery.message.message_id
                });
            }
        } catch (error) {
            console.error('Error handling button click:', error);
        }
    };

}

// Function to handle button clicks

