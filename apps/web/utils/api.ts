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

function getApiError(error: unknown): ApiErrorBody {
    if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorBody | undefined
        return {
            message: data?.message,
            fields: data?.fields,
        }
    }

    return { message: 'خطایی رخ داد' }
}

export { clientApi, serverApi, getApiError };
