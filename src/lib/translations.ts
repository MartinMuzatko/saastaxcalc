export type Locale = 'de' | 'en'

export interface Translations {
    title: string
    subtitle: string
    input: {
        title: string
        yearlyRevenue: string
        monthlyPrice: string
        monthlyLivingCost: string
        subscribersNeeded: string
        exampleValues: string
    }
    calculation: {
        title: string
        effectiveRate: string
        step: string
        basis: string
        rateAmount: string
        rest: string
        enterRevenue: string
        enterRevenueDescription: string
    }
    summary: {
        title: string
        netAfterDeductions: string
        totalCharges: string
        disclaimer: string
    }
    livingCosts: {
        title: string
        monthlyLivingCosts: string
        monthlyNetIncome: string
        willMakeIt: string
        wontMakeIt: string
        surplus: string
        shortfall: string
    }
    steps: {
        revenue: string
        vat: string
        appStoreProvision: string
        businessTax: string
        incomeTax: string
        solidaritySurcharge: string
        healthInsurance: string
        careInsurance: string
    }
}

export const translations: Record<Locale, Translations> = {
    de: {
        title: 'Deutscher SaaS Steuerrechner',
        subtitle:
            'Grobe Beispielrechnung für einen einfachen SaaS-Umsatz in Deutschland – ohne Garantie auf Vollständigkeit oder Richtigkeit.',
        input: {
            title: 'Eingabe',
            yearlyRevenue: 'Jahresumsatz (brutto)',
            monthlyPrice: 'Monatlicher Abo-Preis',
            monthlyLivingCost: 'Monatliche Lebenshaltungskosten',
            subscribersNeeded: 'Benötigte Abonnenten:',
            exampleValues: 'Beispielwerte:',
        },
        calculation: {
            title: 'Berechnung',
            effectiveRate: 'Effektive Gesamtlast:',
            step: 'Schritt',
            basis: 'Basis',
            rateAmount: 'Prozent / Betrag',
            rest: 'Rest',
            enterRevenue: 'Gib deinen Jahresumsatz ein',
            enterRevenueDescription:
                'Trage oben deinen geschätzten Jahresumsatz ein, um zu sehen, wie viel nach Umsatzsteuer, Provision, Steuern und Versicherungen ungefähr übrig bleibt.',
        },
        summary: {
            title: 'Zusammenfassung',
            netAfterDeductions: 'Netto nach allen Abzügen',
            totalCharges: 'Gesamte Abgaben (Steuern, Beiträge, Provision)',
            disclaimer:
                'Alle Werte dienen nur der groben Orientierung für ein einfaches SaaS-Szenario und ersetzen keine individuelle Steuerberatung.',
        },
        livingCosts: {
            title: 'Lebenshaltungskosten vs. Nettoeinkommen',
            monthlyLivingCosts: 'Monatliche Lebenshaltungskosten:',
            monthlyNetIncome: 'Nettoeinkommen pro Monat:',
            willMakeIt: "You're gonna make it!",
            wontMakeIt: "You're not gonna make it",
            surplus: 'mehr pro Monat als benötigt.',
            shortfall: 'pro Monat.',
        },
        steps: {
            revenue: 'Umsatz',
            vat: 'Umsatzsteuer 19 %',
            appStoreProvision: 'App Store Provision',
            businessTax: 'Gewerbesteuer',
            incomeTax: 'Einkommensteuer',
            solidaritySurcharge: 'Solidaritätszuschlag',
            healthInsurance: 'Krankenversicherung',
            careInsurance: 'Pflegeversicherung',
        },
    },
    en: {
        title: 'German SaaS Tax Calculator',
        subtitle:
            'Rough example calculation for a simple SaaS revenue in Germany – no guarantee of completeness or accuracy.',
        input: {
            title: 'Input',
            yearlyRevenue: 'Yearly Revenue (gross)',
            monthlyPrice: 'Monthly Subscription Price',
            monthlyLivingCost: 'Monthly Living Costs',
            subscribersNeeded: 'Subscribers Needed:',
            exampleValues: 'Example Values:',
        },
        calculation: {
            title: 'Calculation',
            effectiveRate: 'Effective Total Rate:',
            step: 'Step',
            basis: 'Basis',
            rateAmount: 'Rate / Amount',
            rest: 'Remaining',
            enterRevenue: 'Enter your yearly revenue',
            enterRevenueDescription:
                'Enter your estimated yearly revenue above to see approximately how much remains after VAT, commission, taxes, and insurance.',
        },
        summary: {
            title: 'Summary',
            netAfterDeductions: 'Net after all deductions',
            totalCharges: 'Total charges (taxes, contributions, commission)',
            disclaimer:
                'All values are for rough orientation only for a simple SaaS scenario and do not replace individual tax advice.',
        },
        livingCosts: {
            title: 'Living Costs vs. Net Income',
            monthlyLivingCosts: 'Monthly living costs:',
            monthlyNetIncome: 'Net income per month:',
            willMakeIt: "You're gonna make it!",
            wontMakeIt: "You're not gonna make it",
            surplus: 'more per month than needed.',
            shortfall: 'more per month.',
        },
        steps: {
            revenue: 'Revenue',
            vat: 'VAT 19 %',
            appStoreProvision: 'App Store Commission',
            businessTax: 'Business Tax',
            incomeTax: 'Income Tax',
            solidaritySurcharge: 'Solidarity Surcharge',
            healthInsurance: 'Health Insurance',
            careInsurance: 'Care Insurance',
        },
    },
}
