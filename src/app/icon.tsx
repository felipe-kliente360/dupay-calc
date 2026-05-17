import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div style={{
      width: 512, height: 512, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Background rounded square + amber outer ring */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
        background: '#111108', borderRadius: '22%',
        border: '20px solid #C8900A',
      }} />
      {/* Inner amber ring */}
      <div style={{
        position: 'absolute', top: 28, right: 28, bottom: 28, left: 28,
        borderRadius: '18%', border: '4px solid #C8900A',
      }} />
      {/* Hop trefoil + DUPAY text */}
      <div style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Three hop leaves */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <div style={{
            width: 66, height: 104, background: '#1E5A08',
            borderRadius: '50%', transform: 'rotate(-42deg)',
          }} />
          <div style={{
            width: 74, height: 118, background: '#2D7B10',
            borderRadius: '50%', marginBottom: 14,
          }} />
          <div style={{
            width: 66, height: 104, background: '#1E5A08',
            borderRadius: '50%', transform: 'rotate(42deg)',
          }} />
        </div>
        {/* Hop cone center */}
        <div style={{
          width: 38, height: 38, background: '#1A5008', borderRadius: '50%',
          border: '4px solid #2D7B10', marginTop: -16, display: 'flex',
        }} />
        {/* DUPAY */}
        <div style={{
          fontFamily: 'serif', fontSize: 70, fontWeight: 900,
          color: '#C8900A', letterSpacing: 10, marginTop: 18,
        }}>
          DUPAY
        </div>
      </div>
    </div>,
    size,
  )
}
