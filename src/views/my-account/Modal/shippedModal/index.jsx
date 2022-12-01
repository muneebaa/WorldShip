import React, { useState } from 'react'
import { api } from '../../constants'

import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CButton,
  CModalFooter,
  CLoadingButton,
} from '@coreui/react-pro'
import * as $ from 'jquery'

const id = localStorage.getItem('token2')

function ShippedModal({ shippedModal, setShippedModal, shippedId }) {
  let markReceiptStatus = `${api}/markReceiptStatus`
  const [loading, setLoading] = useState(false)
  let [statusText, setStatusText] = useState()

  const handleShippedStatus = () => {
    try {
      const data = new FormData()
      data.append('user_id', id)
      data.append('receipt_id', shippedId)
      setLoading(true)

      new Promise(function (resolve, reject) {
        $.ajax({
          url: markReceiptStatus,
          type: 'POST',
          data: data,
          processData: false,
          contentType: false,
        }).then(
          function (addData) {
            resolve(addData)
          },
          function (err) {
            reject(err)
          },
        )
      })
        .then((result) => {
          if (result) {
            setStatusText(JSON.parse(result).message)
            setLoading(false)
            setTimeout(function () {
              setStatusText(result.message)
              setShippedModal(false)
            }, 1000)
          } else {
            console.log('Some thing Wrong')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <CModal visible={shippedModal} onClose={() => setShippedModal(false)}>
        <CModalHeader>
          <CModalTitle>Update Status</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want mark receipt status as shipped?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShippedModal(false)}>
            Close
          </CButton>
          <CLoadingButton
            style={{ marginLeft: '15px' }}
            color="primary"
            type="submit"
            loading={loading}
            className="px-4"
            onClick={() => handleShippedStatus()}
            disabled={loading}
          >
            Yes, Update
          </CLoadingButton>
        </CModalFooter>
        <p style={{ display: 'block', color: 'green', marginLeft: '1em' }}>{statusText}</p>
      </CModal>
    </div>
  )
}

export default ShippedModal
