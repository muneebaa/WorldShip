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
  CLoadingButton,
} from '@coreui/react-pro'
import * as $ from 'jquery'

function LabelModal({ fbaModal, setFbaModal, labelsId }) {
  const [fba_label, setFba_label] = useState('')
  const [loading, setLoading] = useState(false)
  let [statusText, setStatusText] = useState()

  let updateReceiptLabels = `${api}/updateReceiptLabels`

  const handleLabel = () => {
    if (!fba_label) {
      setStatusText('Please fill all the fields')
      return
    }
    try {
      const data = new FormData()
      data.append('fba_label', fba_label)
      data.append('receipt_id', labelsId)
      setLoading(true)

      new Promise(function (resolve, reject) {
        $.ajax({
          url: updateReceiptLabels,
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
            console.log('Data updated Successfully')
            setFba_label('')
            setStatusText(JSON.parse(result).message)
            setLoading(false)

            setTimeout(function () {
              setStatusText(result.message)

              setFbaModal(false)
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
      <CModal
        visible={fbaModal}
        onClose={() => {
          setFba_label('')
          setFbaModal(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>FBA Label</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="exampleFormControlInput1">FBA Label*</CFormLabel>
              <CFormInput
                type="file"
                name="fba"
                onChange={(e) => setFba_label(e.target.files[0])}
                id="exampleFormControlInput1"
                placeholder="Weight"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setFbaModal(false)}>
            Close
          </CButton>
          <CLoadingButton
            style={{ marginLeft: '15px' }}
            color="primary"
            type="submit"
            loading={loading}
            className="px-4"
            onClick={() => handleLabel()}
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

export default LabelModal
