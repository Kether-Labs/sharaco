import { useMemo } from 'react';
import { QuoteLineItem } from '../types/QuoteBuilder';

interface QuoteTotals {
    subTotal: number;
    discountAmount: number;
    subTotalAfterDiscount: number;
    totalTax: number;
    grandTotal: number;
}

export function useQuoteTotal(items: QuoteLineItem[], hasVat: boolean = true, discountRate: number = 0, isTaxExempt: boolean = false): QuoteTotals {
    return useMemo(() => {
        let subTotal = 0;
        let totalTax = 0;
        const applyTax = hasVat && !isTaxExempt;

        items.forEach((item) => {
            const lineSubTotal = item.quantity * item.unitPrice;
            subTotal += lineSubTotal;

            if (applyTax) {
                totalTax += lineSubTotal * (item.taxRate / 100);
            }
        });

        const discountAmount = subTotal * (discountRate / 100);
        const subTotalAfterDiscount = subTotal - discountAmount;

        // If discount applies, tax must be re-proportioned across the subtotal
        const effectiveTax = applyTax ? totalTax * (1 - (discountRate / 100)) : 0;

        return {
            subTotal,
            discountAmount,
            subTotalAfterDiscount,
            totalTax: effectiveTax,
            grandTotal: subTotalAfterDiscount + effectiveTax,
        };
    }, [items, hasVat, discountRate, isTaxExempt]);
}
