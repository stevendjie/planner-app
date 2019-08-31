export function format(num) {
    const numAsNum = Number(num);
    if (numAsNum === 0) {
        return 0;
    }
    return numAsNum.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function floor(num) {
    return parseInt(num, 10);
}

export function getSplit(value, splitQty) {
    if (splitQty <= 0) {
        return 0;
    }
    const split = value / splitQty;
    return split;
}

export function getTotal(value, qty) {
    const tot = value * qty;
    return tot;
}

export function getConvertedValue(value, from, to, rates) {
    from = from.toUpperCase();
    to = to.toUpperCase();
    if (!rates || !rates[from] || !rates[to]) {
        return 0;
    }
    
    const valueInGlobalBase = value / rates[from];
    const converted = valueInGlobalBase * rates[to];
    return converted;
}

export function orderCurrencies(rates) {
    rates.sort((a,b) => {
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a === b) return 0;
        if (a > b) return 1;
        return -1;
    });
    return rates;
}