export async function waitForFonts(): Promise<void> {
  try {
    await document.fonts.ready;
  } catch {
    // Ignore font loading errors
  }
}

export const FONT_SERIF = '"Noto Serif SC", "Songti SC", "SimSun", "STSong", serif';
export const FONT_SANS = '-apple-system, "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif';
