export type Offer = {
    id: number,
    title: string,
    address: string,
    description: string,
    author: number,
    status: boolean,
    disabled: boolean,
    approved: boolean,
    created_at: string,
    updated_at: string,
    time_range: boolean,
    start_at: string,
    end_at: string,
    closed_at: string,
    views?: string,
    section_title?: string,
    category_title?: string,
}

export type Sections = {
    id: number,
    title: string,
}

export type Categories = {
    id: number,
    section_id: number,
    title: string,
}

export type Zipcodes = {
    country_code: string,
    zipcode: string,
    place: string,
    state: string,
    state_code: string,
    province: string,
    province_code: string,
    community: string,
    community_code: string,
    latitude: string,
    longitude: string,
}