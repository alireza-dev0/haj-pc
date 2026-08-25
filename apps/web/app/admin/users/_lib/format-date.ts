export function formatJalaliDate(iso: string) {
    return new Date(iso).toLocaleDateString('fa-IR-u-nu-latn', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}
