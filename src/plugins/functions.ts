function formatIsoDate(isoDate: string) {
    const date = new Date(isoDate);
    const day = ('0' + date.getUTCDate()).slice(-2);
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const year = date.getUTCFullYear();
    const hours = ('0' + date.getUTCHours()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function timeSince(isoDate: string) {
    const now = new Date();
    const past = new Date(isoDate);
    const secondsPast = (now.getTime() - past.getTime()) / 1000;

    if (secondsPast < 60) {
        return secondsPast === 1 ? 'pred 1 sekundou' : `pred ${Math.floor(secondsPast)} sekundami`;
    }
    if (secondsPast < 3600) {
        const minutes = Math.floor(secondsPast / 60);
        return minutes === 1 ? 'pred 1 minútou' : `pred ${minutes} minútami`;
    }
    if (secondsPast <= 86400) {
        const hours = Math.floor(secondsPast / 3600);
        return hours === 1 ? 'pred 1 hodinou' : `pred ${hours} hodinami`;
    }
    if (secondsPast > 86400) {
        const days = Math.floor(secondsPast / 86400);
        return days === 1 ? 'pred 1 dňom' : `pred ${days} dňami` ;
    }
}

function nl2br(str: string) {
    if(!str) return '';
    return str.replace(/\n/g, '<br>');
}

export { formatIsoDate, timeSince, nl2br }