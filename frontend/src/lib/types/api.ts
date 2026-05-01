export interface ApiResponse<T> {
    status_code: number;
    status: string;
    data: {
        message: string;
        result: T;
    };
}
