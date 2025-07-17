export interface PaginationI {
    total: number,
    limit: number,
    page: number,   // 1-based index, = skip(0-based index) + 1
    hasMore: boolean,
}