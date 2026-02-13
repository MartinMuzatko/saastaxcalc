import { useMemo } from 'react'
import { Card, Group, Stack, Table, Text, Title, Divider, Badge, Checkbox } from '@mantine/core'
import { calculateSaasTaxes, formatCurrency, type Locale } from '../lib/tax-calculation'
import { type Translations } from '../lib/translations'

interface TaxCalculatorProps {
    revenue: number
    /** Number of subscribers (for payment service fee calculation) */
    subscribers: number
    includeAppStoreProvision: boolean
    onIncludeAppStoreProvisionChange: (include: boolean) => void
    includePaymentService: boolean
    onIncludePaymentServiceChange: (include: boolean) => void
    locale: Locale
    translations: Translations
}

export function TaxCalculator(props: TaxCalculatorProps) {
    const {
        revenue,
        subscribers,
        includeAppStoreProvision,
        onIncludeAppStoreProvisionChange,
        includePaymentService,
        onIncludePaymentServiceChange,
        locale,
        translations,
    } = props

    const result = useMemo(
        () =>
            calculateSaasTaxes(revenue, {
                excludeAppStoreProvision: !includeAppStoreProvision,
                excludePaymentService: !includePaymentService,
                subscribers,
            }),
        [revenue, includeAppStoreProvision, includePaymentService, subscribers]
    )

    const t = translations

    if (revenue <= 0) {
        return (
            <Card shadow="sm" padding="lg" radius="md" className="bg-white dark:bg-gray-900">
                <Stack gap="sm">
                    <Title order={3}>{t.calculation.enterRevenue}</Title>
                    <Text c="dimmed" size="sm">
                        {t.calculation.enterRevenueDescription}
                    </Text>
                </Stack>
            </Card>
        )
    }

    const { steps, netIncome, totalTaxes, effectiveRate } = result

    return (
        <Stack gap="md">
            <Card shadow="sm" padding="lg" radius="md" className="bg-white dark:bg-gray-900">
                <Stack gap="sm">
                    <Group justify="space-between" align="center">
                        <Title order={3}>{t.calculation.title}</Title>
                        <Badge color="violet" variant="light">
                            {t.calculation.effectiveRate} {(effectiveRate * 100).toFixed(1)} %
                        </Badge>
                    </Group>

                    <Table striped withRowBorders highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>{t.calculation.step}</Table.Th>
                                <Table.Th>{t.calculation.basis}</Table.Th>
                                <Table.Th>{t.calculation.rateAmount}</Table.Th>
                                <Table.Th>{t.calculation.rest}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {steps.map((step) => {
                                const isAppStoreStep = step.id === 'app-store'
                                const isPaymentServiceStep = step.id === 'payment-service'
                                const isStrikethrough =
                                    (isAppStoreStep && !includeAppStoreProvision) ||
                                    (isPaymentServiceStep && !includePaymentService)

                                return (
                                    <Table.Tr key={step.id}>
                                        <Table.Td>
                                            <Group gap="xs" align="center">
                                                {isAppStoreStep && (
                                                    <Checkbox
                                                        checked={includeAppStoreProvision}
                                                        onChange={(e) =>
                                                            onIncludeAppStoreProvisionChange(
                                                                e.currentTarget.checked
                                                            )
                                                        }
                                                        size="sm"
                                                    />
                                                )}
                                                {isPaymentServiceStep && (
                                                    <Checkbox
                                                        checked={includePaymentService}
                                                        onChange={(e) =>
                                                            onIncludePaymentServiceChange(
                                                                e.currentTarget.checked
                                                            )
                                                        }
                                                        size="sm"
                                                    />
                                                )}
                                                <Text
                                                    component="span"
                                                    td={isStrikethrough ? 'line-through' : undefined}
                                                    c={isStrikethrough ? 'dimmed' : undefined}
                                                >
                                                    {(() => {
                                                        switch (step.id) {
                                                            case 'umsatz':
                                                                return t.steps.revenue
                                                            case 'vat':
                                                                return t.steps.vat
                                                            case 'app-store':
                                                                return t.steps.appStoreProvision
                                                            case 'payment-service':
                                                                return t.steps.paymentServiceProvision
                                                            case 'gewerbesteuer':
                                                                return t.steps.businessTax
                                                            case 'einkommensteuer':
                                                                return t.steps.incomeTax
                                                            case 'soli':
                                                                return t.steps.solidaritySurcharge
                                                            case 'health':
                                                                return t.steps.healthInsurance
                                                            case 'care':
                                                                return t.steps.careInsurance
                                                            default:
                                                                return step.label
                                                        }
                                                    })()}
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text
                                                td={isStrikethrough ? 'line-through' : undefined}
                                                c={isStrikethrough ? 'dimmed' : undefined}
                                            >
                                                {formatCurrency(step.base, locale)}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text
                                                component="span"
                                                td={isStrikethrough ? 'line-through' : undefined}
                                                c={isStrikethrough ? 'dimmed' : undefined}
                                            >
                                                {step.rateLabel}{' '}
                                                {step.amount > 0 ? (
                                                    <Text component="span" c="red">
                                                        {formatCurrency(step.amount, locale)}
                                                    </Text>
                                                ) : (
                                                    '–'
                                                )}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text
                                                td={isStrikethrough ? 'line-through' : undefined}
                                                c={isStrikethrough ? 'dimmed' : undefined}
                                            >
                                                {formatCurrency(step.rest, locale)}
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )
                            })}
                        </Table.Tbody>
                    </Table>
                </Stack>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" className="bg-white dark:bg-gray-900">
                <Stack gap="xs">
                    <Title order={4}>{t.summary.title}</Title>
                    <Group justify="space-between">
                        <Text c="dimmed">{t.summary.netAfterDeductions}</Text>
                        <Text fw={600}>{formatCurrency(netIncome, locale)}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text c="dimmed">{t.summary.totalCharges}</Text>
                        <Text fw={500} c="red">
                            {formatCurrency(totalTaxes, locale)}
                        </Text>
                    </Group>
                    <Divider />
                    <Text size="xs" c="dimmed">
                        {t.summary.disclaimer}
                    </Text>
                </Stack>
            </Card>
        </Stack>
    )
}
