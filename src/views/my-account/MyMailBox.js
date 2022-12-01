import React, { Component, useState, useEffect } from 'react'
import * as $ from 'jquery'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css' // This only needs to be imported once in your app
import { api } from './constants'

import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCardTitle,
  CCardText,
  CCardFooter,
  CFormCheck,
  CListGroup,
  CListGroupItem,
  CRow,
  CImage,
  CCardLink,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormTextarea,
  CSmartTable,
  CLoadingButton,
  CCollapse,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButtonGroup,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown, cilCamera, cilTrash, cilSettings } from '@coreui/icons'

const getBadge = (status, param) => {
  //console.log(status,param)

  if (status == '1' && param == 'insPack') return 'success'
  else if (status == '1' && param == 'addPhoto') return 'danger'
  else if (status == '1' && param == 'rePack') return 'warning'
  else if (status == '1' && param == 'trash') return 'secondary'
  else if (status == '1' && param == 'return') return 'dark'
  else return null
}

export class HellBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      photoIndex: 0,
      isOpen: false,
    }
  }

  render() {
    const { photoIndex, isOpen } = this.state

    return (
      <div>
        <CImage
          rounded
          thumbnail
          src={this.props.imageData[0]}
          width={100}
          height={80}
          onClick={() => this.setState({ isOpen: true })}
        />

        {isOpen && (
          <Lightbox
            mainSrc={this.props.imageData[photoIndex]}
            nextSrc={this.props.imageData[(photoIndex + 1) % this.props.imageData.length]}
            prevSrc={
              this.props.imageData[
                (photoIndex + this.props.imageData.length - 1) % this.props.imageData.length
              ]
            }
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex:
                  (photoIndex + this.props.imageData.length - 1) % this.props.imageData.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % this.props.imageData.length,
              })
            }
          />
        )}
      </div>
    )
  }
}

class MyMailBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadData: [],
      loadInspecServic: [],
      selected: [],
      showModal: false,
      showModelTitile: '',
      setShipmentId: '',
      setShipmentColumn: '',
    }

    //this.handleInput = this.handleInput.bind(this)
  }

  componentDidMount() {
    this.getShipmentData()
    //this.getInspectionServices();
  }
  getShipmentData() {
    const addData = {
      id: localStorage.getItem('token2'),
    }

    var insertUrl = `${api}/mymailbox`
    // this.state.baseUrl +
    // '/laptopzone/reactcontroller/c_haziqreact/copy_seed'
    new Promise(function (resolve, reject) {
      $.ajax({
        url: insertUrl,
        dataType: 'json',
        type: 'POST',
        data: addData,
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
        //console.log(result)
        console.log('geting images data')
        //console.log(result)
        this.setState({ loadData: result })
      })
      .catch((err) => {
        // $.LoadingOverlay('hide')
        // toastr.error('Error', err.message)
        console.log('111')
        console.log(err)
      })
  }

  handleInput = (e) => {
    const name = e.target.name
    this.setState({ [name]: e.target.value })
  }
  sercicesAction = (columnName) => {
    const userData = {
      serviceRemarks: this.state.serviceRemarks,
      setShipmentId: this.state.setShipmentId,
      setShipmentColumn: this.state.setShipmentColumn,
    }
    if (userData.serviceRemarks) {
      var insertUrl = `{ api }/inspectShipmentRequest`
      new Promise(function (resolve, reject) {
        $.ajax({
          url: insertUrl,
          dataType: 'json',
          type: 'POST',
          data: userData,
        }).then(
          function (userData) {
            resolve(userData)
          },
          function (err) {
            reject(err)
          },
        )
      })
        .then((result) => {
          console.log(result)
          this.getShipmentData()
          this.setState({ showModal: false })

          // console.log('geting loadInspecServic data')
          // console.log(result)
        })
        .catch((err) => {
          // $.LoadingOverlay('hide')
          // toastr.error('Error', err.message)
          console.log('111')
          console.log(err)
        })
    } else {
      alert('Please Enter Remarks')
    }
  }
  check = (e, id) => {
    if (e.target.checked) {
      this.setState({ selected: [...this.state.selected, id] })
    } else {
      this.setState({ selected: this.state.selected.filter((itemId) => itemId !== id) })
    }
  }
  addServices = (service, titile, shipmentId) => {
    //console.log(serice,titile,shipmentId)
    this.setState({
      showModal: true,
      showModelTitile: titile,
      serviceRemarks: '',
      setShipmentId: shipmentId,
      setShipmentColumn: service,
    })
  }
  hideModel = () => {
    this.setState({
      showModal: false,
      getid: '',
    })
  }

  handleInput = (e) => {
    const name = e.target.name
    this.setState({ [name]: e.target.value })
  }

  render() {
    const launchModel = () => {
      return (
        <>
          <CModal visible={this.state.showModal} onClose={() => this.hideModel()}>
            <CModalHeader>
              <CModalTitle>{this.state.showModelTitile}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CCol>
                <CFormLabel htmlFor="exampleFormControlInput1">Add Remarks</CFormLabel>
                <CFormTextarea
                  name="serviceRemarks"
                  value={this.state.serviceRemarks}
                  onChange={this.handleInput}
                  id="Notes"
                  rows="3"
                ></CFormTextarea>
              </CCol>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => this.hideModel()}>
                Close
              </CButton>
              <CButton onClick={() => this.sercicesAction()}>Save</CButton>
            </CModalFooter>
          </CModal>
        </>
      )
    }

    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>My Mailbox </strong>
            </CCardHeader>
            <CCardBody>
              {launchModel()}
              <CSmartTable
                items={this.state.loadData}
                columns={[
                  // { key: 'select', label: '', filter: false, sorter: false },
                  { key: 'addServices', label: 'Add Services', filter: false, sorter: false },
                  //'ShipmentId',
                  {
                    key: 'showImage',
                    label: 'Images',
                    _style: { width: '1%' },
                    filter: false,
                    sorter: false,
                  },
                  'ArrivedAt',
                  'weight',
                  { key: 'inspectPkg', label: 'Services', filter: false, sorter: false },
                ]}
                itemsPerPage={5}
                columnFilter
                columnSorter
                pagination
                scopedColumns={{
                  select: (items) => {
                    return (
                      <td>
                        <CFormCheck
                          id={`checkbox${items.ShipmentId}`}
                          checked={items.selected}
                          onChange={(e) => this.check(e, items.ShipmentId)}
                        />
                        <CFormLabel
                          variant="custom-checkbox"
                          htmlFor={`checkbox${items.ShipmentId}`}
                        />
                      </td>
                    )
                  },

                  showImage: (items) => {
                    return (
                      <td className="py-2">
                        <div>
                          <HellBox imageData={items.imagesArray} />
                        </div>
                      </td>
                    )
                  },
                  inspectPkg: (item) => (
                    <td>
                      <div>
                        <CBadge
                          className="text-center"
                          style={{ marginLeft: '5px' }}
                          color={getBadge(item.inspect_pkg, 'insPack')}
                        >
                          Inspect Packages
                        </CBadge>
                        <CBadge
                          className="text-center"
                          style={{ marginLeft: '5px' }}
                          color={getBadge(item.additional_pix, 'addPhoto')}
                        >
                          Additional Photos
                        </CBadge>
                      </div>
                      <CBadge
                        className="text-center"
                        style={{ marginLeft: '5px' }}
                        color={getBadge(item.repack, 'rePack')}
                      >
                        Repack
                      </CBadge>
                      <CBadge
                        className="text-center"
                        style={{ marginLeft: '5px' }}
                        color={getBadge(item.trash, 'trash')}
                      >
                        Trash
                      </CBadge>
                      <CBadge
                        className="text-center"
                        style={{ marginLeft: '5px' }}
                        color={getBadge(item.return, 'return')}
                      >
                        Return
                      </CBadge>
                    </td>
                  ),
                  addServices: (items) => (
                    <td>
                      <CButtonGroup role="group" aria-label="Basic mixed styles example">
                        <CButton
                          title="Add Inspection Service"
                          onClick={() => {
                            this.addServices(
                              'inspect_pkg',
                              'Add Inspection Service',
                              items.ShipmentId,
                            )
                          }}
                          color="danger"
                        >
                          {<CIcon icon={cilSettings} />}
                        </CButton>
                        <CButton
                          title="Request Additional Photos"
                          onClick={() => {
                            this.addServices(
                              'Additional_pix',
                              'Request Additional Photos',
                              items.ShipmentId,
                            )
                          }}
                          color="warning"
                        >
                          {<CIcon icon={cilCamera} />}
                        </CButton>
                        <CButton
                          title="Trash / Dispose Package"
                          onClick={() => {
                            this.addServices('Trash', 'Trash / Dispose Package', items.ShipmentId)
                          }}
                          color="success"
                        >
                          {<CIcon icon={cilTrash} />}
                        </CButton>
                        <CButton
                          title="Return / Send Domestic"
                          onClick={() => {
                            this.addServices(
                              'return_pkg',
                              'Return / Send Domestic',
                              items.ShipmentId,
                            )
                          }}
                          color="dark"
                        >
                          {<CIcon icon={cilDataTransferDown} />}
                        </CButton>
                      </CButtonGroup>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        {/*}
        {this.state.loadData ?
        <CCol xs={12}>
          <CCard xs={6} className="text-center">
            <CCardHeader>Any Special Requests?</CCardHeader>
            <CCardBody>
              {this.state.loadInspecServic.map((itm, index) => (
                <div key={index}>
                <CButton style={{width: "250px"}} onClick={() => {
                  this.sercicesAction(itm.columnName)
                }} key={index} >{itm.service_name}</CButton>

                <CCardText style={{marginLeft: "25px"}}>{itm.description}</CCardText>
                </div>
              ))}
            </CCardBody>
          </CCard>

        </CCol>
              : null }*/}
      </CRow>
    )
  }
}
export default MyMailBox
