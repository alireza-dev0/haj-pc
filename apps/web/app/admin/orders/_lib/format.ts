export function formatJalaliDate(iso: string) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleDateString('fa-IR-u-nu-latn', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

export function formatPrice(value: number) {
    return Intl.NumberFormat('en-US').format(value);
}

export function shortOrderId(id: string) {
    return id.slice(0, 8);
}
