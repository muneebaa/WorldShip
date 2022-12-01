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

function DimensionModal({ dimensionModal, setDimensionModal, dimensionReceiptId }) {
  const [weight, setWeight] = useState('')
  const [loading, setLoading] = useState(false)
  const [dimensions, setDimensions] = useState({
    length: '',
    height: '',
    width: '',
  })
  let [statusText, setStatusText] = useState('')

  let updateReceiptStatus = `${api}/updateReceiptStatus`

  const handleDimensions = () => {
    if (!weight || !dimensions.length || !dimensions.height || !dimensions.width) {
      setStatusText('Please fill all the fields')
      return
    }
    try {
      const data = new FormData()

      data.append('user_id', id)
      data.append('receipt_id', dimensionReceiptId)
      data.append('dimension', `${dimensions.length}x${dimensions.width}x${dimensions.height}`)
      data.append('weight', weight)
      setLoading(true)
      new Promise(function (resolve, reject) {
        $.ajax({
          url: updateReceiptStatus,
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
            setWeight('')
            setDimensions({
              length: '',
              height: '',
              width: '',
            })
            setStatusText(JSON.parse(result).message)
            setLoading(false)
            setTimeout(function () {
              setStatusText(result.message)
              setDimensionModal(false)
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
        visible={dimensionModal}
        onClose={() => {
          setDimensionModal(false)
          setDimensions({
            length: '',
            height: '',
            width: '',
          })
          setWeight('')
        }}
      >
        <CModalHeader>
          <CModalTitle>Dimensions</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="exampleFormControlInput1">Dimensions*</CFormLabel>
              <br />
              <CRow>
                <CCol>
                  <CFormInput
                    type="number"
                    name="dimension"
                    value={dimensions.length}
                    onChange={(e) =>
                      setDimensions((prevState) => ({ ...prevState, length: e.target.value }))
                    }
                    id="exampleFormControlInput1"
                    placeholder="L"
                  />
                </CCol>
                x
                <CCol>
                  <CFormInput
                    type="number"
                    name="dimension"
                    value={dimensions.width}
                    onChange={(e) =>
                      setDimensions((prevState) => ({ ...prevState, width: e.target.value }))
                    }
                    id="exampleFormControlInput1"
                    placeholder="W"
                  />
                </CCol>
                x
                <CCol>
                  <CFormInput
                    type="number"
                    name="dimension"
                    value={dimensions.height}
                    onChange={(e) =>
                      setDimensions((prevState) => ({ ...prevState, height: e.target.value }))
                    }
                    id="exampleFormControlInput1"
                    placeholder="H"
                  />
                </CCol>
              </CRow>
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol>
              <CFormLabel htmlFor="exampleFormControlInput1">Weight*(ounce)</CFormLabel>
              <CFormInput
                type="number"
                name="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                id="exampleFormControlInput1"
                placeholder="Weight(ounce)"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDimensionModal(false)}>
            Close
          </CButton>

          <CLoadingButton
            style={{ marginLeft: '15px' }}
            color="primary"
            type="submit"
            loading={loading}
            className="px-4"
            onClick={() => handleDimensions()}
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

export default DimensionModal
