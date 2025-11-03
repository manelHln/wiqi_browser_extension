import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import WiqiInterface from "~components/MainModal"

// Import your Tailwind CSS
import styleText from "data-text:~styles.css"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: false,
  run_at: 'document_idle'
}

// Enable Shadow DOM to isolate styles
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

// Use Shadow DOM to prevent style conflicts
export const getShadowHostId = () => "wiqi-extension-root"

export default WiqiInterface