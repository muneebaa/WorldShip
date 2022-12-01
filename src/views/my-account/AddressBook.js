import React, { Component } from 'react'
import * as $ from 'jquery'
import { api } from './constants'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CListGroup,
  CListGroupItem,
  CRow,
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
import { Alert } from '@coreui/coreui-pro'
//import data from './_data.js'

class AddressBook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadData: [],
      name: '',
      cPerson: '',
      country: '',
      pCode: '',
      city: '',
      state: '',
      add1: '',
      add2: '',
      phone: '',
      email: '',
      tax: '',
      note: '',
      loding: false,
      visible: false,
      buttonToggle: 'save',
      getid: '',
      showModal: false,
    }
    //this.handleInput = this.handleInput.bind(this)
  }

  componentDidMount() {
    this.getData()
  }
  getData() {
    const addData = {
      id: localStorage.getItem('token2'),
    }

    var insertUrl = `${api}/getAddress`
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
  handleInput = (e) => {
    const name = e.target.name
    this.setState({ [name]: e.target.value })
  }

  saveAddress = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const addData = {
      name: this.state.name,
      cPerson: this.state.cPerson,
      country: this.state.country,
      pCode: this.state.pCode,
      city: this.state.city,
      state: this.state.state,
      add1: this.state.add1,
      add2: this.state.add2,
      phone: this.state.phone,
      email: this.state.email,
      tax: this.state.tax,
      note: this.state.note,
      userId: localStorage.getItem('token2'),
      id: this.state.getid,
    }

    this.setState({ loding: true })

    var insertUrl = `${api}/addAddress`
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
            cPerson: '',
            country: '',
            pCode: '',
            city: '',
            state: '',
            add1: '',
            add2: '',
            phone: '',
            email: '',
            tax: '',
            note: '',
            visible: false,
            getid: '',
          })

          this.getData()

          //alert('Logeed In');
        } else {
          this.setState({ loding: false })
        }
      })
      .catch((err) => {
        // $.LoadingOverlay('hide')
        // toastr.error('Error', err.message)
        this.setState({ loding: false })
        console.log('network error')
        console.log(err)
      })
  }
  ShowAddressForm = () => {
    this.setState({
      visible: true,
      name: '',
      cPerson: '',
      country: '',
      pCode: '',
      city: '',
      state: '',
      add1: '',
      add2: '',
      phone: '',
      email: '',
      tax: '',
      note: '',
      buttonToggle: 'save',
      getid: '',
    })
  }
  close = () => {
    this.setState({
      visible: false,
      name: '',
      cPerson: '',
      country: '',
      pCode: '',
      city: '',
      state: '',
      add1: '',
      add2: '',
      phone: '',
      email: '',
      tax: '',
      note: '',
      getid: '',
      buttonToggle: 'save',
    })
  }

  editAddress = (index) => {
    console.log(index)
    this.setState({
      visible: true,
      name: index.Name,
      cPerson: '',
      country: index.Country,
      pCode: index.postal_code,
      city: index.City,
      state: index.State,
      add1: index.Address,
      add2: index.Address2,
      phone: index.Phone,
      email: index.Email,
      tax: index.tax,
      note: index.Remarks,
      buttonToggle: 'Edit',
      getid: index.id,
    })
  }

  showDeleteAlert = (index) => {
    console.log(index)

    this.setState({
      showModal: true,
      getid: index.id,
    })
  }

  deleteAddress = () => {
    const addData = {
      id: this.state.getid,
    }

    var insertUrl = `${api}/deleteAddress`
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
          this.setState({
            loding: false,
            showModal: false,
            visible: false,
            name: '',
            cPerson: '',
            country: '',
            pCode: '',
            city: '',
            state: '',
            add1: '',
            add2: '',
            phone: '',
            email: '',
            tax: '',
            note: '',
            getid: '',
          })

          this.getData()
        } else {
          this.getData()
        }
      })
      .catch((err) => {
        this.setState({ loding: false })
        console.log('network error')
        console.log(err)
      })
  }

  hideModel = () => {
    this.setState({
      showModal: false,
      getid: '',
    })
  }

  render() {
    const launchModel = () => {
      return (
        <>
          <CModal visible={this.state.showModal} onClose={() => this.hideModel()}>
            <CModalHeader>
              <CModalTitle>Delete Address</CModalTitle>
            </CModalHeader>
            <CModalBody>
              Deleting an address is irreversible. Are you sure you want to delete this address?
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => this.hideModel()}>
                Close
              </CButton>
              <CButton color="danger" onClick={() => this.deleteAddress()}>
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
                <strong>Address Form</strong>
                <CButton
                  className="px-4 float-end btn-close"
                  aria-label="Close"
                  color="dark"
                  onClick={this.close}
                ></CButton>
              </CCardHeader>
              <CCardBody>
                <CForm onSubmit={this.saveAddress}>
                  <CRow>
                    <CCol md={3}>
                      <CFormInput
                        type="hidden"
                        name="id"
                        value={this.state.getid}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                      />
                      <CFormLabel htmlFor="exampleFormControlInput1">Name</CFormLabel>
                      <CFormInput
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Name"
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Country</CFormLabel>
                      <CFormInput
                        type="text"
                        name="country"
                        value={this.state.country}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Country"
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Postal Code</CFormLabel>
                      <CFormInput
                        type="text"
                        name="pCode"
                        value={this.state.pCode}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Postal Code"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">City</CFormLabel>
                      <CFormInput
                        type="text"
                        name="city"
                        value={this.state.city}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="City"
                        required
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">State/Province</CFormLabel>
                      <CFormInput
                        type="text"
                        name="state"
                        value={this.state.state}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="State/Province"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Address Line 1</CFormLabel>
                      <CFormInput
                        type="text"
                        name="add1"
                        value={this.state.add1}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Address Line 1"
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Address Line 2</CFormLabel>
                      <CFormInput
                        type="text"
                        name="add2"
                        value={this.state.add2}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Address Line 1"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Phone</CFormLabel>
                      <CFormInput
                        type="number"
                        name="phone"
                        value={this.state.phone}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Phone"
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Email</CFormLabel>
                      <CFormInput
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Email"
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">
                        Vat / Tax ID Line 1
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        name="tax"
                        value={this.state.tax}
                        onChange={this.handleInput}
                        id="exampleFormControlInput1"
                        placeholder="Vat / Tax ID Line 1"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="exampleFormControlInput1">Remarks</CFormLabel>
                      <CFormTextarea
                        name="note"
                        value={this.state.note}
                        onChange={this.handleInput}
                        id="Notes"
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
              <strong>Address Book</strong>
              <CButton className="px-4 float-end" color="dark" onClick={this.ShowAddressForm}>
                Add Address
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
                  'Name',
                  'Phone',
                  'Country',
                  'City',
                  'State',
                  'Address',
                  'Email',
                  'Remarks',
                ]}
                itemsPerPage={5}
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
                            this.editAddress(items)
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
export default AddressBook
