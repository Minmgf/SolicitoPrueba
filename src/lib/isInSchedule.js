export function isInSchedule(open, close) {
    const now = new Date();
    const currentTime = now.getHours() + now.getMinutes() / 60;

    const [openHour, openMin] = open.split(':').map(Number);
    const [closeHour, closeMin] = close.split(':').map(Number);

    const openTime = openHour + openMin / 60;
    const closeTime = closeHour + closeMin / 60;

    return currentTime >= openTime && currentTime <= closeTime;
}
