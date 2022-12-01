import React from 'react'
import { CToast, CToastBody, CToastClose } from '@coreui/react'

const Toast = ({ text = 'Order Added Successfully', onClose }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'relative',
        marginBottom: 10,
        position: 'absolute',
        top: '20vh  ',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <CToast
        autohide={true}
        visible={true}
        color="success"
        delay={3000}
        className="text-white align-items-center"
        onClose={onClose}
      >
        <div className="d-flex border">
          <CToastBody>{text}</CToastBody>
          <CToastClose className="me-2 m-auto" white onClick={onClose} />
        </div>
      </CToast>
    </div>
  )
}

export default Toast
