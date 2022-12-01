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

function ReceivedModal({ receivedModal, setReceivedModal, trackingNumber }) {
  let receiveReceipts = `${api}/receiveReceipts`
  let [statusText, setStatusText] = useState()

  const [loading, setLoading] = useState(false)
  const handleReceivedStatus = () => {
    try {
      const data = new FormData()
      setLoading(true)

      data.append('user_id', id)
      data.append('tracking_number', trackingNumber)
      new Promise(function (resolve, reject) {
        $.ajax({
          url: receiveReceipts,
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
              setReceivedModal(false)
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
      <CModal visible={receivedModal} onClose={() => setReceivedModal(false)}>
        <CModalHeader>
          <CModalTitle>Update Status</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want mark receipt status as received?</CModalBody>
        <CModalFooter>
          <br />
          <CButton color="secondary" onClick={() => setReceivedModal(false)}>
            Close
          </CButton>

          <CLoadingButton
            style={{ marginLeft: '15px' }}
            color="primary"
            type="submit"
            loading={loading}
            className="px-4"
            onClick={() => handleReceivedStatus()}
            disabled={loading}
          >
            Update
          </CLoadingButton>
        </CModalFooter>
        <p style={{ display: 'block', color: 'green', marginLeft: '1em' }}>{statusText}</p>
      </CModal>
    </div>
  )
}

export default ReceivedModal
