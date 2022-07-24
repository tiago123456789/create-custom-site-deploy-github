
const translate = (language, key) => {
    return translations[language][key]
}

const translations = {
    "pt": {
        "about": "Sobre",
        "right_reserved": "Todos os direitos reservados"
    },
    "en": {
        "about": "About",
        "right_reserved": "All rights reserved"
    }
}


module.exports = {
    translate
}