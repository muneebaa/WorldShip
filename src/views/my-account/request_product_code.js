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
} from '@coreui/react-pro'
import { cilDelete } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

class Handler extends Component {
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
      pname: this.state.pname,
      purl: this.state.purl,
      uprice: this.state.uprice,
      quantity: this.state.quantity,
      colour: this.state.colour,
      size: this.state.size,
      orderDetails: this.state.orderDetails,
      userId: localStorage.getItem('token2'),
      id: this.state.setId,
    }
    //   console.log(addData);
    //   return false;

    this.setState({ loding: true })

    var insertUrl = `${api}/requestProduct`

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
            pname: '',
            purl: '',
            uprice: '',
            quantity: '',
            colour: '',
            size: '',
            orderDetails: '',
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
    var insertUrl = `${api}/getRequestProducts`
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
      pname: '',
      purl: '',
      uprice: '',
      quantity: '',
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
      pname: '',
      purl: '',
      uprice: '',
      quantity: '',
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

      pname: index.ProductName,
      purl: index.product_url,
      uprice: index.Price,
      quantity: index.Quantity,
      colour: index.Color,
      size: index.Size,
      orderDetails: index.OrderDetails,
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
            pname: '',
            purl: '',
            uprice: '',
            quantity: '',
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
                <strong>Request Form</strong>
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
                    <CCol md={6}>
                      <CFormInput
                        type="hidden"
                        name="setId"
                        value={this.state.setId}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                      />
                      <CFormLabel htmlFor="exampleFormControlInput1">Product Name*</CFormLabel>
                      <CFormInput
                        type="text"
                        name="pname"
                        value={this.state.pname}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Product Name"
                        required
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Product Url*</CFormLabel>
                      <CFormInput
                        type="text"
                        name="purl"
                        value={this.state.purl}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Product Url"
                        required
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Unit Price (USD)*</CFormLabel>
                      <CFormInput
                        type="number"
                        name="uprice"
                        value={this.state.uprice}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Price"
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Quantity*</CFormLabel>
                      <CFormInput
                        type="number"
                        name="quantity"
                        value={this.state.quantity}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Quantity"
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Color</CFormLabel>
                      <CFormInput
                        type="text"
                        name="colour"
                        value={this.state.colour}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Color"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Size</CFormLabel>
                      <CFormInput
                        type="text"
                        name="size"
                        value={this.state.size}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Length * Width * Height"
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6}>
                      <CFormLabel htmlFor="exampleFormControlInput1">
                        Additional Order Details
                      </CFormLabel>
                      <CFormTextarea
                        name="orderDetails"
                        value={this.state.orderDetails}
                        onChange={this.handleInput}
                        id="orderDetails"
                        placeholder="Additional Details"
                        rows="2"
                      ></CFormTextarea>
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
              <strong>Request Product</strong>
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
                  {
                    key: 'ProductName',
                    label: 'Product Name',
                    _style: { width: '1%' },
                    // filter: false,
                    // sorter: false,
                  },

                  'Color',
                  {
                    key: 'Price',
                    label: 'Price',
                    _style: { width: '1%' },
                    // filter: false,
                    // sorter: false,
                  },
                  'Quantity',
                  'Size',
                  'OrderDetails',
                ]}
                itemsPerPage={5}
                columnFilter
                columnSorter
                pagination
                scopedColumns={{
                  ProductName: (items) => {
                    return (
                      <td className="py-2">
                        <a rel="noreferrer" target="_blank" href={'//' + items.product_url}>
                          {items.ProductName}
                        </a>
                      </td>
                    )
                  },
                  Price: (items) => {
                    return <td className="py-2 text-center">${items.Price}</td>
                  },

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
export default Handler
