import {useLocale} from 'next-intl';
import {routing} from '@/i18n/routing';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} >
      {routing.locales.map((cur) => {
        let language = ''
        if(cur === 'vi') {
          language = "Tiếng Việt"
        } else {
          language = "English"
        }
        return(
          <option key={cur} value={cur}>
            {language}
          </option>
        )
      })}
    </LocaleSwitcherSelect>
  );
}