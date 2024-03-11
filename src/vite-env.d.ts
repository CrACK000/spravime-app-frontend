/// <reference types="vite/client" />

interface Offer {
    _id: string,
    title: string,
    address: string,
    description: string,
    author: User,
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
    end_at: string,
}

interface User {
    _id: string,
    username: string,
    email: string,
    password: string,
    phone: string | null,
    avatar: string | undefined,
    profile: ProfileData,
    social: SocialData,
    gallery: [Gallery],
    reviews: ReviewsData,
    views: number,
    verify: boolean,
    created_at: string,
    updated_at: string,
    last_login: string,
}

interface Gallery {
    _id: string,
    path: number,
    description: string | null,
    created_at: string,
    updated_at: string,
}

interface ProfileData {
    type: 'normal' | 'worker' | 'company',
    name: string | null,
    slogan: string | null,
    description: string | null,
    sections: any,
    address: string | null,
}

interface SocialData {
    facebook: string | null,
    instagram: string | null,
    tiktok: string | null,
    linkedin: string | null
}

interface ReviewsData {
    average_rating: number,
    count_reviews: number,
}

interface Review {
    _id: string,
    author: User,
    key: string,
    rating: number,
    recommendation: boolean,
    description: string,
    created_at: string,
    updated_at: string,
}

interface Sections {
    id: number,
    title: string,
}

interface Categories {
    id: number,
    section_id: number,
    title: string,
}

interface Zipcodes {
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

interface Auth {
    loggedIn: Ref<boolean>,
    userData: Ref<User | null>,
    newMsgCount: Ref<number>,
    loading: Ref<boolean>,
    checkAuth: () => Promise<void>
}

interface MessagesContainer {
    _id: string,
    key: Offer,
    container: Container,
    created_at: string,
    updated_at: string,
}

interface Container {
    from: {
        user_id: User,
        messages: Message[]
    },
    to: {
        user_id: User,
        messages: Message[]
    }
}

interface Message {
    _id: string,
    message: string,
    new: boolean,
    created_at: string,
    updated_at: string,
}

interface ReportData {
    _id: string,
    type: 'review' | 'comment',
    key: string,
    author: User | string,
    reason: string,
    created_at: string,
    updated_at: string,
}