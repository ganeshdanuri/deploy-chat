import {
    FileText,
    FileImage,
    FileCode,
    FileJson,
    FileSpreadsheet,
    FileArchive,
    FileVideo,
    FileAudio,
    type LucideIcon,
} from "lucide-react";

export interface FileIconMeta {
    Icon: LucideIcon;
    color: string;
    bg: string;
}

export function getFileIcon(name: string): FileIconMeta {
    const ext = name.split(".").pop()?.toLowerCase() ?? "";

    if (["jpg", "jpeg", "png", "gif", "svg", "webp", "ico", "avif"].includes(ext))
        return { Icon: FileImage,       color: "#D97706", bg: "#FFFBEB" };
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext))
        return { Icon: FileVideo,       color: "#7C3AED", bg: "#F5F3FF" };
    if (["mp3", "wav", "ogg", "m4a", "flac"].includes(ext))
        return { Icon: FileAudio,       color: "#DB2777", bg: "#FDF2F8" };
    if (["zip", "tar", "gz", "rar", "7z"].includes(ext))
        return { Icon: FileArchive,     color: "#92400E", bg: "#FEF3C7" };
    if (["js", "ts", "jsx", "tsx", "py", "go", "rs", "java", "cpp", "c", "rb", "php", "sh"].includes(ext))
        return { Icon: FileCode,        color: "#2563EB", bg: "#EFF6FF" };
    if (["json", "yaml", "yml", "toml", "xml", "env"].includes(ext))
        return { Icon: FileJson,        color: "#0891B2", bg: "#ECFEFF" };
    if (["csv", "xls", "xlsx", "numbers"].includes(ext))
        return { Icon: FileSpreadsheet, color: "#16A34A", bg: "#F0FDF4" };
    if (["md", "mdx", "txt", "rtf"].includes(ext))
        return { Icon: FileText,        color: "#1D2020", bg: "#F5F5F4" };
    if (["pdf"].includes(ext))
        return { Icon: FileText,        color: "#DC2626", bg: "#FEF2F2" };
    if (["doc", "docx", "pages", "odt"].includes(ext))
        return { Icon: FileText,        color: "#1D4ED8", bg: "#EFF6FF" };

    return { Icon: FileText,            color: "#1D2020", bg: "#F5F5F4" };
}
