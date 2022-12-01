import React, { Component, useState, useEffect } from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress, 
  CCardText,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }  
    
   
    //this.handleInput = this.handleInput.bind(this)
  }

  render() {

  return (
    <CRow>
      <CCol xs={12}>   
        <h1 className="text-center">Welcome To Shipjeannie</h1> 
          
        </CCol>

      
    </CRow>


    )
  }
}
export default Dashboard

