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

const id = localStorage.getItem('token2')

function UpdateFnskuLabel({ updateFnskuModal, setUpdateFnskuModal, singleItem }) {
  const [data, setData] = useState({
    qty: singleItem.qty,
    fnsku_title: singleItem.title,
    fnsku: singleItem.fnsku,
    receipt_dt_id: singleItem.dt_id,
    user_id: id,
  })
  const [loading, setLoading] = useState(false)
  console.log('singleItem', singleItem.title, singleItem.fnsku, singleItem.qty)
  let [statusText, setStatusText] = useState('')

  let updateReceiptStatus = `${api}/updateFnsku`

  const handleFnsku = () => {
    console.log('dataaaaaaaaa', data)
    if (data.fnsku.length < 10) {
      setStatusText('FNSKU can not be less than 10 characters')
      return
    }
    try {
      const formData = new FormData()

      formData.append('user_id', id)
      formData.append('receipt_dt_id', data.receipt_dt_id)
      formData.append('qty', data.qty)
      formData.append('fnsku_title', data.fnsku_title)
      formData.append('fnsku', data.fnsku)

      setLoading(true)

      new Promise(function (resolve, reject) {
        $.ajax({
          url: updateReceiptStatus,
          type: 'POST',
          data: formData,
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
            setData({
              qty: singleItem.qty,
              fnsku_title: singleItem.title,
              fnsku: singleItem.fnsku,
              receipt_dt_id: singleItem.dt_id,
              user_id: id,
            })
            setStatusText(JSON.parse(result).message)
            setLoading(false)

            setTimeout(function () {
              setStatusText(result.message)
              setUpdateFnskuModal(false)
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
        visible={updateFnskuModal}
        onClose={() => {
          setUpdateFnskuModal(false)
          setData({
            qty: singleItem.qty,
            fnsku_title: singleItem.title,
            fnsku: singleItem.fnsku,
            receipt_dt_id: singleItem.dt_id,
            user_id: id,
          })
        }}
      >
        <CModalHeader>
          <CModalTitle>Edit Fnsku</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="exampleFormControlInput1">FNSKU Barcode</CFormLabel>
              <CFormInput
                type="text"
                name="fnsku"
                value={data.fnsku}
                onChange={(e) => setData((prevState) => ({ ...prevState, fnsku: e.target.value }))}
                id="exampleFormControlInput1"
                placeholder="Fnsku"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol>
              <CFormLabel htmlFor="exampleFormControlInput1">FNSKU Description</CFormLabel>
              <CFormInput
                type="text"
                name="fnsku_title"
                value={data.fnsku_title}
                onChange={(e) =>
                  setData((prevState) => ({ ...prevState, fnsku_title: e.target.value }))
                }
                id="exampleFormControlInput1"
                placeholder="Title"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol>
              <CFormLabel htmlFor="exampleFormControlInput1">Quantity</CFormLabel>
              <CFormInput
                type="number"
                name="qty"
                value={data.qty}
                onChange={(e) => setData((prevState) => ({ ...prevState, qty: e.target.value }))}
                id="exampleFormControlInput1"
                placeholder="Quantity"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdateFnskuModal(false)}>
            Close
          </CButton>
          <CLoadingButton
            style={{ marginLeft: '15px' }}
            color="primary"
            type="submit"
            loading={loading}
            className="px-4"
            onClick={() => handleFnsku()}
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

export default UpdateFnskuLabel
