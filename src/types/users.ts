export type User = {
    id: number,
    email: string,
    username: string,
    name: string,
    type: 'company' | 'worker' | 'normal',
    avatar: string,
    slogan: string,
    description: string,
    mobile: string,
    sections: string,
    address: string,
    verify: boolean,
    created_at: string,
    update_at: string,
    last_login: string,
    section_title?: string,
    category_title?: string,
    last_message?: Message,
    socialPages?: [
        {
            type: 'instagram' | 'facebook',
            name: string,
        }
    ]
}

export type Message = {
    message: string,
    is_read: boolean,
    created_at: string,
}

export type Auth = {
    loggedIn: boolean,
    user?: User,
}

export type UserGallery = {
    id: number,
    user_id: number,
    path: string,
    description: string,
    created_at: string,
}