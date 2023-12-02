

// Function to handle button clicks
function handleButtonClick(callbackQuery){
    const data = callbackQuery.data;
    // Perform some operation based on the button clicked
    if (data === 'button1') {
        // Do something for button1
        bot.editMessageText('Button 1 clicked!', { chat_id: callbackQuery.message.chat.id, message_id: callbackQuery.message.message_id });
    } else if (data === 'button2') {
        // Do something for button2
        bot.editMessageText('Button 2 clicked!', { chat_id: callbackQuery.message.chat.id, message_id: callbackQuery.message.message_id });
    }
};

// Set up the inline keyboard
const inlineKeyboard = {
    inline_keyboard: [
        [{ text: 'Button 1', callback_data: 'button1' }],
        [{ text: 'Button 2', callback_data: 'button2' }],
    ]
};

// Send a message with the inline keyboard
bot.sendMessage(chatId, 'Click a button:', { reply_markup: inlineKeyboard })
    .then(sentMessage => {
        // Set up a callback query listener to handle button clicks
        bot.on('callback_query', handleButtonClick);
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
