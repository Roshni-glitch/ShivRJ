function formatNumber(number) {
    if (number >= 1e7) {
        return (number / 1e7).toFixed(1) + 'Cr';
    } else if (number >= 1e5) {
        return (number / 1e5).toFixed(1) + 'L';
    } else {
        return number.toString();
    }
}

// Get all elements with data-price and format their numbers
document.querySelectorAll('[data-price]').forEach(priceElement => {
    const num = priceElement.getAttribute('data-price');
    const formattedPrice = formatNumber(parseFloat(num));
    priceElement.innerHTML = formattedPrice;
});