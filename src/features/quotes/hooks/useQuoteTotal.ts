import { useMemo } from 'react';
import { QuoteLineItem } from '../types/QuoteBuilder';

interface QuoteTotals {
    subTotal: number;
    discountAmount: number;
    subTotalAfterDiscount: number;
    totalTax: number;
    grandTotal: number;
}

export function useQuoteTotal(items: QuoteLineItem[], hasVat: boolean = true, discountRate: number = 0): QuoteTotals {
    return useMemo(() => {
        let subTotal = 0;
        let totalTax = 0;

        items.forEach((item) => {
            const lineSubTotal = item.quantity * item.unitPrice;
            subTotal += lineSubTotal;

            if (hasVat) {
                totalTax += lineSubTotal * (item.taxRate / 100);
            }
        });

        const discountAmount = subTotal * (discountRate / 100);
        const subTotalAfterDiscount = subTotal - discountAmount;

        // If discount applies, tax must be re-proportioned across the subtotal, 
        // realistically in simple tools we just discount the subtotal and tax gets calculated off discounted sum, 
        // to be perfectly accurate we'll calculate global tax proportion ratio if simplified:
        // Or simpler: We subtract discount, then apply the average tax rate. We'll stick to a simple proportional tax reduction.
        const effectiveTax = hasVat ? totalTax * (1 - (discountRate / 100)) : 0;

        return {
            subTotal,
            discountAmount,
            subTotalAfterDiscount,
            totalTax: effectiveTax,
            grandTotal: subTotalAfterDiscount + effectiveTax,
        };
    }, [items, hasVat, discountRate]);
}
