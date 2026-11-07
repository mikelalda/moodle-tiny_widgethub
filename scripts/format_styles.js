/**
 * Lay out styles.css the way Moodle's stylelint configuration expects it, so that
 * `moodle-plugin-ci grunt` passes whichever tool wrote the file: Sass (two-space
 * indentation) or herramientas/adaptar_widgethub.py, which pastes the notes'
 * stylesheet between its markers.
 *
 * - Four-space indentation, one declaration per line, one selector per line.
 * - An empty line before top-level at-rules.
 * - Short hex colours and unitless zeros.
 * - Declarations longer than 132 characters split over several lines.
 * - !important, needed to override Bootstrap and TinyMCE, marked for stylelint.
 *
 * Running it again leaves the file unchanged.
 *
 * Usage: node format_styles.js [file]   (default: ../styles.css)
 */
const fs = require('fs');
const path = require('path');

const DISABLE = '/* stylelint-disable-next-line declaration-no-important */';
const MAX_LENGTH = 132;

/**
 * Split on a separator outside parentheses and quotes.
 *
 * @param {string} text
 * @param {string} separator
 * @returns {string[]}
 */
const splitTop = (text, separator) => {
    const parts = [];
    let current = '';
    let depth = 0;
    let quote = null;
    for (const c of text) {
        if (quote) {
            current += c;
            if (c === quote) {
                quote = null;
            }
            continue;
        }
        if (c === '"' || c === "'") {
            quote = c;
        } else if (c === '(') {
            depth++;
        } else if (c === ')') {
            depth--;
        }
        if (c === separator && depth === 0) {
            parts.push(current);
            current = '';
        } else {
            current += c;
        }
    }
    parts.push(current);
    return parts;
};

const indentOf = (line) => line.slice(0, line.length - line.trimStart().length);

/**
 * "a { b: c; d: e; }" on one line becomes a block.
 *
 * @param {string[]} lines
 * @returns {string[]}
 */
const expandSingleLineRules = (lines) => lines.flatMap((line) => {
    const match = /^(\s*)([^{}/]+?)\s*\{\s*(.*?)\s*\}\s*$/.exec(line);
    if (!match || !match[3].includes(':')) {
        return [line];
    }
    const [, indent, selector, body] = match;
    const declarations = splitTop(body, ';').map((d) => d.trim()).filter(Boolean);
    return [`${indent}${selector} {`, ...declarations.map((d) => `${indent}  ${d};`), `${indent}}`];
});

/**
 * "a, b {" becomes one selector per line.
 *
 * @param {string[]} lines
 * @returns {string[]}
 */
const splitSelectors = (lines) => lines.flatMap((line) => {
    const text = line.trim();
    if (!text.endsWith('{') || text.startsWith('@') || !text.includes(',')) {
        return [line];
    }
    const parts = splitTop(text.slice(0, -1), ',').map((p) => p.trim());
    if (parts.length < 2) {
        return [line];
    }
    const indent = indentOf(line);
    return [...parts.slice(0, -1).map((p) => `${indent}${p},`), `${indent}${parts[parts.length - 1]} {`];
});

/**
 * Indent by nesting depth, four spaces a level; comment lines follow their block.
 *
 * @param {string[]} lines
 * @returns {string[]}
 */
const reindent = (lines) => {
    const out = [];
    let depth = 0;
    let inComment = false;
    let continuation = 0;
    for (const line of lines) {
        const text = line.trim();
        if (inComment) {
            out.push(text ? '    '.repeat(depth) + (text.startsWith('*') ? ' ' : '') + text : '');
            if (text.includes('*/')) {
                inComment = false;
            }
            continue;
        }
        let code = text.replace(/\/\*.*?\*\//g, '');
        if (code.includes('/*')) {
            inComment = true;
            code = code.slice(0, code.indexOf('/*'));
        }
        const closing = code.length - code.replace(/^\}+/, '').length;
        const level = Math.max(depth - closing, 0);
        // Lines inside a multi-line value (after "property:" or "fn(") go one level deeper per open parenthesis.
        const closingParens = code.startsWith(')') ? 1 : 0;
        const extra = Math.max(continuation - closingParens, 0);
        out.push(text ? '    '.repeat(level + extra) + text : '');
        depth = Math.max(depth + (code.match(/\{/g) || []).length - (code.match(/\}/g) || []).length, 0);
        continuation += (code.match(/\(/g) || []).length - (code.match(/\)/g) || []).length;
        if (/:$/.test(code)) {
            continuation += 1;
        } else if (/;$/.test(code) || /[{}]$/.test(code)) {
            continuation = 0;
        }
        continuation = Math.max(continuation, 0);
    }
    return out;
};

/**
 * Split declarations longer than MAX_LENGTH: at their top-level commas, or else
 * inside the arguments of the function they hold.
 *
 * @param {string[]} lines
 * @returns {string[]}
 */
const splitLongDeclarations = (lines) => lines.flatMap((line) => {
    const match = /^(\s*)([a-z-]+):\s*(.+);$/.exec(line);
    if (line.length <= MAX_LENGTH || !match) {
        return [line];
    }
    const [, indent, property, value] = match;
    const inner = indent + '    ';
    const parts = splitTop(value, ',').map((p) => p.trim());
    if (parts.length > 1) {
        return [`${indent}${property}:`, ...parts.map((p, i) => inner + p + (i < parts.length - 1 ? ',' : ';'))];
    }
    const fn = /^([a-z-]+)\((.*)\)$/.exec(value.trim());
    if (!fn) {
        return [line];
    }
    const args = splitTop(fn[2], ',').map((a) => a.trim());
    return [`${indent}${property}:`, `${inner}${fn[1]}(`,
        ...args.map((a, i) => inner + '    ' + a + (i < args.length - 1 ? ',' : '')), `${inner});`];
});

/**
 * An empty line before each top-level at-rule, unless it follows a comment or
 * another blockless at-rule.
 *
 * @param {string[]} lines
 * @returns {string[]}
 */
const atRuleBlankLines = (lines) => {
    const out = [];
    for (const line of lines) {
        const text = line.trim();
        if (text.startsWith('@') && line === text && out.length) {
            const previous = out[out.length - 1].trim();
            const blocklessPair = previous.startsWith('@') && previous.endsWith(';') && text.endsWith(';');
            if (previous && !previous.endsWith('*/') && !blocklessPair) {
                out.push('');
            }
        }
        out.push(line);
    }
    return out;
};

/**
 * Mark each !important declaration for stylelint.
 *
 * @param {string[]} lines
 * @returns {string[]}
 */
const markImportant = (lines) => {
    const out = [];
    for (const line of lines) {
        if (line.includes('!important') && !line.trim().startsWith('/*')
                && !(out.length && out[out.length - 1].trim() === DISABLE)) {
            out.push(indentOf(line) + DISABLE);
        }
        out.push(line);
    }
    return out;
};

/**
 * Short hex colours (#ffffff -> #fff) and unitless zeros (0px -> 0), outside comments.
 *
 * @param {string} line
 * @returns {string}
 */
const tidyValues = (line) => {
    if (line.trim().startsWith('/*') || line.trim().startsWith('*')) {
        return line;
    }
    return line
        .replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3\b/g, '#$1$2$3')
        .replace(/(^|[\s:(,])0px\b/g, '$10');
};

/**
 * Format a stylesheet.
 *
 * @param {string} css
 * @returns {string}
 */
const format = (css) => {
    let lines = css.split('\n');
    lines = expandSingleLineRules(lines);
    lines = splitSelectors(lines);
    lines = lines.map(tidyValues);
    lines = reindent(lines);
    lines = splitLongDeclarations(lines);
    lines = atRuleBlankLines(lines);
    lines = markImportant(lines);
    return lines.map((l) => l.trimEnd()).join('\n');
};

module.exports = {format};

if (require.main === module) {
    const file = path.resolve(process.argv[2] || path.join(__dirname, '../styles.css'));
    const before = fs.readFileSync(file, 'utf8');
    const after = format(before);
    if (after !== before) {
        fs.writeFileSync(file, after);
        console.log(`Formatted ${file}`);
    } else {
        console.log(`${file} was already formatted`);
    }
}
