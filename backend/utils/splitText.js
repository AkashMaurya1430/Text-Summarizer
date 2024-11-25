function splitText(text,x) {
    const textBlob = text;
    const numberOfSentences = x;
    const sentences = textBlob.match(/[^\.!\?]+[\.!\?]+/g);

    if (!sentences) {
       console.log( "No sentences found.");
        return [];
    }

    const result = [];
    const sentencesPerGroup = Math.ceil(sentences.length / numberOfSentences);

    for (let i = 0; i < sentences.length; i += sentencesPerGroup) {
        result.push(sentences.slice(i, i + sentencesPerGroup).join(' '));
    }

//    console.log( result.join('\n\n------------------------------------------------cls'));
    return result
}

module.exports = splitText