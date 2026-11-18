'use client'

import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

// The QR code for the flyer, pointing at /anmelden. The admin is served from
// the public host, so its origin is the link the QR code carries.
export default function SignupQR() {
  const [svg, setSvg] = useState('')
  const [png, setPng] = useState('')
  const url = typeof window !== 'undefined' ? `${window.location.origin}/anmelden` : ''

  useEffect(() => {
    if (!url) return
    QRCode.toString(url, { type: 'svg', margin: 1 }).then(setSvg)
    QRCode.toDataURL(url, { width: 1200, margin: 2 }).then(setPng)
  }, [url])

  if (!url) return null

  return (
    <div style={{ marginBottom: 'var(--spacing-field)' }}>
      <div
        style={{ width: 220, background: '#fff', padding: 8 }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p>
        <a href={url}>{url}</a>
      </p>
      <p style={{ display: 'flex', gap: 16 }}>
        {svg ? (
          <a
            download={`anmeldung-qr.svg`}
            href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
          >
            QR-Code als SVG
          </a>
        ) : null}
        {png ? (
          <a download={`anmeldung-qr.png`} href={png}>
            QR-Code als PNG
          </a>
        ) : null}
      </p>
    </div>
  )
}
