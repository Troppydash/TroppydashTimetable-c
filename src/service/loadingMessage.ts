enum QuotePerson {
    WROPPY,
    TROPPY,
    PROPPY,


}


interface LoadingMessages {
    suggestedPerson: QuotePerson;
    messages: string[];
}

interface LoadingMessage {
    suggestedPerson: QuotePerson;
    message: string;
}

const messages: LoadingMessages[] = [
    {
        suggestedPerson: QuotePerson.WROPPY,
        messages: [
            "Doing some hacking stuff, please wait...",
            "Alright, I've hacked into PC School Spider and gotten access to their algorithms and data.",
            "Getting your information lol please hold",
            "banana",
            "The great square is cornerless - Laozi",
            "Doing some cool stuff right now, hold tight..."
        ]
    },
    {
        suggestedPerson: QuotePerson.TROPPY,
        messages: [
            "Swapping time and space...",
            "Please wait while the little elves draw your map",
            "Do you come here often?",
            "Constructing additional pylons...",
            "Loading funny message...",
            "Downloading more RAM..."
        ]
    }
];

function randomNumberIn(range: number): number {
    return Math.floor(Math.random() * range);
}

/**
 * Generate a loading message
 * @returns {{suggestedPerson: QuotePerson, message: string}}
 */
export function generateLoadingMessage(): LoadingMessage {
    const randomPersonMessages = messages[randomNumberIn(messages.length)];
    const randomMessage = randomPersonMessages.messages[randomNumberIn(randomPersonMessages.messages.length)];
    return {
        suggestedPerson: randomPersonMessages.suggestedPerson,
        message: randomMessage
    }
}
