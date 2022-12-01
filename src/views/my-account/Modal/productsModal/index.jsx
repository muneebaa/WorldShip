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
  CLoadingButton,
} from '@coreui/react-pro'
import * as $ from 'jquery'
import './style.css'

const id = localStorage.getItem('token2')

function ProductsModal({ productsModal, setProductsModal, productTrackingNumber }) {
  const [products, setProducts] = useState()
  let [statusText, setStatusText] = useState()
  const [loading, setLoading] = useState(false)

  let getUserReceipts = `${api}/getReceipt`
  let updateProductStatus = `${api}/updateProductStatus`

  const handleReceivedClick = (e, items) => {
    console.log('items---', items)
    console.log('eee---', e)
    try {
      const data = new FormData()
      data.append('receipt_dt_id', items.dt_id)
      data.append('user_id', id)
      setLoading(true)
      new Promise(function (resolve, reject) {
        $.ajax({
          url: updateProductStatus,
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
            }, 1000)
            if (e.target.className === 'btn btn-primary btn-sm square') {
              e.target.className = 'btn btn-success btn-sm square'
            }
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

  useEffect(() => {
    if (productsModal) {
      console.log(productsModal === true)
      const fetchData = async () => {
        try {
          const data = new FormData()
          data.append('tracking_number', productTrackingNumber)
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
  }, [productsModal])

  return (
    <div>
      <CModal
        alignment="center"
        visible={productsModal}
        size="xl"
        scrollable
        onClose={() => setProductsModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Receipt Detail</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
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
          </div>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Product</strong>
              </CCardHeader>
              <CCardBody>
                <CSmartTable
                  items={products?.Products}
                  columns={[
                    {
                      key: 'update_receipt_status',
                      label: '',
                      _style: { width: '1%' },
                      filter: false,
                      sorter: false,
                    },

                    'title',
                    'qty',
                    'status',
                  ]}
                  itemsPerPage={5}
                  columnFilter
                  columnSorter
                  pagination
                  scopedColumns={{
                    update_receipt_status: (items) => {
                      return (
                        <td className="py-2">
                          <CTooltip content="Set Status to Received">
                            {/* <CButton
                              color={items.status === 'Received' ? 'success' : 'primary'}
                              shape="square"
                              size="sm"
                              onClick={(e) => {
                                handleReceivedClick(e, items)
                              }}
                            >
                              Received
                            </CButton> */}
                            <CLoadingButton
                              style={{ marginLeft: '15px' }}
                              color={items.status === 'Received' ? 'success' : 'primary'}
                              loading={loading}
                              size="sm"
                              onClick={(e) => handleReceivedClick(e, items)}
                              disabled={loading}
                            >
                              Received
                            </CLoadingButton>
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
          <CButton color="primary" onClick={() => setProductsModal(false)}>
            Close
          </CButton>
        </CModalFooter>
        <p style={{ display: 'block', color: 'green', marginLeft: '1em' }}>{statusText}</p>
      </CModal>
    </div>
  )
}

export default ProductsModal
