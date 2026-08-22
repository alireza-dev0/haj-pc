

export function priceFormater (value: number, currency: "IRR" | "IRT" = "IRT") {
    switch(currency){
        case "IRT":
            return `${Intl.NumberFormat("fa-IR").format(value)} تومان`
            break;
        case "IRR":
            return `${Intl.NumberFormat("fa-IR").format(value)} ریال`
            break;
        default:
            return `${Intl.NumberFormat("fa-IR").format(value)} تومان`
    }
}