import type { WiqiChromeMessageType } from "~lib/utils"

export {}

console.log("HELLO WORLD FROM BGSCRIPTS")

const handleLogin = (width, height, left, top) => {
  const loginUrl = chrome.runtime.getURL("tabs/login.html")


  chrome.windows.create({
    url: loginUrl,
    type: "popup",
    width: width,
    height: height,
    left: left,
    top: top
  })
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.tabs
      .sendMessage(tab.id, { type: "TOGGLE_MODAL" })
      .catch((error) => console.error("Error sending message:", error))
  }
})

chrome.runtime.onMessage.addListener(function (
  message: WiqiChromeMessageType,
  sender,
  sendResponse
) {
  if (
    message &&
    message.type === "SET_ICON_BADGE_COUNT" &&
    message.data?.count
  ) {
    chrome.action.setBadgeText({
      text: String(message.data.count),
      tabId: sender.tab.id
    })
  }

  if (message && message.type === "GET_TAB_ID") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]?.url) {
        // console.log(tabs[0]?.url)
        const url = new URL(tabs[0].url)
        const site = url.hostname.replace("www.", "")
        sendResponse({url: url, site: site})
      }
    })
  }

  if(message && message.type === 'LOGIN'){
    const {width, height, top, left} = message.data
    handleLogin(width, height, left, top)
  }

  if(message && message.type === 'LOGGED_IN'){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.runtime.sendMessage({ type: 'LOGGED_IN' })
    })
  }

  if(message && message.type === 'CLOSE_POPUP'){
    const popupId = message.data.popupId
  }
})