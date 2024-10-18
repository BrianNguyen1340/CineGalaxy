export type UserType = {
    id: string
    email: string
    phone?: string
    name: string
    dateOfBirth?: {
        day?: number
        month?: number
        year?: number
    }
    gender?: string
    address?: string
    photoURL?: string
    role: number
}
