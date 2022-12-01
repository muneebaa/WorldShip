import React, { useState } from 'react'
import { api } from '../../constants'

import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CButton,
  CModalFooter,
  CCol,
  CFormLabel,
  CFormInput,
  CRow,
} from '@coreui/react-pro'
import * as $ from 'jquery'

const id = localStorage.getItem('token2')

function WhatsAppModal({ whatsappModal, setWhatsappModal, selectedUserId }) {
  let updateWhatsappNumber = `${api}/updateWhatsappNumber`
  let [statusText, setStatusText] = useState()
  let [number, setNumber] = useState()

  const handleShippedStatus = () => {
    try {
      const data = new FormData()
      data.append('user_id', selectedUserId)
      data.append('whatsapp_number', number)

      new Promise(function (resolve, reject) {
        $.ajax({
          url: updateWhatsappNumber,
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
            setTimeout(function () {
              setStatusText(result.message)
              setWhatsappModal(false)
            }, 4000)
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
      <CModal
        visible={whatsappModal}
        onClose={() => {
          setWhatsappModal(false)
          setNumber('')
        }}
      >
        <CModalHeader>
          <CModalTitle>Update Number</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="exampleFormControlInput1">Whatsapp Number*</CFormLabel>
              <CFormInput
                type="text"
                name="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                id="exampleFormControlInput1"
                placeholder="Whatsapp Number"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setWhatsappModal(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => handleShippedStatus()}>
            Yes, Update
          </CButton>
        </CModalFooter>
        <p style={{ display: 'block', color: 'green', marginLeft: '1em' }}>{statusText}</p>
      </CModal>
    </div>
  )
}

export default WhatsAppModal
