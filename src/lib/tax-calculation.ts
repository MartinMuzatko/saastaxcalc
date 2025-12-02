export interface TaxStep {
    id: string
    label: string
    base: number
    rateLabel: string
    amount: number
    rest: number
}

export interface TaxCalculationResult {
    revenue: number
    steps: TaxStep[]
    totalTaxes: number
    netIncome: number
    effectiveRate: number
}

const VAT_RATE = 0.19
const APP_STORE_RATE = 0.15
const GEWERBESTEUER_RATE = 0.076
// Chosen so that for the example 42.842 € base we get roughly 18.342 € taxable:
// 42.842 - 24.500 = 18.342
const GEWERBESTEUER_FREIBETRAG = 24_500
const SOLI_RATE = 0.055
const HEALTH_INSURANCE_RATE = 0.166
const CARE_INSURANCE_RATE = 0.042
// Beitragsbemessungsgrenze (monthly maximum for health insurance)
const HEALTH_INSURANCE_MAX_MONTHLY = 5_512.5
// Mindestbemessungsgrundlage (monthly minimum for health insurance)
const HEALTH_INSURANCE_MIN_MONTHLY = 1_248.33

function clampToZero(value: number): number {
    if (!Number.isFinite(value)) {
        return 0
    }
    return value < 0 ? 0 : value
}

export function calculateIncomeTax(zvE: number): number {
    const income = clampToZero(zvE)

    if (income <= 12_348) {
        return 0
    }

    if (income <= 17_799) {
        const y = (income - 12_348) / 10_000
        const est = (914.51 * y + 1_400) * y
        return clampToZero(est)
    }

    if (income <= 69_878) {
        const z = (income - 17_799) / 10_000
        const est = (173.1 * z + 2_397) * z + 1_034.87
        return clampToZero(est)
    }

    if (income <= 277_825) {
        const est = 0.42 * income - 11_135.63
        return clampToZero(est)
    }

    const est = 0.45 * income - 19_470.38
    return clampToZero(est)
}

interface StepContext {
    steps: TaxStep[]
    currentRest: number
}

function pushStep(context: StepContext, step: Omit<TaxStep, 'rest'> & { rest?: number }): StepContext {
    const rest = step.rest ?? context.currentRest - step.amount
    const fullStep: TaxStep = {
        ...step,
        rest,
    }

    return {
        steps: [...context.steps, fullStep],
        currentRest: rest,
    }
}

export function calculateSaasTaxes(revenue: number, excludeAppStoreProvision = false): TaxCalculationResult {
    const safeRevenue = clampToZero(revenue)

    if (safeRevenue <= 0) {
        return {
            revenue: 0,
            steps: [],
            totalTaxes: 0,
            netIncome: 0,
            effectiveRate: 0,
        }
    }

    let context: StepContext = {
        steps: [],
        currentRest: safeRevenue,
    }

    // Umsatz
    context = pushStep(context, {
        id: 'umsatz',
        label: 'Umsatz',
        base: safeRevenue,
        rateLabel: '–',
        amount: 0,
        rest: safeRevenue,
    })

    // Umsatzsteuer 19 %
    const vatAmount = safeRevenue * VAT_RATE
    context = pushStep(context, {
        id: 'vat',
        label: 'Umsatzsteuer 19 %',
        base: safeRevenue,
        rateLabel: '19 %',
        amount: vatAmount,
    })

    // Store value after Umsatzsteuer for insurance calculations
    const afterVat = context.currentRest

    // App Store Provision 15 %
    const appStoreBase = context.currentRest
    const appStoreAmount = excludeAppStoreProvision ? 0 : appStoreBase * APP_STORE_RATE
    context = pushStep(context, {
        id: 'app-store',
        label: 'App Store Provision',
        base: appStoreBase,
        rateLabel: excludeAppStoreProvision ? '0 %' : '15 %',
        amount: appStoreAmount,
    })

    // Gewerbesteuer 7,6 %
    const gewerbeBase = context.currentRest
    const gewerbeTaxable = clampToZero(gewerbeBase - GEWERBESTEUER_FREIBETRAG)
    const gewerbeAmount = gewerbeTaxable * GEWERBESTEUER_RATE
    context = pushStep(context, {
        id: 'gewerbesteuer',
        label: 'Gewerbesteuer',
        base: gewerbeBase,
        rateLabel: '7,6 %',
        amount: gewerbeAmount,
    })

    // Einkommensteuer
    const incomeTaxBase = context.currentRest
    const incomeTaxAmount = calculateIncomeTax(incomeTaxBase)
    // Calculate average tax rate as percentage
    const averageTaxRate = incomeTaxBase > 0 ? (incomeTaxAmount / incomeTaxBase) * 100 : 0
    const rateLabel = incomeTaxBase > 0 ? `~${averageTaxRate.toFixed(1)} %` : 'nach Tarif'
    context = pushStep(context, {
        id: 'einkommensteuer',
        label: 'Einkommensteuer',
        base: incomeTaxBase,
        rateLabel,
        amount: incomeTaxAmount,
    })

    // Solidaritätszuschlag 5,5 % auf ESt
    const soliBase = incomeTaxAmount
    const soliAmount = soliBase * SOLI_RATE
    context = pushStep(context, {
        id: 'soli',
        label: 'Solidaritätszuschlag',
        base: soliBase,
        rateLabel: '5,5 %',
        amount: soliAmount,
    })

    // Krankenversicherung 16,6 % auf Wert nach Umsatzsteuer
    // Mit Beitragsbemessungsgrenze (max 5.512,50 €/Monat) und Mindestbemessungsgrundlage (min 1.248,33 €/Monat)
    const healthAnnualBase = afterVat
    const healthMonthlyBase = healthAnnualBase / 12
    // Apply minimum and maximum caps
    const healthMonthlyCapped = Math.max(
        HEALTH_INSURANCE_MIN_MONTHLY,
        Math.min(HEALTH_INSURANCE_MAX_MONTHLY, healthMonthlyBase)
    )
    const healthMonthlyAmount = healthMonthlyCapped * HEALTH_INSURANCE_RATE
    const healthAmount = healthMonthlyAmount * 12
    context = pushStep(context, {
        id: 'health',
        label: 'Krankenversicherung',
        base: healthAnnualBase,
        rateLabel: '16,6 %',
        amount: healthAmount,
    })

    // Pflegeversicherung 4,2 % auf Wert nach Umsatzsteuer
    const careBase = afterVat
    const careAmount = careBase * CARE_INSURANCE_RATE
    context = pushStep(context, {
        id: 'care',
        label: 'Pflegeversicherung',
        base: careBase,
        rateLabel: '4,2 %',
        amount: careAmount,
    })

    const netIncome = context.currentRest
    const totalTaxes = context.steps.reduce((sum, step) => sum + step.amount, 0)
    const effectiveRate = safeRevenue > 0 ? totalTaxes / safeRevenue : 0

    return {
        revenue: safeRevenue,
        steps: context.steps,
        totalTaxes,
        netIncome,
        effectiveRate,
    }
}

export type Locale = 'de' | 'en'

export function formatCurrency(amount: number, locale: Locale = 'de'): string {
    const formatter = new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-US', {
        style: 'currency',
        currency: locale === 'de' ? 'EUR' : 'USD',
        maximumFractionDigits: 0,
    })

    return formatter.format(Math.round(amount))
}

// Keep formatEuro for backward compatibility
export function formatEuro(amount: number): string {
    return formatCurrency(amount, 'de')
}
