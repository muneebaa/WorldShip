import React, { useState, useEffect } from 'react'
import { api } from '../../constants'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CButton,
  CModalFooter,
  CCard,
  CCardHeader,
  CCol,
  CTooltip,
  CSmartTable,
  CCardBody,
} from '@coreui/react-pro'
import * as $ from 'jquery'
import UpdateFnskuLabel from '../updateFnskuModal'
// import './style.css'

const id = localStorage.getItem('token2')

function FnskuModal({ fnskuModal, setFnskuModal, fnskuTrackingNumber, showButtons }) {
  const [products, setProducts] = useState()
  const [updateFnskuModal, setUpdateFnskuModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState({})
  let [statusText, setStatusText] = useState('')

  let getUserReceipts = `${api}/getReceipt`

  const handleReceivedClick = (item) => {
    setSelectedItem(item)
    setUpdateFnskuModal(true)
    console.log(item)
    console.log(selectedItem)
  }

  useEffect(() => {
    console.log('selectedItemmmmmmmmmmmmmm effect', selectedItem?.mpn)
  }, [selectedItem])

  useEffect(() => {
    if (fnskuModal) {
      const fetchData = async () => {
        try {
          const data = new FormData()
          data.append('tracking_number', fnskuTrackingNumber)
          new Promise(function (resolve, reject) {
            $.ajax({
              url: getUserReceipts,
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
                setProducts(JSON.parse(result))
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
      fetchData()
    }
  }, [fnskuModal])

  return (
    <div>
      {updateFnskuModal && (
        <UpdateFnskuLabel
          updateFnskuModal={updateFnskuModal}
          setUpdateFnskuModal={setUpdateFnskuModal}
          singleItem={selectedItem}
        />
      )}

      <CModal
        alignment="center"
        visible={fnskuModal}
        size="xl"
        scrollable
        onClose={() => setFnskuModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Edit FNSKU | {products?.data[0].DESCRIPTION}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* <div>
            {products?.data?.map((item) => (
              <div className="products-data-main" key={item.RECEIPT_ID}>
                <div className="products-data-single">
                  <h6>Description</h6>
                  <p className="data-desc">{item.DESCRIPTION}</p>
                </div>
                <div className="products-data-single">
                  <h6>Remarks</h6>

                  <p className="data-desc">{item.REMARKS}</p>
                </div>
                <div className="products-data-single">
                  <h6>Status</h6>
                  <p className="data-desc">{item.STATUS}</p>
                </div>
                <div className="products-data-single">
                  <h6>Tracking Number</h6>
                  <p className="data-desc"> {item.TRACKING_NUMBER}</p>
                </div>
              </div>
            ))}
          </div> */}
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Product</strong>
              </CCardHeader>
              <CCardBody>
                <CSmartTable
                  items={products?.Products}
                  columns={
                    showButtons
                      ? [
                          {
                            key: 'update_fnsku',
                            label: '',
                            _style: { width: '1%' },
                            filter: false,
                            sorter: false,
                          },

                          'fnsku',
                          'title',
                          'qty',
                        ]
                      : ['title', 'fnsku', 'qty']
                  }
                  itemsPerPage={5}
                  columnFilter
                  columnSorter
                  pagination
                  scopedColumns={{
                    update_fnsku: (items) => {
                      return (
                        <td className="py-2">
                          <CTooltip content="Edit FNSKU">
                            <CButton
                              color="primary"
                              shape="square"
                              size="sm"
                              onClick={() => {
                                handleReceivedClick(items)
                              }}
                            >
                              Edit FNSKU
                            </CButton>
                          </CTooltip>
                        </td>
                      )
                    },
                  }}
                  tableProps={{
                    hover: true,
                    responsive: true,
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => setFnskuModal(false)}>
            Close
          </CButton>
        </CModalFooter>
        <p style={{ display: 'block', color: 'green', marginLeft: '1em' }}>{statusText}</p>
      </CModal>
    </div>
  )
}

export default FnskuModal
