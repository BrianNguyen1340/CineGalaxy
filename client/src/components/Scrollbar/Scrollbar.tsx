import React, { useEffect, useRef } from 'react'
import PerfectScrollbar from 'perfect-scrollbar'

type ScrollbarProps = {
  content: React.ReactNode
  style: React.CSSProperties
}

const Scrollbar: React.FC<ScrollbarProps> = ({ content, style }) => {
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
    <div ref={containerRef} style={style} className='relative'>
      {content}
    </div>
  )
}

export default Scrollbar
