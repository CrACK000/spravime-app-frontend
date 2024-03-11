export const validUsername = (username: string) => {

    let result

    if (username.length < 3) {
        result = { where: 'username', message: 'Používateľské meno musí obsahovať 3 a viac znakov.' }
    } else if (username.length > 60) {
        result = { where: 'username', message: 'Používateľské meno môže obsahovať maximálne 60 znakov.' }
    }

    return result
}

export const validPhone = (mobile: string) => {

    let result
    const mobileRegex = /^[+]\+?[1-9][0-9]{11,15}$/

    if (mobile) {
        if (!mobileRegex.test(mobile)) {
            result = { where: 'phone', message: 'Nesprávny formát tel. čísla.' }
        }
    }

    return result
}

export const validEmail = (email: string) => {

    let result
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/

    if (!emailRegex.test(email)) {
        result = { where: 'email', message: 'Nesprávny formát emailu.' }
    }

    return result
}

export const validName = (name: string) => {

    let result

    if (name) {
        if (name.length > 3){
            if (name.length > 50){
                result = { where: 'name', message: 'Meno je príliš dlhé.' }
            }
        } else {
            result = { where: 'name', message: 'Meno je príliš krátke.' }
        }
    } else {
        result = { where: 'name', message: 'Meno musí byť vyplnené.' }
    }

    return result
}

export const validURL = (url: string, where: string) => {

    let result
    const urlRegex = /^(https?:\/\/)?(www\.)?[\w\.-]+\.[\w\.-]+\/[\w\@:%_\+.~#?&\/\/=\\-]+\/?$/

    if (url) {
        if (!urlRegex.test(url)) {
            result = { where: where, message: 'Nesprávny formát URL.' }
        }
    }

    return result
}




export const validTitle = (title: string) => {

    let result

    if (title.length < 20) {

        result = { where: 'title', message: 'Názov požiadavky musí mať aspoň 20 znakov.' }

    } else if (title.length > 100) {

        result = { where: 'title', message: 'Názov požiadavky môže mať maximálne 100 znakov.' }

    }

    return result
}

export const validSection = (section: number) => {

    let result

    if (section === 0) result = { where: 'section', message: 'Vyberte sekciu.' }

    return result
}

export const validCategory = (category: number) => {

    let result

    if (category === 0) result = { where: 'category', message: 'Vyberte kategóriu.' }

    return result
}

export const validAddress = (address: string) => {

    let result

    if (address.length === 0) result = { where: 'address', message: 'Adresa musí byť nastavená.' }

    return result
}

export const validStartAt = (date: string) => {

    let result

    if (date === null) result = { where: 'start_at', message: 'Nastavte čas kedy majú práce začať.' }

    return result
}

export const validEndAt = (date: string) => {

    let result

    if (date === null) result = { where: 'end_at', message: 'Nastavte čas kedy majú práce skončiť.' }

    return result
}

export const validDescription = (text: string) => {

    let result

    if (text.length < 150) {

        result = { where: 'description', message: 'Pole musí obsahovať minimálne 150 znakov.' }

    } else if (text.length > 1000) {

        result = { where: 'description', message: 'Pole môže obsahovať maximálne 1000 znakov.' }

    }

    return result
}

export const validRules = (check: boolean) => {

    let result

    if (!check) result = { where: 'rules', message: 'Prečítajte si podmienkami požiadavky.' }

    return result
}





export const validRecommendation = (recommendation: boolean | null) => {

    let result

    if (typeof recommendation !== 'boolean') {
        result = { where: 'recommendation', message: 'Odporúčanie musí byť určené.' }
    }

    return result
}

export const validRating = (rating: number) => {

    let result

    if (rating <= 0) {
        result = { where: 'star', message: 'Vyberte hodnotenie.' }
    }

    return result
}








export const checkError = (array: any, value: any) => {
    if(value != null) {
        array.push(value)
    }
}

export const getError = (array: any, search: any) => {
    const emailError = array.find((error: any) => error.where === search)
    return emailError ? emailError.message : ''
}