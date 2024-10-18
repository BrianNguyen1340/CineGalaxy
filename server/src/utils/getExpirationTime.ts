type TimeUnit =
    | 'seconds'
    | 'minutes'
    | 'hours'
    | 'days'
    | 'weeks'
    | 'months'
    | 'years'

const calculateMilliseconds = (value: number, unit: TimeUnit): number => {
    switch (unit) {
        case 'seconds':
            return value * 1000
        case 'minutes':
            return value * 60 * 1000
        case 'hours':
            return value * 60 * 60 * 1000
        case 'days':
            return value * 24 * 60 * 60 * 1000
        case 'weeks':
            return value * 7 * 24 * 60 * 60 * 1000
        default:
            throw new Error('Invalid time unit for millisecond conversion')
    }
}

const calculateDateByUnit = (
    value: number,
    unit: TimeUnit,
    isFuture: boolean = true,
): Date => {
    const now = new Date()

    switch (unit) {
        case 'months':
            now.setMonth(now.getMonth() + (isFuture ? value : -value))
            return now
        case 'years':
            now.setFullYear(now.getFullYear() + (isFuture ? value : -value))
            return now
        default:
            const milliseconds = calculateMilliseconds(value, unit)
            return new Date(
                now.getTime() + (isFuture ? milliseconds : -milliseconds),
            )
    }
}

export const getExpirationTime = (value: number, unit: TimeUnit): Date => {
    return calculateDateByUnit(value, unit, true)
}

export const timeAgo = (amount: number, unit: TimeUnit): Date => {
    return calculateDateByUnit(amount, unit, false)
}
