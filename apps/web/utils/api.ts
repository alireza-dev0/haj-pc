import axios, { isAxiosError } from "axios"

const clientApi = axios.create({
    baseURL: "/api",
    withCredentials: true
})


const serverApi = axios.create({
    baseURL: `${process.env.API_URL}/api`
})

export type ApiErrorBody = {
    message?: string
    fields?: Record<string, string[]>
}

const API_ERROR_FA: Record<number, string> = {
    401: 'دسترسی غیرمجاز است',
    404: 'یافت نشد',
    500: 'خطای داخلی سرور',
}

function getApiError(error: unknown): ApiErrorBody {
    if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorBody | undefined
        const status = error.response?.status
        const message =
            (status !== undefined ? API_ERROR_FA[status] : undefined) ??
            (typeof data?.message === 'string' ? data.message : undefined)

        return {
            message,
            fields: data?.fields,
        }
    }

    return { message: 'خطایی رخ داد' }
}

export { clientApi, serverApi, getApiError };
