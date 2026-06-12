const CODE_FENCE_RE = /```[\s\S]*?(?:```|$)/g;
const INLINE_CODE_RE = /`([^`\n]{1,160})`/g;

const CODE_START_RE =
    /^\s*(import|export|const|let|var|function|class|def|return|if\s*\(|for\s*\(|while\s*\(|try\s*\{|catch\s*\(|public|private|protected|static|async|await|module\.exports|require\(|#include|using\s+\w+|SELECT\s+|CREATE\s+|INSERT\s+|UPDATE\s+|DELETE\s+|<[/]?[a-z][^>]*>)/i;

const looksLikeCodeLine = (line) => {
    const trimmed = line.trim();
    if (trimmed.length < 3) return false;
    if (trimmed.startsWith("```")) return true;
    if (CODE_START_RE.test(trimmed)) return true;

    let score = 0;
    if (/^\s{4,}\S/.test(line)) score += 1;
    if (/[{};]/.test(trimmed)) score += 1;
    if (/(=>|===|!==|==|!=|&&|\|\|)/.test(trimmed)) score += 1;
    if (/\b(req|res|props|state|this|new|throw|catch|async|await)\b/.test(trimmed)) {
        score += 1;
    }
    if (/[A-Za-z0-9_$]+\([^)]*\)/.test(trimmed)) score += 1;

    return score >= 2;
};

const looksLikeInlineCode = (value) =>
    /[{};=<>()[\]]/.test(value) ||
    /\b(import|export|const|let|var|function|class|return|async|await|require)\b/i.test(
        value
    );

const normalizeWhitespace = (value) =>
    value
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

const redactCodeFromText = (value = "") => {
    let redacted = false;
    let text = String(value).replace(CODE_FENCE_RE, () => {
        redacted = true;
        return "[code excerpt omitted]";
    });

    text = text.replace(INLINE_CODE_RE, (match, inlineValue) => {
        if (!looksLikeInlineCode(inlineValue)) return match;
        redacted = true;
        return "[code omitted]";
    });

    const safeLines = [];
    let redactingRun = false;

    for (const line of text.split(/\r?\n/)) {
        if (looksLikeCodeLine(line)) {
            redacted = true;
            if (!redactingRun) {
                safeLines.push("[code excerpt omitted]");
                redactingRun = true;
            }
            continue;
        }

        safeLines.push(line);
        redactingRun = false;
    }

    return {
        text: normalizeWhitespace(safeLines.join("\n")),
        redacted,
    };
};

const safeExcerpt = (value, maxLength = 900) => {
    const redacted = redactCodeFromText(value);
    let text = redacted.text;

    if (text.length > maxLength) {
        text = `${text.slice(0, maxLength).trim()}...`;
    }

    return {
        text: text || (redacted.redacted ? "[code excerpt omitted]" : ""),
        redacted: redacted.redacted,
    };
};

module.exports = {
    redactCodeFromText,
    safeExcerpt,
};
