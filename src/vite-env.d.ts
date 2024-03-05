/// <reference types="vite/client" />

interface Offer {
    _id: string,
    title: string,
    address: string,
    description: string,
    author: string,
    section: number,
    category: number,
    status: boolean,
    disabled: boolean,
    approved: boolean,
    time_range: null | TimeRange,
    views: number,
    closed_at: string,
    created_at: string,
    updated_at: string,
}

interface TimeRange {
    start_at: string,
    end_at: string
}