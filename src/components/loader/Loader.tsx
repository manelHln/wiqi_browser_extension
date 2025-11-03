import React from "react"

import "./style.css"

type Props = {
  bgColor?: string
}

export default function Loader({bgColor = "#c517f0"}: Props) {
  return (
    <div className="loader">
      <div style={{background: bgColor}}></div>
      <div style={{background: bgColor}}></div>
      <div style={{background: bgColor}}></div>
      <div style={{background: bgColor}}></div>
    </div>
  )
}
