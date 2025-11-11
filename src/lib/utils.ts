import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const loginUrl: string = chrome.runtime.getURL("tabs/login.html")
export const registerUrl: string = chrome.runtime.getURL("tabs/register.html")

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const injectMainStyles = (cssText: string) => {
  const style = document.createElement("style")
  style.textContent = cssText
  document.head.appendChild(style)
}

export type WiqiChromeMessageType = {
  type: string
  data?: any
}

//? https://stackoverflow.com/questions/77403113/chrome-extension-chrome-identity-launchwebauthflow-how-to-set-size-of-popup-wi
export function resizeAuthWindowOnCreated(width: number, height: number) {
  chrome.windows.onCreated.addListener(
    function resizePopup(win) {
      if (win && win.id) {
        console.log(win)

        // Calculate centered position
        const top = Math.round((window.screen.height - height) / 2)
        const left = Math.round((window.screen.width - width) / 2)

        const opts = {
          top,
          left,
          width,
          height
        }

        chrome.windows.update(win.id, opts)
        chrome.windows.onCreated.removeListener(resizePopup)
      }
    },
    { windowTypes: ["popup"] }
  )
}

