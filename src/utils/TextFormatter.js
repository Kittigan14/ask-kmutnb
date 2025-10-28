export const formatMessage = (text) => {
  if (!text) return "";

  let formatted = text;

  formatted = formatted
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\\t/g, "  ");

  formatted = formatted
    .replace(/^### (.+)$/gm, '<div class="msg-h3">$1</div>')
    .replace(/^## (.+)$/gm, '<div class="msg-h2">$1</div>')
    .replace(/^# (.+)$/gm, '<div class="msg-h1">$1</div>');

  formatted = formatted
    .replace(/\*\*(.+?)\*\*/g, '<strong class="msg-bold">$1</strong>')
    .replace(/__(.+?)__/g, '<strong class="msg-bold">$1</strong>');

  formatted = formatted.replace(
    /(?<!\*)\*(?!\*)([^*\n]+?)(?<!\*)\*(?!\*)/g,
    '<em class="msg-italic">$1</em>'
  );

  formatted = formatted.replace(
    /`([^`\n]+)`/g,
    '<code class="msg-code">$1</code>'
  );

  formatted = formatted.replace(
    /```([\s\S]+?)```/g,
    '<pre class="msg-pre"><code>$1</code></pre>'
  );

  formatted = formatted.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="msg-link">$1</a>'
  );

  formatted = formatted.replace(
    /^•\s+(.+)$/gm,
    '<div class="msg-bullet">• $1</div>'
  );

  // * text (ต้องระวังไม่ให้ชนกับ bold)
  formatted = formatted.replace(
    /^\*\s+(.+)$/gm,
    '<div class="msg-bullet">• $1</div>'
  );

  formatted = formatted.replace(
    /^-\s+(.+)$/gm,
    '<div class="msg-bullet">• $1</div>'
  );

  formatted = formatted.replace(
    /^(\d+)\.\s+(.+)$/gm,
    '<div class="msg-numbered">$1. $2</div>'
  );

  formatted = formatted.replace(
    /^>\s+(.+)$/gm,
    '<blockquote class="msg-quote">$1</blockquote>'
  );

  formatted = formatted.replace(/^(-{3,}|\*{3,})$/gm, '<hr class="msg-hr" />');

  formatted = formatted.replace(/~~(.+?)~~/g, '<del class="msg-del">$1</del>');

  formatted = formatted
    .split("\n")
    .map((line) => {
      line = line.trim();
      if (line.length === 0) {
        return '<div class="msg-spacing"></div>';
      }
      if (
        line.startsWith("<div") ||
        line.startsWith("<h") ||
        line.startsWith("<hr") ||
        line.startsWith("<blockquote") ||
        line.startsWith("<pre")
      ) {
        return line;
      }
      return `<div class="msg-line">${line}</div>`;
    })
    .join("");

  return formatted;
};

export const formatKMUTNBMessage = (text) => {
  if (!text) return "";

  let formatted = formatMessage(text);

  formatted = formatted
    .replace(/(คณะ[ก-๙\s]+)/g, '<span class="highlight-faculty">$1</span>')
    .replace(/(สาขา[ก-๙\s]+)/g, '<span class="highlight-major">$1</span>')
    .replace(
      /(หลักสูตร[ก-๙\s]+)/g,
      '<span class="highlight-program">$1</span>'
    );

  formatted = formatted.replace(
    /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(บาท|฿)/g,
    '<span class="highlight-money">$1 $2</span>'
  );

  formatted = formatted.replace(
    /(\d+)\s*(หน่วยกิต|คน|ที่นั่ง)/g,
'<span class="highlight-number"><span class="number-value">$1</span><span class="number-unit">$2</span></span>'
  );

  formatted = formatted.replace(
    /(\d{2,3}-\d{3}-\d{4})/g,
    '<a href="tel:$1" class="highlight-phone">📞 $1</a>'
  );

  formatted = formatted.replace(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g,
    '<a href="mailto:$1" class="highlight-email">📧 $1</a>'
  );

  formatted = formatted.replace(
    /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/g,
    '<span class="highlight-date">📅 $1</span>'
  );

  return formatted;
};

export const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

export const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export const hasMarkdown = (text) => {
  if (!text) return false;

  const patterns = [
    /\*\*[^*]+\*\*/,
    /^[•\-\*]\s+/m,
    /^\d+\.\s+/m,
    /^#+\s+/m,
    /`[^`]+`/,
    /\[.+\]\(.+\)/,
  ];

  return patterns.some((p) => p.test(text));
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export default {
  formatMessage,
  formatKMUTNBMessage,
  escapeHtml,
  stripHtml,
  hasMarkdown,
  truncateText,
};
