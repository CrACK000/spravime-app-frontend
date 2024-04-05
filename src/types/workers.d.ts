interface FilterWorkersData {
    search?: string;
    type?: string;
    section?: number;
    address?: string;
    sortBy?: string;
    verify?: boolean;
    orderBy?: 'asc' | 'desc';
    list?: string | 'list' | 'grid';
}