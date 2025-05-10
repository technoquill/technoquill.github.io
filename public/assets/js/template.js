
const storageKey = 'theme';


const initBootstrapComponents = () => {
    // tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

/**
 *
 * @param name
 * @param content
 */
const changeMetaTag = (name, content) => {
    document.querySelector('meta[name="' + name + '"]')
        .setAttribute('content', content);
 }


 const switchTheme = () => {
     const toggle = document.getElementById('theme-toggle');
     // Theme Switcher
     toggle.addEventListener('click', () => {
         const currentTheme = document.body.getAttribute('data-bs-theme');
         const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
         // Set the theme to body
         document.body.setAttribute('data-bs-theme', newTheme);
         // change meta[name='color-scheme']
         changeMetaTag('color-scheme', newTheme);
         // Save to localStorage newTheme
         localStorage.setItem(storageKey, newTheme);
     });
 }


 const detectedTheme = () => {
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


document.addEventListener('DOMContentLoaded', () => {
    initBootstrapComponents();
    detectedTheme();
    switchTheme();
});


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
    return text.replace(regex, '<strong>$1</strong>'); // or <strong>, <span class="highlight"> etc.
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
 *
 * @param str
 * @returns {string}
 */
const formatDate = (str) => {
    const [year, month] = str.split("-");
    return new Date(year, month - 1).toLocaleString('default', {
        year: 'numeric',
        month: 'long'
    });
};

/**
 *
 * @param img
 * @param type
 * @returns {string}
 */
const storage = (img, type) => {
    if(img === 'placeholder' && !type) return '/public/assets/images/placeholder.png';
    if (!type) {
        return '/public/assets/images/' + img;
    }
    return '/public/assets/images/' + type + '/' + img;
}



