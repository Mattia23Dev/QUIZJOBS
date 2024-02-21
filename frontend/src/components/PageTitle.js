import React from 'react'

function PageTitle({title, style}) {
  return (
    <h1 className='page-title' style={style}>{title}</h1>
  )
}

export default PageTitle