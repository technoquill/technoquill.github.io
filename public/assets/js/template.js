const storageKey = 'theme';

/**
 * Initializes Bootstrap components, specifically tooltips.
 * Selects all elements with the attribute `data-bs-toggle="tooltip"` and applies
 * Bootstrap's tooltip functionality to them.
 *
 * This function is useful to enable tooltip interactions on elements that require
 * this behavior within a Bootstrap-based project.
 */
const initBootstrapComponents = () => {
    // tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}


/**
 * Updates the content attribute of a meta-tag with the specified name.
 *
 * @param {string} name - The value of the 'name' attribute of the meta-tag to update.
 * @param {string} content - The new content to set for the specified meta-tag.
 */
const changeMetaTag = (name, content) => {
    document.querySelector('meta[name="' + name + '"]')
        .setAttribute('content', content);
}


/**
 * A function to toggle between light and dark themes on a webpage.
 * It attaches a click event listener to a theme toggle button and updates the theme accordingly.
 * The function also updates the HTML body's data attribute to reflect the current theme,
 * modifies the meta-tag related to the color scheme, and saves the selected theme to local storage.
 *
 * This function assumes the following:
 * - The toggle button has an ID of 'theme-toggle'.
 * - The theme setting is stored in the `data-bs-theme` attribute on the `<body>` tag.
 * - A helper function `changeMetaTag(name, content)` exists for updating meta-tags.
 * - A predefined variable `storageKey` exists, representing the key for saving the theme in localStorage.
 */

// const switchTheme = () => {
//     const toggle = document.getElementById('theme-toggle');
//     // Theme Switcher
//     toggle.addEventListener('click', () => {
//         const currentTheme = document.body.getAttribute('data-bs-theme');
//         const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
//         // Set the theme to the body
//         document.body.setAttribute('data-bs-theme', newTheme);
//         // change meta[name='color-scheme']
//         changeMetaTag('color-scheme', newTheme);
//         // Save to localStorage newTheme
//         localStorage.setItem(storageKey, newTheme);
//
//     });
// }


/**
 * Determines and applies the active theme for the application.
 *
 * Checks the user's saved theme preference from local storage. If no preference is found,
 * it determines the theme based on the system's color scheme (dark or light). The detected
 * or default theme is then saved in local storage, applied to the `data-bs-theme` attribute
 * on the document body, and updated in the corresponding meta-tag for compatibility.
 *
 * Relies on the browser's `window.matchMedia` API for detecting system preferences and
 * interacts with local storage to persist the user's preferred theme across sessions.
 *
 * This function modifies the following:
 * - The `data-bs-theme` attribute of the document body to reflect the active theme.
 * - A meta-tag with the name `color-scheme` to align with the chosen theme.
 */
// const detectedTheme = () => {
//     // Check local storage or determine system theme
//     let savedTheme = localStorage.getItem(storageKey);
//
//     if (!savedTheme) {
//         if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//             savedTheme = 'dark';
//         } else {
//             savedTheme = 'light';
//         }
//         localStorage.setItem(storageKey, savedTheme);
//     }
//     // Set the theme to body
//     document.body.setAttribute('data-bs-theme', savedTheme);
//     // change meta[name='color-scheme']
//     changeMetaTag('color-scheme', savedTheme);
// }

/**
 *
 * @param text
 * @param wordsToWrap
 * @returns {*|string}
 */
const wrapText = (text, wordsToWrap) => {
    if (!text) return '';
    const escapedWords = wordsToWrap.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // escape regex
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi'); // word by word
    return text.replace(regex, '<strong>$1</strong>');
};


/**
 *
 * @param strText
 * @param text
 * @returns {string}
 */
const strongLine = (strText, text) => {
    return '<strong>' + strText + '</strong>: ' + text;
}


/**
 * @returns {string|*}
 */
const getLocale = () => {
    return typeof i18n.global.locale === 'string'
        ? i18n.global.locale
        : i18n.global.locale.value;
};


/**
 *
 * @param str
 * @returns {string}
 */
const formatDate = (str) => {
    const [year, month] = str.split("-");
    return new Date(year, month - 1).toLocaleString(getLocale(), {
        year: 'numeric',
        month: 'long'
    });
};

/**
 *
 * @param img
 * @param type
 * @returns {string}
 * @todo: make like an independent Class (obj)
 */
const storage = (img, type) => {
    if (img === 'placeholder' && !type) return '/public/assets/images/placeholder.png';
    if (!type) {
        return '/public/assets/images/' + img;
    }
    return '/public/assets/images/' + type + '/' + img;
}

/**
 *
 */
const switchLanguage = () => {
    document.querySelectorAll('input[name="lang"]').forEach(input => {
        input.addEventListener('change', async () => {
            const lang = input.id;

            i18n.global.locale = lang;
            localStorage.setItem('lang', lang);
            document.documentElement.lang = lang;

            const response = await fetch(`./data/json/${lang}/data.json`);
            const data = await response.json();
            document.title = data.meta_title;

            // refresh global data
            window.appData.value = data;
        });
    });
};


/**
 * start theme methods
 */
document.addEventListener('DOMContentLoaded', () => {
    getLocale();
    initBootstrapComponents();
    switchLanguage();
});


