/**
 * @type {string}
 */
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
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    //
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
 * Automatically detects and applies the system or saved theme preference.
 *
 * This function checks for a saved theme in the local storage. If a saved theme does not exist,
 * it detects the system's preferred color scheme (light or dark) and sets it as the theme.
 * The detected or saved theme is then saved back to local storage to persist the preference.
 * Once determined, the theme is applied by setting the appropriate attributes and meta tags.
 *
 * Side Effects:
 * - Sets the `data-bs-theme` attribute on the document's `<body>` element.
 * - Updates the `<meta name="color-scheme">` tag to match the current theme.
 *
 * Dependencies:
 * - Requires a `storageKey` variable defined elsewhere for accessing local storage.
 * - Relies on a `changeMetaTag` function to modify the `<meta>` tag values.
 */
const autoDetectAndSetTheme = () => {
    // Check local storage or determine system theme
    let savedTheme = localStorage.getItem(storageKey);

    if (!savedTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            savedTheme = 'dark';
        } else {
            savedTheme = 'light';
        }
        localStorage.setItem(storageKey, savedTheme);
    }
    // Set the theme to body
    document.body.setAttribute('data-bs-theme', savedTheme);
    // change meta[name='color-scheme']
    changeMetaTag('color-scheme', savedTheme);
}


/**
 * A function that wraps specified words in a given text with an HTML strong tag.
 * This highlights the words by wrapping them with `<strong>` tags.
 *
 * @param {string} text - The input string in which words need to be wrapped.
 * @param {string[]} wordsToWrap - An array of words that should be wrapped with the strong tag.
 * @returns {string} The modified string with specified words wrapped in <strong> tags. If the input text is empty or undefined, an empty string is returned.
 */
const wrapText = (text, wordsToWrap) => {
    if (!text) return '';
    const escapedWords = wordsToWrap.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // escape regex
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi'); // word by word
    return text.replace(regex, '<strong>$1</strong>');
};


/**
 * Constructs a formatted string that highlights the given `strText` in bold
 * and appends the `text` after it separated by a colon.
 *
 * @param {string} strText - The text to be highlighted in bold.
 * @param {string} text - The text to be appended after the bold text.
 * @returns {string} A formatted string with `strText` emphasized in bold followed by `text`.
 */
const strongLine = (strText, text) => {
    return '<strong>' + strText + '</strong>: ' + text;
}


/**
 * Retrieves the current locale from the `i18n` global object.
 * If the `locale` property is of type string, it directly returns the string value.
 * Otherwise, it assumes the `locale` property is an object with a `value` property and returns that value.
 *
 * @returns {string} The current locale as a string.
 */
const getLocale = () => {
    return typeof i18n.global.locale === 'string'
        ? i18n.global.locale
        : i18n.global.locale.value;
};


/**
 * Converts a date string in the format "YYYY-MM" into a localized, human-readable month and year format.
 *
 * The function splits the input string to extract the year and month, creates a JavaScript Date object,
 * and formats the date using the locale settings provided by `getLocale`. The output will include a full
 * numeric year and the full name of the month.
 *
 * @param {string} str - The input date string in the format "YYYY-MM".
 * @returns {string} The formatted date string in the localized format with year and month name.
 */
const formatDate = (str) => {
    const [year, month] = str.split("-");
    return new Date(year, month - 1).toLocaleString(getLocale(), {
        year: 'numeric',
        month: 'long'
    });
};

/**
 * A function to determine the storage path for images based on the provided image name and type.
 *
 * @function
 * @param {string} img - The name of the image or a placeholder keyword.
 * @param {string} [type] - An optional type specifying a subdirectory for categorization.
 * @returns {string} The storage path for the image based on the input parameters.
 *
 * @todo Refactor this function to be part of an independent class or object for better modularity.
 */
const storage = (img, type) => {
    if (img === 'placeholder' && !type) return '/public/assets/images/placeholder.png';
    if (!type) {
        return '/public/assets/images/' + img;
    }
    return '/public/assets/images/' + type + '/' + img;
}

/**
 * Binds event listeners to language selection inputs and updates the application's language settings.
 *
 * When a language input is changed, this function performs the following actions:
 * - Updates the current language of the i18n global instance.
 * - Stores the selected language in localStorage for persistence.
 * - Updates the document's `lang` attribute to match the selected language.
 * - Fetches the corresponding localization data from a JSON file and updates the application's meta title and global data values.
 * - Calls a helper function to refresh UI tooltips with the updated language settings.
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

            // Update tooltips
            updateThemeTooltip(i18n);
        });
    });
};

/**
 * Updates the tooltip of the theme toggle button based on the current theme mode.
 *
 * @param {Object} i18n - The internationalization object, typically used for translating messages.
 * @param {Object} i18n.global - The global translation object.
 * @param {Function} i18n.global.t - Translate function that retrieves the appropriate message by key.
 * @return {void} This method does not return any value.
 */
function updateThemeTooltip(i18n) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        const mode = document.body.getAttribute('data-bs-theme') || 'light';
        const key = mode === 'dark' ? 'message.light_mode' : 'message.dark_mode';
        toggleBtn.setAttribute('data-bs-title', i18n.global.t(key));
        if (window.bootstrap) {
            const tip = bootstrap.Tooltip.getOrCreateInstance(toggleBtn);
            tip.setContent({ '.tooltip-inner': i18n.global.t(key) });
        }
    }
}

/**
 * start theme methods
 */
document.addEventListener('DOMContentLoaded', () => {
    getLocale();
    initBootstrapComponents();
    switchLanguage();
});


