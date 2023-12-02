export function generateOutput(data,index){
    let output = `(${data[index].meanings[0].partOfSpeech})\n`;
        data[index].meanings[0].definitions.forEach((e,ind) => {
            output += `<b>${ind+1}</b>. ${e.definition}\n \t ${e.example?`<i>->${e.example}</i>`:""} \n \n`;
        })
    return output;
}
