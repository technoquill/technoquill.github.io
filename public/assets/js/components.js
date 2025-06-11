/**
 * @type {{template: string}}
 */
const ProfilePictureComponent = {
    props: ['src'],
    template: `
    <div class="profile-picture">
      <img class="img-fluid rounded-circle"
           :src="src"
           alt="Profile picture" />
    </div>
  `
};


/**
 * @type {{props: string[], template: string}}
 */
const LocationComponent = {
    props: ['data'],
    template: `
    <address class="placeholder w-100">
      <i class="fa-solid fa-location-dot"></i>
      <span v-text="data.location"></span>
    </address>
  `
};


/**
 * @type {{props: string[], template: string}}
 */
const NetworksComponent = {
    props: ['data'],
    template: `
    <div class="placeholder w-100">
      <div class="h5" v-text="$t('message.networks')"></div>
      <ul class="links-list">
        <li v-for="item in data.links">
          <a :href="item.src" :title="item.title" target="_blank">
            <i :class="item.icon"></i>
            <span v-text="item.title"></span>
          </a>
        </li>
      </ul>
    </div>
  `
};

/**
 * @type {{props: string[], template: string}}
 */
const LanguagesComponent = {
    props: ['data'],
    template: `
    <div class="placeholder w-100">
      <div class="h5" v-text="$t('message.languages')"></div>
      <ul>
        <li v-for="(item, key) in data.languages">
          <strong v-html="key + ' : '"></strong>
          <span v-html="item"></span>
        </li>
      </ul>
    </div>
  `
};


/**
 * @type {{template: string}}
 */
const VCardButtonsComponent = {
    template: `
    <div class="d-grid gap-2">
      <div class="placeholder w-100">
        <a class="btn btn-outline-secondary placeholder w-100"
           target="_blank"
           href="/public/vcard/v-card.vcf"
           v-text="$t('message.save_vcard')"></a>
      </div>
      <div class="placeholder w-100">
        <a class="btn btn-outline-secondary placeholder w-100"
           href="#"
           data-bs-toggle="modal"
           data-bs-target="#qr-modal"
           v-text="$t('message.open_qr_contacts')"></a>
      </div>
    </div>
  `
};



/**
 * @type {{template: string}}
 */
const ThemeToggleComponent = {
    data() {
        autoDetectAndSetTheme();
        let mode = localStorage.getItem(storageKey);
        return { mode };
    },
    computed: {
        tooltip() {
            return this.mode === 'dark'
                ? this.$t('message.light_mode')
                : this.$t('message.dark_mode');
        }
    },
    mounted() {
        // Встановлюємо theme в body та localStorage
        document.body.setAttribute('data-bs-theme', this.mode);
        localStorage.setItem('theme', this.mode);

        // Ініціалізуємо Bootstrap Tooltip
        const toggleBtn = this.$el.querySelector('#theme-toggle');
        if (window.bootstrap) {
            bootstrap.Tooltip.getOrCreateInstance(toggleBtn);
        }
        // Слухаємо клік
        toggleBtn.addEventListener('click', () => {
            this.mode = this.mode === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-bs-theme', this.mode);
            localStorage.setItem('theme', this.mode);
            toggleBtn.setAttribute('data-bs-title', this.tooltip);
            // Оновлюємо tooltip
            if (window.bootstrap) {
                const tip = bootstrap.Tooltip.getOrCreateInstance(toggleBtn);
                tip.setContent({ '.tooltip-inner': this.tooltip });
            }
        });
    },
    watch: {
        mode(newMode) {
            // Дублюємо логіку оновлення tooltip при зміні теми ззовні (наприклад, через localStorage)
            const toggleBtn = this.$el.querySelector('#theme-toggle');
            toggleBtn.setAttribute('data-bs-title', this.tooltip);
            if (window.bootstrap) {
                const tip = bootstrap.Tooltip.getOrCreateInstance(toggleBtn);
                tip.setContent({ '.tooltip-inner': this.tooltip });
            }
        }
    },
    template: `
    <div class="placeholder-glow">
      <button class="theme-toggler btn btn-default"
              type="button"
              id="theme-toggle"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              :data-bs-title="tooltip">
        <span></span>
      </button>
    </div>
  `
};


/**
 * @type {{props: string[], template: string}}
 */
const LangSwitcherComponent = {
    props: ['locales', 'getLocale'],
    template: `
    <div class="placeholder-glow">
      <div class="btn-group-horizontal btn-group-sm" id="lang-switcher">
        <template v-for="locale in locales">
          <input
            type="radio"
            class="btn-check"
            name="lang"
            :id="locale"
            :checked="getLocale() === locale"
            autocomplete="off"
            @change="$emit('change', locale)"
          >
          <label class="btn btn-outline-secondary" :for="locale" v-text="locale"></label>
        </template>
      </div>
    </div>
  `
};


/**
 * @type {{props: string[], template: string}}
 */
const NavbarComponent = {
    props: ['data', 'storage'],
    template: `
    <div class="placeholder-glow">
      <nav class="navbar" id="navbar">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">&nbsp;</a>
          <button class="navbar-toggler" type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasNavbar"
                  aria-controls="offcanvasNavbar">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="offcanvas offcanvas-end" tabindex="-1"
               id="offcanvasNavbar"
               aria-labelledby="offcanvasNavbarLabel">
            <div class="offcanvas-header">
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                      :aria-label="$t('message.close')"></button>
            </div>
            <div class="offcanvas-body">
              <profile-picture-component :src="storage('placeholder')" />
              <location-component :data="data" />
              <networks-component :data="data" />
              <languages-component :data="data" />
              <v-card-buttons-component />
            </div>
          </div>
        </div>
      </nav>
    </div>
  `
};




/**
 *
 * @type {{props: string[], template: string}}
 */
const ArticleHeaderComponent = {
    props: ['data'],
    template: `
     <h1 class="placeholder w-100">
        <span v-html="data.name"></span>
     </h1>
    `
};

/**
 * @type {{props: string[], template: string}}
 */
const AboutMeSectionComponent = {
    props: ['data'],
    template: `
    <section class="about-me placeholder-glow" id="about-me">
      <h2 class="placeholder w-90">
        <span class="aim" v-text="data.title"></span>
      </h2>
      <div>
        <p class="placeholder w-100" v-html="data.summary"></p>
        <p class="placeholder w-100" v-html="data.purpose"></p>
      </div>
      <div class="placeholder w-100">
        <ul>
          <li v-for="(item, key) in data.skills" :key="key">
            <strong v-html="key + ' : '"></strong>
            <span v-html="item"></span>
          </li>
        </ul>
      </div>
    </section>
  `
};


/**
 *
 * @type {{props: string[], template: string}}
 */
const ExperienceSectionComponent = {
    props: ['data', 'locale', 'storage', 'formatDate', 'wrapText', 'strongLine'],
    template: `
       <section class="experiences placeholder-glow" id="experience">
            <h2 class="placeholder w-50" v-text="$t('message.experience')"></h2>
            <div class="item placeholder w-100" v-for="(item) in data.experience" v-if="data.experience">
                <h3 class="h4" v-text=" item.position"></h3>
                <div class="row">
                    <div class="col-auto">
                        <img :style="{ backgroundImage: 'url(' + storage(item.logo, 'logotype') + ')' }"
                             :src="storage('placeholder')" :alt="item.company"
                             class="company-logo img-fluid">
                    </div>
                    <div class="col"><span v-html="formatDate(item.start_date, locale)"></span> - <span
                            v-html="formatDate(item.end_date, locale)"></span><br>
                        <strong v-text="item.company"></strong> — <span v-text="item.location"></span>
                    </div>
                </div>
                <div v-if="item.responsibilities">
                    <p v-html="wrapText(item.description, item.keywords)"></p>
                    <ul>
                        <li v-for="(item, key) in item.responsibilities" :key="key"
                            v-html="strongLine(key, item)"></li>
                    </ul>
                </div>
            </div>
        </section>
      `
};

/**
 * @type {{props: string[], template: string}}
 */
const EducationSectionComponent = {
    props: ['data', 'locale', 'storage', 'formatDate'],
    template: `
     <section class="education placeholder-glow" id="education">
        <h2 class="placeholder w-50" v-text="$t('message.education')"></h2>
        <div class="item placeholder w-100" v-for="(item) in data.education" v-if="data.education">
            <h3 class="h4" v-text=" item.institution"></h3>
            <div class="row">
                <div class="col-auto">
                    <img :style="{ backgroundImage: 'url(' + storage(item.logo, 'logotype') + ')' }"
                         :src="storage('placeholder')" :alt="item.institution"
                         class="company-logo img-fluid">
                </div>
                <div class="col"><span v-html="formatDate(item.start_date, locale)"></span> - <span
                        v-html="formatDate(item.end_date, locale)"></span><br>
                    <strong v-text="item.area"></strong> — <span v-text="item.study_type"></span>
                </div>
                <div>
                    <p v-html="item.description"></p>
                </div>
            </div>
        </div>
    </section>
  `
};

/**
 *
 * @type {{props: string[], template: string}}
 */
const QrModalComponent = {
    props: ['storage'],
    template: `
    <div class="modal fade" id="qr-modal" tabindex="-1" aria-labelledby="qrModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title fs-5" id="modal-label" v-text="$t('message.qr_contact')"></h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal"
              :aria-label="$t('message.close')"></button>
          </div>
          <div class="modal-body">
            <div class="qr-v-card">
              <img class="img-fluid" :src="storage('placeholder')" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};



