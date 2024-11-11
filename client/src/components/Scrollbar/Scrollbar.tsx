import React, { useEffect, useRef } from 'react'
import PerfectScrollbar from 'perfect-scrollbar'

type ScrollbarProps = {
  content: React.ReactNode
  height: string
  className?: string
}

const Scrollbar: React.FC<ScrollbarProps> = ({
  content,
  className,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const ps = new PerfectScrollbar(containerRef.current)

      return () => {
        ps.destroy()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ height: `${height}` }}
      className={`${className} relative`}
    >
      {content}
    </div>
  )
}

export default Scrollbar
