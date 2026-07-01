import { apiClient } from './client';

export async function getHello(): Promise<string> {
    const response = await apiClient.get("/api/hello");
    return response.data;
}