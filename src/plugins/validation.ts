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

export const checkError = (array: any, value: any) => {
    if(value != null) {
        array.push(value)
    }
}

export const getError = (array: any, search: any) => {
    const emailError = array.find((error: any) => error.where === search)
    return emailError ? emailError.message : ''
}