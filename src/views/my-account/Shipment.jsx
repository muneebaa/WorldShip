import React, { useState, useEffect } from 'react'
import * as $ from 'jquery'
import { api } from './constants'

import { CCard, CCardHeader, CCol, CRow, CButton, CSmartTable, CTooltip } from '@coreui/react-pro'
import { CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDelete } from '@coreui/icons'
import { Link } from 'react-router-dom'
import ReceivedModal from './Modal/receivedModal'
import ProductsModal from './Modal/productsModal'
import DimensionModal from './Modal/dimentionsModal'
import ShippedModal from './Modal/shippedModal'
import FbaLabelModal from './Modal/fbaLabel'
// import EditShipmentModal from './Modal/editShipmentModal'
import FnskuModal from './Modal/fnskuModal'
const id = localStorage.getItem('token2')
const user = JSON.parse(localStorage.getItem('user'))
let is_admin = Number(user.user_id[0].is_admin)
console.log('is_admin-----------', !is_admin)

let today = new Date()
const dd = String(today.getDate()).padStart(2, '0')
const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
const yyyy = today.getFullYear()

today = `${mm}/${dd}/${yyyy}`

const Receipt = () => {
  const [allReceipts, setAllReceipts] = useState()
  const [receivedModal, setReceivedModal] = useState(false)
  const [productsModal, setProductsModal] = useState(false)
  const [fbaModal, setFbaModal] = useState(false)
  const [fnskuModal, setFnskuModal] = useState(false)
  const [shippedModal, setShippedModal] = useState(false)
  const [dimensionModal, setDimensionModal] = useState(false)
  // const navigate = useNavigate()

  // const [editShipmentModal, setEditShipmentModal] = useState(false)
  const [allData, setAllData] = useState({
    received_tracking_number: '',
    product_tracking_number: '',
    fnsku_tracking_number: '',
    shipped_id: '',
    label_id: '',
    dimension_id: '',
    editShipment: {},
    showFnskuButton: false,
  })
  let getUserReceipts = `${api}/getUserReceipts`

  const showReceivedModal = (item) => {
    setAllData((prevState) => ({
      ...prevState,
      received_tracking_number: item.Tracking_number,
    }))

    setReceivedModal(true)
  }

  const showDimensionsModal = (item) => {
    setAllData((prevState) => ({
      ...prevState,
      dimension_id: item.Receipt_id,
    }))
    setDimensionModal(true)
  }

  const showShippedModal = (item) => {
    setAllData((prevState) => ({
      ...prevState,
      shipped_id: item.Receipt_id,
    }))
    setShippedModal(true)
  }

  const showFbaModal = (item) => {
    setAllData((prevState) => ({
      ...prevState,
      label_id: item.Receipt_id,
    }))
    setFbaModal(true)
  }

  const showProductModal = (item) => {
    setAllData((prevState) => ({
      ...prevState,
      product_tracking_number: item.Tracking_number,
    }))
    setProductsModal(true)
  }

  const showFnskuModal = (item) => {
    setAllData((prevState) => ({
      ...prevState,
      fnsku_tracking_number: item.Tracking_number,
    }))
    setFnskuModal(true)
  }

  // const showEditShipmentModal = (item) => {
  //   setAllData((prevState) => ({
  //     ...prevState,
  //     editShipment: item,
  //   }))

  //   console.log(allData)
  //   setEditShipmentModal(true)
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = new FormData()
        data.append('user_id', id)
        console.log(id)

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
              setAllReceipts(JSON.parse(result))
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
      <h2>All Shipments</h2>
      <ReceivedModal
        receivedModal={receivedModal}
        setReceivedModal={setReceivedModal}
        trackingNumber={allData.received_tracking_number}
      />
      <ProductsModal
        productsModal={productsModal}
        setProductsModal={setProductsModal}
        productTrackingNumber={allData.product_tracking_number}
      />
      <DimensionModal
        dimensionModal={dimensionModal}
        setDimensionModal={setDimensionModal}
        dimensionReceiptId={allData.dimension_id}
      />
      <ShippedModal
        setShippedModal={setShippedModal}
        shippedModal={shippedModal}
        shippedId={allData.shipped_id}
      />
      <FbaLabelModal fbaModal={fbaModal} setFbaModal={setFbaModal} labelsId={allData.label_id} />
      <FnskuModal
        fnskuModal={fnskuModal}
        setFnskuModal={setFnskuModal}
        fnskuTrackingNumber={allData.fnsku_tracking_number}
        showButtons={allData.showFnskuButton}
      />
      {/* <EditShipmentModal
        editShipmentModal={editShipmentModal}
        setEditShipmentModal={setEditShipmentModal}
        labelsId={allData.label_id}
      /> */}

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Shipment</strong>
            </CCardHeader>
            <CCardBody>
              <CSmartTable
                items={allReceipts}
                columns={[
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
                    key: 'actions',
                    label: 'Actions',
                    _style: { width: '1%' },
                    filter: false,
                    sorter: false,
                  },
                  'Receipt_id',
                  'Client',
                  'Carrier_name',
                  'Description',
                  'Recipt_type',
                  'Remarks',
                  'Status',
                  'Tracking_number',
                  'Weight',
                  'Dimension',
                ]}
                // columns={}
                itemsPerPage={20}
                columnFilter
                columnSorter
                pagination
                scopedColumns={{
                  delete: (items) => {
                    return (
                      <td className="py-2">
                        <CTooltip content="Delete">
                          <CButton
                            color="danger"
                            shape="square"
                            size="sm"
                            onClick={() => {
                              this.showDeleteAlert(items)
                            }}
                          >
                            <CIcon icon={cilDelete} className="me-2 " />
                          </CButton>
                        </CTooltip>
                      </td>
                    )
                  },
                  show_details: (items) => {
                    return (
                      <td className="py-2">
                        <CTooltip content="edit">
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
                        </CTooltip>

                        <br />
                      </td>
                    )
                  },
                  actions: (items) => {
                    return (
                      <td className="py-2">
                        {is_admin ? (
                          <div
                            style={{
                              color: 'red',
                              display: 'flex',
                            }}
                          >
                            {items.Status === 'Received' ||
                            items.Status === 'shipped' ||
                            items.Status === 'Print Label' ||
                            items.Status === 'Awaiting Label' ? null : (
                              <div style={{ margin: '0 .5em' }}>
                                <CTooltip content="set status to received">
                                  <CButton
                                    color="success"
                                    shape="square"
                                    size="sm"
                                    onClick={() => {
                                      showReceivedModal(items)
                                    }}
                                  >
                                    Received
                                  </CButton>
                                </CTooltip>
                              </div>
                            )}
                            {items.Status === 'shipped' ||
                            items.Status === 'Print Label' ||
                            items.Status === 'Awaiting Label' ? null : (
                              <div style={{ margin: '0 .5em' }}>
                                <CTooltip content="product receipt">
                                  <CButton
                                    color="success"
                                    shape="square"
                                    size="sm"
                                    onClick={() => showProductModal(items)}
                                  >
                                    Products
                                  </CButton>
                                </CTooltip>
                              </div>
                            )}
                            {items.Status === 'shipped' || items.Status === 'Print Label' ? null : (
                              <div style={{ margin: '0 .5em' }}>
                                <CTooltip content="enter dimensions">
                                  <CButton
                                    color="success"
                                    shape="square"
                                    size="sm"
                                    onClick={() => showDimensionsModal(items)}
                                  >
                                    Dimensions
                                  </CButton>
                                </CTooltip>
                              </div>
                            )}

                            {items.Status === 'shipped' ? null : items.Fba_label_path ? (
                              <div style={{ margin: '0 .5em' }}>
                                <CTooltip content="Print FBA Label">
                                  <CButton
                                    color="success"
                                    shape="square"
                                    size="sm"
                                    onClick={() =>
                                      items.Fba_label_path &&
                                      window.open(items.Fba_label_path, '_blank')
                                    }
                                  >
                                    FBA
                                  </CButton>
                                </CTooltip>
                              </div>
                            ) : null}
                            {items.Status === 'shipped' ? null : items.Fsnku_Path ? (
                              <div style={{ margin: '0 .5em' }}>
                                <CTooltip content="Show FNSKU">
                                  <Link to={`ShipmentFnsku/${items.Receipt_id}`}>
                                    <CButton
                                      color="success"
                                      shape="square"
                                      size="sm"
                                      onClick={() => {
                                        // setAllData((prevState) => ({
                                        //   ...prevState,
                                        //   showFnskuButton: false,
                                        // }))
                                        // showFnskuModal(items)
                                        // navigate(items.Receipt_id)
                                      }}
                                    >
                                      FNSKU
                                    </CButton>
                                  </Link>
                                </CTooltip>
                              </div>
                            ) : null}
                            {items.Status === 'shipped' ? null : (
                              <div style={{ margin: '0 .5em' }}>
                                <CTooltip content="set status to shipped">
                                  <CButton
                                    color="success"
                                    shape="square"
                                    size="sm"
                                    onClick={() => showShippedModal(items)}
                                  >
                                    Shipped
                                  </CButton>
                                </CTooltip>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex' }}>
                            {items.Status === 'shipped' ? null : (
                              <div style={{ margin: '0 .5em' }}>
                                <CTooltip content="set label">
                                  <CButton
                                    color="success"
                                    shape="square"
                                    size="sm"
                                    onClick={() => showFbaModal(items)}
                                  >
                                    FBA
                                  </CButton>
                                </CTooltip>
                              </div>
                            )}

                            {items.Status === 'shipped' ? null : (
                              <div style={{ margin: '0 .5em' }}>
                                <CTooltip content="set label">
                                  <CButton
                                    color="success"
                                    shape="square"
                                    size="sm"
                                    onClick={() => {
                                      setAllData((prevState) => ({
                                        ...prevState,
                                        showFnskuButton: true,
                                      }))
                                      showFnskuModal(items)
                                    }}
                                  >
                                    FNSKU
                                  </CButton>
                                </CTooltip>
                              </div>
                            )}
                          </div>
                        )}
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
      </CRow>
    </>
  )
}

export default Receipt
