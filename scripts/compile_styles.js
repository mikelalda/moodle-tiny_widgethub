const sass = require('sass');
const fs = require('fs');
const path = require('path');
const {format} = require('./format_styles');

const inputFile = path.resolve(__dirname, '../styles/styles.scss');
const outputFile = path.resolve(__dirname, '../styles.css');

// The notes' stylesheet, pasted into styles.css by herramientas/adaptar_widgethub.py
// between these markers, is kept as it is: it does not come from the SCSS sources.
const NOTES_START = '/* >>> APUNTES scorm2libro: inicio';
const NOTES_END = '/* <<< APUNTES scorm2libro: fin */';

/**
 * The notes block of the current styles.css, markers included, or ''.
 *
 * @returns {string}
 */
const notesBlock = () => {
    if (!fs.existsSync(outputFile)) {
        return '';
    }
    const css = fs.readFileSync(outputFile, 'utf8');
    const start = css.indexOf(NOTES_START);
    const end = css.indexOf(NOTES_END, start);
    return start >= 0 && end > start ? css.slice(start, end + NOTES_END.length) : '';
};

try {
    const result = sass.compile(inputFile, {
        style: 'expanded'
    });
    const compiled = result.css.replace(/^@charset\s+"utf-8";\s*/i, '');
    const notes = notesBlock();
    const css = notes ? compiled.trimEnd() + '\n\n' + notes + '\n' : compiled;
    fs.writeFileSync(outputFile, format(css));
    console.log(`Successfully compiled ${inputFile} to ${outputFile}`);
} catch (error) {
    console.error('Error compiling SCSS:', error);
    process.exit(1);
}
