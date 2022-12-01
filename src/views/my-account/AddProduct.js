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
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CSmartTable,
  CLoadingButton,
  CCollapse,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import { cilDelete } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

class AddProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buttonToggle: 'save',
      loadData: [],
      loding: false,
      visible: false,
      showModal: false,
    }
  }

  componentDidMount() {
    this.getRequestFormData()
  }

  handleInput = (e) => {
    const name = e.target.name
    this.setState({ [name]: e.target.value })
  }

  requestProductHandler = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const addData = {
      ptitle: this.state.ptitle,
      pupc: this.state.pupc,
      psku: this.state.psku,
      pmpn: this.state.pmpn,
      premakrs: this.state.premakrs,
      userId: localStorage.getItem('token2'),
      id: this.state.setId,
    }

    console.log(addData)
    // return false;
    //   console.log(addData);
    //   return false;

    this.setState({ loding: true })

    var insertUrl = `${api}/addUserProduct`

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
        if (result) {
          this.setState({ loding: false })
          this.setState({
            name: '',
            ptitle: '',
            pupc: '',
            psku: '',
            pmpn: '',
            premakrs: '',
            visible: false,
            setId: '',
          })

          this.getRequestFormData()

          //alert('Logeed In');
        } else {
          this.setState({ loding: false })
        }
      })
      .catch((err) => {
        this.setState({ loding: false })
        // $.LoadingOverlay('hide')
        // toastr.error('Error', err.message)

        console.log(err)
      })
  }

  getRequestFormData() {
    const addData = {
      id: localStorage.getItem('token2'),
    }
    console.log(localStorage.getItem('token2'))
    var insertUrl = `${api}/getUserProducts`
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
        if (result) {
          console.log(result)

          this.setState({ loadData: result })

          //alert('Logeed In');
        } else {
          this.setState({ loadData: [] })
        }
      })
      .catch((err) => {
        // $.LoadingOverlay('hide')
        // toastr.error('Error', err.message)
        console.log('111')
        console.log(err)
      })
  }

  ShowAddressForm = () => {
    this.setState({
      visible: true,
      name: '',
      ptitle: '',
      pupc: '',
      psku: '',
      pmpn: '',
      premakrs: '',
      colour: '',
      size: '',
      orderDetails: '',
      setId: '',
      buttonToggle: 'save',
    })
  }

  close = () => {
    this.setState({
      visible: false,
      ptitle: '',
      pupc: '',
      psku: '',
      pmpn: '',
      premakrs: '',
      colour: '',
      size: '',
      orderDetails: '',
      setId: '',
      buttonToggle: 'save',
    })
  }

  editProduct = (index) => {
    console.log(index)
    this.setState({
      visible: true,

      ptitle: index.Title,
      pupc: index.Upc,
      pmpn: index.Mpn,
      psku: index.Sku,
      premakrs: index.Remarks,

      setId: index.id,
      buttonToggle: 'Edit',
    })
  }

  hideModel = () => {
    this.setState({
      showModal: false,
      getid: '',
    })
  }

  showDeleteAlert = (index) => {
    console.log(index)
    console.log(index)

    this.setState({
      showModal: true,
      setId: index.id,
    })
  }

  deleteProduct = () => {
    const addData = {
      id: this.state.setId,
    }

    var insertUrl = `${api}/deleteProduct`
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
        if (result.status) {
          this.setState({
            loding: false,
            showModal: false,
            visible: false,
            ptitle: '',
            pupc: '',
            pmpn: '',
            psku: '',
            premakrs: '',
            colour: '',
            size: '',
            orderDetails: '',
            setId: '',
          })

          this.getRequestFormData()
        } else {
          this.getRequestFormData()
        }
      })
      .catch((err) => {
        this.setState({ loding: false })
        console.log('network error')
        console.log(err)
      })
  }

  render() {
    const launchModel = () => {
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

    return (
      <CRow>
        <CCol xs={12}>
          <CCollapse visible={this.state.visible}>
            <CCard className="mb-4">
              <CCardHeader>
                {launchModel()}
                <strong>Add Product</strong>
                <CButton
                  className="px-4 float-end btn-close"
                  aria-label="Close"
                  color="dark"
                  onClick={this.close}
                ></CButton>
              </CCardHeader>
              <CCardBody>
                <CForm onSubmit={this.requestProductHandler}>
                  <CRow>
                    <CCol md={3}>
                      <CFormInput
                        type="hidden"
                        name="setId"
                        value={this.state.setId}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                      />
                      <CFormLabel htmlFor="exampleFormControlInput1">Item Description*</CFormLabel>
                      <CFormInput
                        type="text"
                        name="ptitle"
                        value={this.state.ptitle}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Item Description"
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">UPC</CFormLabel>
                      <CFormInput
                        type="number"
                        name="pupc"
                        value={this.state.pupc}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Upc"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">SKU</CFormLabel>
                      <CFormInput
                        type="number"
                        name="psku"
                        value={this.state.psku}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="psku"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">MNP</CFormLabel>
                      <CFormInput
                        type="text"
                        name="pmpn"
                        value={this.state.pmpn}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Mpn"
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Remarks</CFormLabel>
                      <CFormInput
                        type="text"
                        name="premakrs"
                        value={this.state.premakrs}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Remarks"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CLoadingButton
                        style={{ marginTop: '35px' }}
                        color="primary"
                        type="submit"
                        loading={this.state.loding}
                        className="px-4"
                      >
                        {this.state.buttonToggle == 'save' ? 'Save' : 'Update'}
                      </CLoadingButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCollapse>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Product</strong>
              <CButton className="px-4 float-end" color="dark" onClick={this.ShowAddressForm}>
                Add Product
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CSmartTable
                items={this.state.loadData}
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
                  'Title',
                  'Mpn',
                  'Upc',
                  'Sku',
                  'Remarks',

                  'User_qty',
                  'Received_qty',
                  'Shipped_qty',
                  // {
                  //     key: 'show_details',
                  //     label: '',
                  //     _style: { width: '1%' },
                  //     filter: false,
                  //     sorter: false,
                  // },
                  // {
                  //     key: 'ProductName',
                  //     label: 'Product Name',
                  //     _style: { width: '1%' },
                  //     // filter: false,
                  //     // sorter: false,
                  // },

                  // 'Color',
                  // {
                  //   key: 'Price',
                  //   label: 'Price',
                  //   _style: { width: '1%' },
                  //   // filter: false,
                  //   // sorter: false,
                  // },
                  // 'pmpn',
                  // 'Size',
                  // 'OrderDetails'
                ]}
                itemsPerPage={20}
                columnFilter
                columnSorter
                pagination
                scopedColumns={{
                  // ProductName: (items) => {
                  //     return (
                  //       <td className="py-2">

                  //           <a rel="noreferrer" target="_blank" href={'//'+items.product_url}>{items.ProductName}</a>
                  //       </td>
                  //     )
                  // },
                  // Price: (items) => {
                  //   return (
                  //     <td className="py-2 text-center">

                  //         ${items.Price}
                  //     </td>
                  //   )
                  // },

                  delete: (items) => {
                    return (
                      <td className="py-2">
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
                            this.editProduct(items)
                          }}
                        >
                          Edit
                        </CButton>
                      </td>
                    )
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }
}
export default AddProduct
