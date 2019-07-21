const fs = require('fs');
const locale = process.argv[2];
const file = process.argv[3];
const titles = {
  fr: 'Tous mes rappels',
  en: 'All my reminders',
};
const replacements = [
  ['lang="en"', `lang="${locale}"`],
  [/<title>(.*)<\/title>/, `<title>Remind - ${titles[locale]}</title>`],
  [/<base href="\/">/, `<base href="/${locale}/">`]
];
let content = fs.readFileSync(file).toString();
replacements.forEach(replacement => {
  content = content.replace(replacement[0], replacement[1]);
});

fs.writeFileSync(file, content);
