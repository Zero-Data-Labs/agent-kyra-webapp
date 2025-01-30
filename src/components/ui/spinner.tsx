"use client"

import { type SVGProps, useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/styles/utils"

export type SpinnerProps = SVGProps<SVGSVGElement>

export function Spinner(props: SpinnerProps) {
  const { className, ...svgProps } = props

  const svgRef = useRef<SVGSVGElement>(null)
  const [svgSize, setSvgSize] = useState(80)

  useLayoutEffect(() => {
    if (svgRef.current) {
      const { width, height } = svgRef.current.getBoundingClientRect()
      setSvgSize(Math.max(width, height))
    }
  }, [className])

  return (
    <svg
      ref={svgRef}
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className={cn("size-20 animate-spin text-primary", className)}
      {...svgProps}
    >
      <defs>
        <clipPath id="spinner-clip">
          <path
            d={`M0 0 h${svgSize} v${svgSize} H0 Z M${svgSize / 2} ${svgSize / 2} m-${svgSize * 0.375} 0 a${svgSize * 0.375},${svgSize * 0.375} 0 1,0 ${svgSize * 0.75},0 a${svgSize * 0.375},${svgSize * 0.375} 0 1,0 -${svgSize * 0.75},0`}
          />
        </clipPath>
      </defs>
      <circle
        cx={svgSize / 2}
        cy={svgSize / 2}
        r={svgSize / 2}
        style={{
          fill: "url(#spinner-gradient)",
          transformOrigin: "center",
        }}
        clipPath="url(#spinner-clip)"
      />
      <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </svg>
  )
}
Spinner.displayName = "Spinner"
