import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{
      width: 180, height: 180, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Background circle + amber outer ring */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
        background: '#111108', borderRadius: '50%',
        border: '7px solid #C8900A',
      }} />
      {/* Inner amber ring */}
      <div style={{
        position: 'absolute', top: 10, right: 10, bottom: 10, left: 10,
        borderRadius: '50%', border: '1.5px solid #C8900A',
      }} />
      {/* Hop trefoil + DUPAY text */}
      <div style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Three hop leaves */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          <div style={{
            width: 23, height: 37, background: '#1E5A08',
            borderRadius: '50%', transform: 'rotate(-42deg)',
          }} />
          <div style={{
            width: 26, height: 42, background: '#2D7B10',
            borderRadius: '50%', marginBottom: 5,
          }} />
          <div style={{
            width: 23, height: 37, background: '#1E5A08',
            borderRadius: '50%', transform: 'rotate(42deg)',
          }} />
        </div>
        {/* Hop cone center */}
        <div style={{
          width: 14, height: 14, background: '#1A5008', borderRadius: '50%',
          border: '1.5px solid #2D7B10', marginTop: -5, display: 'flex',
        }} />
        {/* DUPAY */}
        <div style={{
          fontFamily: 'serif', fontSize: 25, fontWeight: 900,
          color: '#C8900A', letterSpacing: 3.5, marginTop: 6,
        }}>
          DUPAY
        </div>
      </div>
    </div>,
    size,
  )
}
