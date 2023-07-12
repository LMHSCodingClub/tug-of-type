export function typingSpeed(inputSize, startTime, endTime = Date.now()) {
    const minutesToComplete = Math.abs(endTime - startTime) / 1000 / 60;
    console.log("Minutes to Complete", minutesToComplete)
    const numberOfWords = inputSize / 5
    console.debug("numberOfWords", inputSize)
    const speed = numberOfWords / minutesToComplete;

    return Math.round(speed);
}

export function typingAccuracy(inputSize, numWrongWords) {
    return Math.round(inputSize / (inputSize + numWrongWords) * 100)
}

/**
    * @returns User-friendly string in MM:SS format of elapsed time
*/
export function typingTime(creationTime) {
    const secondsToComplete = Math.abs(Date.now() - creationTime) / 1000;
    return {
        minutes: Math.floor(secondsToComplete / 60),
        seconds: Math.ceil(secondsToComplete % 60)
    }
}