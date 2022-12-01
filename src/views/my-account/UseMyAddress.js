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

class UseMyAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      country: '',
      name: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      phone: '',
      zip: '',
    }

    //this.handleInput = this.handleInput.bind(this)
  }

  componentDidMount() {
    this.getWarehouseAddress()
  }

  getWarehouseAddress() {
    const param = {
      userId: localStorage.getItem('token2'),
    }

    var insertUrl = `${api}/getwarehouseAddress`
    // this.state.baseUrl +
    // '/laptopzone/reactcontroller/c_haziqreact/copy_seed'
    new Promise(function (resolve, reject) {
      $.ajax({
        url: insertUrl,
        dataType: 'json',
        type: 'POST',
        data: param,
      }).then(
        function (param) {
          resolve(param)
        },
        function (err) {
          reject(err)
        },
      )
    })
      .then((result) => {
        console.log(result)
        // console.log(result[0].country);
        // console.log(result[1][0].Name);

        if (result) {
          this.setState({
            name: result[1][0].Name,
            country: result[0].country,
            address1: result[0].Address1,
            address2: result[0].Address2,
            city: result[0].City,
            state: result[0].State,
            phone: result[0].Phone,
            zip: result[0].Zip,
          })
          //this.setState({loadData: result});

          //alert('Logeed In');
        } else {
        }
      })
      .catch((err) => {
        // $.LoadingOverlay('hide')
        // toastr.error('Error', err.message)
        console.log('111')
        console.log(err)
      })
  }

  render() {
    return (
      <CRow>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{this.state.country}</strong>
            </CCardHeader>
            <CCardBody>
              <CListGroup>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  {this.state.name}
                  <CBadge color="primary-gradient" shape="rounded-pill">
                    Full Name
                  </CBadge>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  {this.state.address1}
                  <CBadge color="primary-gradient" shape="rounded-pill">
                    Address Line 1
                  </CBadge>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  {this.state.address2}
                  <CBadge color="primary-gradient" shape="rounded-pill">
                    Address Line 2
                  </CBadge>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  {this.state.city}
                  <CBadge color="primary-gradient" shape="rounded-pill">
                    City
                  </CBadge>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  {this.state.state}
                  <CBadge color="primary-gradient" shape="rounded-pill">
                    State
                  </CBadge>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  {this.state.zip}
                  <CBadge color="primary-gradient" shape="rounded-pill">
                    Zip
                  </CBadge>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  {this.state.phone}
                  <CBadge color="primary-gradient" shape="rounded-pill">
                    Phone
                  </CBadge>
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }
}
export default UseMyAddress
