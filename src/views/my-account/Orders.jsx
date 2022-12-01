import React, { useState, useEffect } from 'react'
import * as $ from 'jquery'
import { api } from './constants'

import {
  CCard,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CButton,
  CModalFooter,
  CCollapse,
  CForm,
  CFormInput,
  CFormLabel,
  CLoadingButton,
  CTooltip,
  CSmartTable,
} from '@coreui/react-pro'
import { CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDelete } from '@coreui/icons'
let today = new Date()
const dd = String(today.getDate()).padStart(2, '0')
const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
const yyyy = today.getFullYear()

today = `${mm}/${dd}/${yyyy}`

const id = localStorage.getItem('token2')
const user = JSON.parse(localStorage.getItem('user'))
let is_admin = Number(user.user_id[0].is_admin)
console.log(window.location.protocol)

const launchModal = () => {
  return (
    <>
      <CModal visible={this.state.showModal} onClose={() => this.hideModel()}>
        <CModalHeader>
          <CModalTitle>Delete Product</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this Product?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => this.hideModel()}>
            Close
          </CButton>
          <CButton color="danger" onClick={() => this.deleteProduct()}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const Orders = () => {
  const [allOrders, setAllOrders] = useState()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [buttonToggle, setButtonToggle] = useState('save')

  const handleDelete = (order) => {
    const nonDeletedItem = allOrders.filter((item) => item.id !== order.id)
    localStorage.setItem('orders', JSON.stringify(nonDeletedItem))
    setAllOrders(nonDeletedItem)
    alert('Order Deleted')
  }
  var insertUrl = `${api}/getUserOrders`

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = new FormData()
        data.append('user_id', id)

        new Promise(function (resolve, reject) {
          $.ajax({
            url: insertUrl,
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
              setAllOrders(JSON.parse(result))
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
  }, [])
  return (
    <>
      <h2>All Orders</h2>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Product</strong>
            </CCardHeader>
            <CCardBody>
              <CSmartTable
                items={allOrders}
                columns={
                  is_admin
                    ? [
                        {
                          key: 'delete',
                          label: '',
                          _style: { width: '1%' },
                          filter: false,
                          sorter: false,
                        },
                        {
                          key: 'show_details',
                          label: '',
                          _style: { width: '1%' },
                          filter: false,
                          sorter: false,
                        },
                        {
                          key: 'Label_path',
                          label: '',
                          _style: { width: '1%' },
                          filter: false,
                          sorter: false,
                        },
                        'First_name',
                        'Last_name',
                        'City',
                        'State',
                        'Order_date',
                        'Order_status',
                        'Shipping_service',
                        'Remarks',
                        'Tracking_no',
                        'Buyer_msg',
                      ]
                    : [
                        {
                          key: 'delete',
                          label: '',
                          _style: { width: '1%' },
                          filter: false,
                          sorter: false,
                        },
                        {
                          key: 'show_details',
                          label: '',
                          _style: { width: '1%' },
                          filter: false,
                          sorter: false,
                        },
                        'First_name',
                        'Last_name',
                        'City',
                        'State',
                        'Order_date',
                        'Order_status',
                        'Shipping_service',
                        'Remarks',
                        'Tracking_no',
                        'Buyer_msg',
                      ]
                }
                itemsPerPage={20}
                columnFilter
                columnSorter
                pagination
                scopedColumns={{
                  delete: (items) => {
                    return (
                      <td className="py-2">
                        <CButton
                          color="danger"
                          shape="square"
                          size="sm"
                          onClick={() => {
                            console.log(items)
                          }}
                        >
                          <CIcon icon={cilDelete} className="me-2 " />
                        </CButton>
                      </td>
                    )
                  },
                  show_details: (items) => {
                    return (
                      <td className="py-2">
                        <CButton
                          color="dark"
                          shape="square"
                          size="sm"
                          onClick={() => {
                            console.log(items)
                          }}
                        >
                          Edit
                        </CButton>
                      </td>
                    )
                  },
                  Label_path: (items) => {
                    return (
                      <td className="py-2">
                        {' '}
                        {items.Label_path && (
                          <CTooltip content="Print Label">
                            <CButton
                              color="success"
                              shape="square"
                              size="sm"
                              onClick={() => {
                                items.Label_path && window.open(items.Label_path, '_blank')
                              }}
                            >
                              Print
                            </CButton>
                          </CTooltip>
                        )}{' '}
                      </td>
                    )
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Orders
