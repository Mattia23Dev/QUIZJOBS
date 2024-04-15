import React from 'react'
import QRCode from 'qrcode.react';

const QrCode = ({link}) => {
  return (
    <div>
        <QRCode value={link} />
    </div>
  )
}

export default QrCode