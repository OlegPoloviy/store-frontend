# Site translations

The storefront supports English (`en`, default) and German (`de`) through `i18next` and `react-i18next`. The language switcher in the public and admin navigation saves the choice in the `site-locale` cookie. Server components read that cookie, while client components use the same dictionaries through `I18nProvider`.

English interface strings serve as translation keys. Add each new interface string to `lib/i18n/de.json` and render it with `t("English text")` in client components or `getServerTranslation()` in server components. Keep placeholders in i18next form, such as `{{number}}`.

Product names, descriptions, categories, chat messages, and other API content come from the backend. German versions of that content require localized fields from the API; the frontend currently displays the value returned by the API.
