import { useMemo, useState } from 'react'
import {
    Alert,
    Button,
    Card,
    Divider,
    Group,
    NumberInput,
    Stack,
    Text,
    Title,
    SegmentedControl,
} from '@mantine/core'
import { TaxCalculator } from './components/tax-calculator'
import { calculateSaasTaxes, formatCurrency, type Locale } from './lib/tax-calculation'
import { translations, type Translations } from './lib/translations'

function parseRevenue(value: string | number | null): number {
    if (typeof value === 'number') {
        return value
    }
    if (typeof value !== 'string') {
        return 0
    }
    const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.')
    const parsed = Number.parseFloat(cleaned)
    if (!Number.isFinite(parsed) || parsed < 0) {
        return 0
    }
    return parsed
}

function App() {
    const [locale, setLocale] = useState<Locale>('en')
    const [revenueInput, setRevenueInput] = useState<number | ''>(70_000)
    const [monthlyPriceInput, setMonthlyPriceInput] = useState<number | ''>(10)
    const [monthlyLivingCostInput, setMonthlyLivingCostInput] = useState<number | ''>(2_000)
    const [includeAppStoreProvision, setIncludeAppStoreProvision] = useState(false)
    const [includePaymentService, setIncludePaymentService] = useState(false)

    const t: Translations = translations[locale]

    const revenue = useMemo(() => {
        if (revenueInput === '') {
            return 0
        }
        return parseRevenue(revenueInput)
    }, [revenueInput])

    const monthlyPrice = useMemo(() => {
        if (monthlyPriceInput === '' || monthlyPriceInput <= 0) {
            return 0
        }
        return monthlyPriceInput
    }, [monthlyPriceInput])

    const monthlyLivingCost = useMemo(() => {
        if (monthlyLivingCostInput === '' || monthlyLivingCostInput <= 0) {
            return 0
        }
        return monthlyLivingCostInput
    }, [monthlyLivingCostInput])

    const usersNeeded = useMemo(() => {
        if (revenue <= 0 || monthlyPrice <= 0) {
            return 0
        }
        return Math.ceil(revenue / 12 / monthlyPrice)
    }, [revenue, monthlyPrice])

    const taxResult = useMemo(
        () =>
            calculateSaasTaxes(revenue, {
                excludeAppStoreProvision: !includeAppStoreProvision,
                excludePaymentService: !includePaymentService,
                subscribers: usersNeeded,
            }),
        [revenue, includeAppStoreProvision, includePaymentService, usersNeeded]
    )
    const monthlyNetIncome = useMemo(() => {
        if (revenue <= 0) {
            return 0
        }
        return taxResult.netIncome / 12
    }, [taxResult.netIncome, revenue])

    const canMakeIt = monthlyNetIncome >= monthlyLivingCost

    const currencySymbol = locale === 'de' ? '€' : '$'
    const numberFormat = locale === 'de' ? 'de-DE' : 'en-US'
    const thousandSeparator = locale === 'de' ? '.' : ','
    const decimalSeparator = locale === 'de' ? ',' : '.'

    return (
        <div className="mx-auto max-w-4xl py-10 px-4">
            <Stack gap="lg">
                <Group justify="space-between" align="center" mb="md">
                    <div style={{ flex: 1 }} />
                    <SegmentedControl
                        value={locale}
                        onChange={(value) => setLocale(value as Locale)}
                        data={[
                            { label: '🇺🇸 $', value: 'en' },
                            { label: '🇩🇪 €', value: 'de' },
                        ]}
                    />
                    <div style={{ flex: 1 }} />
                </Group>
                <header className="text-center space-y-2">
                    <Title order={1}>{t.title}</Title>
                    <Text c="dimmed" size="sm">
                        {t.subtitle}
                    </Text>
                </header>

                <Card shadow="sm" padding="lg" radius="md" className="">
                    <Stack gap="md">
                        <Title order={3}>{t.input.title}</Title>
                        <NumberInput
                            label={t.input.yearlyRevenue}
                            value={revenueInput}
                            onChange={(value) =>
                                setRevenueInput(
                                    typeof value === 'number' || value === '' ? value : revenueInput
                                )
                            }
                            thousandSeparator={thousandSeparator}
                            decimalSeparator={decimalSeparator}
                            min={0}
                            step={1_000}
                            clampBehavior="strict"
                            leftSection={<Text size="sm">{currencySymbol}</Text>}
                        />
                        <NumberInput
                            label={t.input.monthlyPrice}
                            value={monthlyPriceInput}
                            onChange={(value) =>
                                setMonthlyPriceInput(
                                    typeof value === 'number' || value === '' ? value : monthlyPriceInput
                                )
                            }
                            thousandSeparator={thousandSeparator}
                            decimalSeparator={decimalSeparator}
                            min={0}
                            step={1}
                            clampBehavior="strict"
                            leftSection={<Text size="sm">{currencySymbol}</Text>}
                        />
                        <NumberInput
                            label={t.input.monthlyLivingCost}
                            value={monthlyLivingCostInput}
                            onChange={(value) =>
                                setMonthlyLivingCostInput(
                                    typeof value === 'number' || value === '' ? value : monthlyLivingCostInput
                                )
                            }
                            thousandSeparator={thousandSeparator}
                            decimalSeparator={decimalSeparator}
                            min={0}
                            step={100}
                            clampBehavior="strict"
                            leftSection={<Text size="sm">{currencySymbol}</Text>}
                        />
                        {revenue > 0 && monthlyPrice > 0 && (
                            <Group
                                justify="space-between"
                                align="center"
                                className="bg-gray-50 p-3 rounded-md"
                            >
                                <Text size="sm" fw={500}>
                                    {t.input.subscribersNeeded}
                                </Text>
                                <Text size="lg" fw={700} c="violet">
                                    {usersNeeded.toLocaleString(numberFormat)}{' '}
                                    {locale === 'de' ? 'Nutzer' : 'Users'}
                                </Text>
                            </Group>
                        )}
                        <Group justify="space-between" align="center" className="flex-wrap gap-2">
                            <Text size="xs" c="dimmed">
                                {t.input.exampleValues}
                            </Text>
                            <Group gap="xs" wrap="wrap">
                                {[30_000, 60_000, 100_000].map((preset) => (
                                    <Button
                                        key={preset}
                                        size="xs"
                                        variant="light"
                                        onClick={() => setRevenueInput(preset)}
                                    >
                                        {preset.toLocaleString(numberFormat)} {currencySymbol}
                                    </Button>
                                ))}
                            </Group>
                        </Group>
                    </Stack>
                </Card>

                <TaxCalculator
                    revenue={revenue}
                    subscribers={usersNeeded}
                    includeAppStoreProvision={includeAppStoreProvision}
                    onIncludeAppStoreProvisionChange={setIncludeAppStoreProvision}
                    includePaymentService={includePaymentService}
                    onIncludePaymentServiceChange={setIncludePaymentService}
                    locale={locale}
                    translations={t}
                />

                {revenue > 0 && monthlyLivingCost > 0 && (
                    <Card shadow="sm" padding="lg" radius="md" className="">
                        <Stack gap="md">
                            <Title order={3}>{t.livingCosts.title}</Title>
                            <Group justify="space-between" align="center">
                                <Text size="sm" c="dimmed">
                                    {t.livingCosts.monthlyLivingCosts}
                                </Text>
                                <Text fw={600}>{formatCurrency(monthlyLivingCost, locale)}</Text>
                            </Group>
                            <Group justify="space-between" align="center">
                                <Text size="sm" c="dimmed">
                                    {t.livingCosts.monthlyNetIncome}
                                </Text>
                                <Text fw={600}>{formatCurrency(monthlyNetIncome, locale)}</Text>
                            </Group>
                            <Divider />
                            <Alert
                                color={canMakeIt ? 'green' : 'red'}
                                className="text-center"
                                styles={{
                                    root: { textAlign: 'center' },
                                    title: { justifyContent: 'center' },
                                    message: { textAlign: 'center' },
                                }}
                                title={
                                    <Group gap="md" justify="center">
                                        <Text fw={700} size="2.5rem">
                                            {canMakeIt ? t.livingCosts.willMakeIt : t.livingCosts.wontMakeIt}
                                        </Text>
                                        <Text size="3rem">{canMakeIt ? '🎉' : '💀'}</Text>
                                    </Group>
                                }
                            >
                                <Text size="xl" fw={500} mt="md">
                                    {canMakeIt
                                        ? `${locale === 'de' ? 'Du hast' : 'You have'} ${formatCurrency(
                                              monthlyNetIncome - monthlyLivingCost,
                                              locale
                                          )} ${t.livingCosts.surplus}`
                                        : `${locale === 'de' ? 'Dir fehlen' : 'You need'} ${formatCurrency(
                                              monthlyLivingCost - monthlyNetIncome,
                                              locale
                                          )} ${t.livingCosts.shortfall}`}
                                </Text>
                            </Alert>
                        </Stack>
                    </Card>
                )}
            </Stack>
        </div>
    )
}

export default App
