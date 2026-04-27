/**
 * Formate un montant en centimes vers une chaîne de devise lisible.
 * 
 * @param cents - Montant en centimes (ex: 150000 = 1 500,00 €)
 * @param currency - Code devise ISO 4217 (défaut: "XAF" pour FCFA)
 * @param locale - Locale pour le formatage (défaut: "fr-FR")
 * @returns Chaîne formatée (ex: "1 500,00 FCFA")
 * 
 * @example
 * formatCurrency(150000)           // "1 500,00 FCFA"
 * formatCurrency(150000, 'EUR')    // "1 500,00 €"
 * formatCurrency(0)                // "0,00 FCFA"
 * formatCurrency(null)             // "0,00 FCFA"
 * formatCurrency(undefined)        // "0,00 FCFA"
 */
export function formatCurrency(
    cents: number | null | undefined,
    currency: string = 'XAF',
    locale: string = 'fr-FR'
): string {
    // Gestion des valeurs nulles/undefined
    if (cents == null || isNaN(cents)) {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(0);
    }

    // Conversion centimes → unité
    const amount = cents / 100;

    // XAF n'a pas de décimales dans la pratique (pas de centimes de FCFA)
    // EUR/USD ont 2 décimales
    const noDecimalCurrencies = ['XAF', 'XOF', 'JPY', 'KRW', 'CLP'];
    const minDigits = noDecimalCurrencies.includes(currency) ? 0 : 2;
    const maxDigits = noDecimalCurrencies.includes(currency) ? 0 : 2;

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: minDigits,
        maximumFractionDigits: maxDigits,
    }).format(amount);
}