import {
    Document,
    Paragraph,
    TextRun,
    HeadingLevel,
    Packer,
    ImageRun,
} from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DownloadFormat, DownloadData } from "./types";

export async function downloadFile(
    format: DownloadFormat,
    data: DownloadData
): Promise<void> {
    const { title, content, htmlContent } = data;

    switch (format) {
        case "docx":
            return downloadAsDocx(title, content, htmlContent);
        case "pdf":
            return downloadAsPdf(title, htmlContent || content);
        case "md":
            return downloadAsMarkdown(title, content);
        case "txt":
            return downloadAsText(title, content);
    }
}

/* ================= DOCX ================= */

async function downloadAsDocx(
    title: string,
    content: string,
    htmlContent?: string
): Promise<void> {
    const titleParagraph = new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 },
    });

    const paragraphs: Paragraph[] = [];

    const contentParagraphs = content.split("\n").map((line) => {
        if (!line.trim()) {
            return new Paragraph({ spacing: { after: 100 } });
        }

        return new Paragraph({
            children: [new TextRun({ text: line, size: 24 })],
            spacing: { after: 150 },
        });
    });

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                    },
                },
                children: [titleParagraph, ...paragraphs, ...contentParagraphs],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${title}.docx`);
}

/* ================= PDF (Notion Style) ================= */

async function downloadAsPdf(
    title: string,
    htmlContent: string
): Promise<void> {
    const tempDiv = document.createElement("div");

    // 여백 없음 / 본문만
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.width = "170mm";
    tempDiv.style.backgroundColor = "#ffffff";
    tempDiv.style.fontFamily = "'Malgun Gothic', 'Noto Sans KR', sans-serif";
    tempDiv.style.color = "#000";
    tempDiv.style.boxSizing = "border-box";

    tempDiv.innerHTML = `
    <h1 style="
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 10mm 0;
    ">
      ${escapeHtml(title)}
    </h1>

    <div style="
      font-size: 11pt;
      line-height: 1.7;
      word-break: break-word;
    ">
      ${htmlContent}
    </div>
  `;

    // 문단 간격 (노션 느낌)
    tempDiv.querySelectorAll("p").forEach((p) => {
        const el = p as HTMLElement;
        el.style.margin = "0 0 6mm 0";
    });

    // 이미지 안정화
    tempDiv.querySelectorAll("img").forEach((img) => {
        const el = img as HTMLImageElement;
        el.style.maxWidth = "100%";
        el.style.height = "auto";
        el.style.display = "block";
        el.style.margin = "6mm 0";
    });

    document.body.appendChild(tempDiv);

    try {
        await waitForImages(tempDiv);

        const canvas = await html2canvas(tempDiv, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true,
        });

        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = 210;
        const pageHeight = 297;

        const marginX = 20;
        const marginTop = 25;
        const marginBottom = 25;

        const contentWidth = pageWidth - marginX * 2;
        const contentHeight = pageHeight - marginTop - marginBottom;

        const imgHeight =
            (canvas.height * contentWidth) / canvas.width;

        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        let renderedHeight = 0;
        let pageIndex = 0;

        while (renderedHeight < imgHeight) {
            if (pageIndex > 0) pdf.addPage();

            pdf.addImage(
                imgData,
                "JPEG",
                marginX,
                marginTop - renderedHeight,
                contentWidth,
                imgHeight
            );

            renderedHeight += contentHeight;
            pageIndex++;
        }

        pdf.save(`${title}.pdf`);
    } finally {
        document.body.removeChild(tempDiv);
    }
}

/* ================= MD ================= */

async function downloadAsMarkdown(title: string, content: string) {
    const markdown = `# ${title}\n\n${content}`;
    const blob = new Blob([markdown], {
        type: "text/markdown;charset=utf-8",
    });
    triggerDownload(blob, `${title}.md`);
}

/* ================= TXT ================= */

async function downloadAsText(title: string, content: string) {
    const text = `${title}\n\n${content}`;
    const blob = new Blob([text], {
        type: "text/plain;charset=utf-8",
    });
    triggerDownload(blob, `${title}.txt`);
}

/* ================= Utils ================= */

function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function waitForImages(container: HTMLElement): Promise<void> {
    const images = Array.from(container.querySelectorAll("img"));
    if (images.length === 0) return Promise.resolve();

    return Promise.all(
        images.map(
            (img) =>
                img.complete ||
                new Promise<void>((resolve) => {
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                })
        )
    ).then(() => {});
}
