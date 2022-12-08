import React, { useState ,useEffect} from 'react'
import * as $ from 'jquery'
import { var_carrier, var_receipt_type } from './constants'
import { api } from './constants'

import 'react-image-lightbox/style.css' // This only needs to be imported once in your app
import {
  CCardBody,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormSelect,
} from '@coreui/react-pro'

import Accordion from '../base/accordion/Accordion'
import Toast from '../../components/Toast'
import axios from 'axios'
import './CreateOrder.css'

const id = localStorage.getItem('token2')

let alertStyles = {
  backgroundColor: '#c5da4b',
  boxShadow: '5px 5px 10px #8ebd40',
  padding: '1em',
  zIndex: 100,
  position: 'absolute',
  top: 50,
  right: 50,
  width: '300px',
  textAlign: 'center',
}

function CreateBox() {
  const [allFormData, setAllFormData] = useState({
    formValues: [{ title: '', quantity: '1', filteredData: '', isOpen: false, selectedValue: '' }],
    sendValues: [{ title: '', quantity: '1', mpn: '', upc: '', sku: '', product_id: '' }],
    visible: true,
    description: '',
    recipt_type: '',
    carrier: '',
    carrier_name: '',
    tracking_number: '',
    remarks: '',
    showAlert: false,
    alertData: '',
    first_products:"",
    is_warehouse:0,

  })
  const handleInput = (e) => {
    const name = e.target.name
    setAllFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }))
  }
  function handleChange(i, e) {
    let formValues = allFormData.formValues
    console.log('iiiiiiiiiiiii', i)
    formValues[i][e.target.name] = e.target.value
    setAllFormData((prevState) => ({
      ...prevState,
      formValues,
    }))
    let sendValues = allFormData.sendValues
    sendValues[i][e.target.name] = e.target.value
    setAllFormData((prevState) => ({
      ...prevState,
      sendValues,
    }))
    console.log('sendValues', sendValues)
  }

  const handleTitle = (i, e) => {
    let formValues = allFormData.formValues
    console.log('iiiiiiiiiiiii', i)
    formValues[i].selectedValue = e
    formValues[i].title = e.title
    setAllFormData((prevState) => ({
      ...prevState,
      formValues,
    }))

    let sendValues = allFormData.sendValues
    sendValues[i].title = formValues[i].selectedValue.title
    sendValues[i].mpn = formValues[i].selectedValue.mpn
    sendValues[i].upc = formValues[i].selectedValue.upc
    sendValues[i].sku = formValues[i].selectedValue.sku
    sendValues[i].product_id = formValues[i].selectedValue.product_id

    setAllFormData((prevState) => ({
      ...prevState,
      sendValues,
    }))

    console.log('sendValues in handletitle', sendValues)
  }

  function addFormFields() {
    setAllFormData((prevState) => ({
      ...prevState,
      formValues: [...allFormData.formValues, { title: '', quantity: '1', filteredData: allFormData.first_products}],
    }))
    setAllFormData((prevState) => ({
      ...prevState,
      sendValues: [
        ...allFormData.sendValues,
        { title: '', quantity: '1', mpn: '', upc: '', sku: '', product_id: '' },
      ],
    }))
  }

  function removeFormFields(i) {
    let formValues = allFormData.formValues
    let sendValues = allFormData.sendValues
    formValues.splice(i, 1)
    setAllFormData((prevState) => ({
      ...prevState,
      formValues,
    }))
    sendValues.splice(i, 1)
    setAllFormData((prevState) => ({
      ...prevState,
      sendValues,
    }))
  }

  const quickSearch = (i, e) => {
    let formValues = allFormData.formValues
    formValues[i][e.target.name] = e.target.value
    setAllFormData((prevState) => ({
      ...prevState,
      formValues,
    }))
    let url = `${api}/findProducts`

    const formData = new FormData()
    formData.append('title', e.target.value)
    formData.append('user_id', id)

    axios
      .post(url, formData)
      .then((res) => {
        console.log(res.data)
        if (res.data.products) {
          formValues[i].filteredData = res.data.products
          formValues[i].isOpen = true
          setAllFormData((prevState) => ({
            ...prevState,
            formValues,
          }))
          console.log(formValues)
        } else {
          setAllFormData((prevState) => ({
            ...prevState,
            filteredProducts: [],
          }))
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    let detailsData = JSON.stringify(allFormData.sendValues)
    const addData = {
      description: allFormData.description,
      recipt_type: allFormData.recipt_type !== ('' || 'Select Type') && allFormData.recipt_type,
      carrier: allFormData.carrier,
      carrier_name: allFormData.carrier_name ? allFormData.carrier_name : allFormData.carrier,
      tracking_number: allFormData.tracking_number,
      remarks: allFormData.remarks,
    }

    const formData = new FormData()
    formData.append('description', allFormData.description)
    allFormData.recipt_type !== ('' || 'Select Type') &&
      formData.append('recipt_type', allFormData.recipt_type)
    formData.append('carrier', allFormData.carrier)
    formData.append(
      'carrier_name',
      allFormData.carrier_name ? allFormData.carrier_name : allFormData.carrier,
    )
    formData.append('tracking_number', allFormData.tracking_number)
    formData.append('remarks', allFormData.remarks)
    formData.append('userId', localStorage.getItem('token2'))
    formData.append('detailsData', detailsData)

    let isError = false
    allFormData.formValues.map((product) => {
      const values = Object.values(product)
      if (!values[0] || Number(values[1]) < 1) {
        isError = true
      }
      return null
    })

    if (
      !allFormData.description ||
      !allFormData.carrier ||
      !allFormData.tracking_number ||
      !allFormData.recipt_type ||
      isError
    ) {
      setAllFormData((prevState) => ({
        ...prevState,
        showAlert: true,
        alertData: 'Fill all the values',
      }))
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
      return
    }

    console.log('addData', addData)
    console.log(detailsData)

    var insertUrl = `${api}/createUserReceiptClone`

    new Promise(function (resolve, reject) {
      $.ajax({
        url: insertUrl,
        type: 'POST',
        data: formData,
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
          console.log(20000000000000000000000000000000000003222)
          setAllFormData((prevState) => ({
            ...prevState,
            showAlert: false,
          }))

          setAllFormData((prevState) => ({
            ...prevState,
            showAlert: true,
            alertData: JSON.parse(result).message,
          }))
          setAllFormData((prevState) => ({
            ...prevState,
            formValues: [
              { title: '', quantity: '1', filteredData: '', isOpen: false, selectedValue: '' },
            ],
            sendValues: [{ title: '', quantity: '1', mpn: '', upc: '', sku: '', product_id: '' }],
            visible: true,
            description: '',
            recipt_type: '',
            carrier: '',
            carrier_name: '',
            tracking_number: '',
            remarks: '',
            // showAlert: false,
            // alertData: '',
          }))
        } else {
          console.log('byee')
        }
      })
      .catch((err) => {
        setAllFormData((prevState) => ({
          ...prevState,
          showAlert: true,
          alertData: JSON.parse(err).message,
        }))
        console.log('err', err)
      })

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }
  const debounce = (fn, delay) => {
    let timeout = -1
    const currentScope = this
    return function (...args) {
      clearTimeout(timeout)
      timeout = setTimeout(fn.bind(currentScope, ...args), delay)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const addData = {
        id: localStorage.getItem('token2'),
        is_warehouse:allFormData.is_warehouse
      }
      console.log(localStorage.getItem('token2'))
      var insertUrl = `${api}/getUserProductsDropdownClone`
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
            setAllFormData((prevState) => ({
              ...prevState,
              formValues: [
                {
                  title: '',
                  quantity: '1',
                  filteredData: result,
                  isOpen: false,
                  selectedValue: '',
                },
              ],
              
            }))
            setAllFormData(prevState => ({
              ...prevState,
              first_products:result
            }))
          } else {
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
    fetchData()
  }, [])

  return (
    <div>
      {console.log('showAlert', allFormData.showAlert)}

      {allFormData.showAlert && (
        <Toast
          text={allFormData.alertData}
          onClose={() => {
            setAllFormData((prevState) => ({
              ...prevState,
              showAlert: false,
            }))
          }}
        />
      )}

      <CForm onSubmit={handleSubmit} enctype="multipart/form-data">
        <Accordion
          title="Box Details"
          active={1}
          body={
            <CCardBody>
              <CRow>
                <CCol md={4}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Description*</CFormLabel>
                  <CFormInput
                    type="text"
                    name="description"
                    value={allFormData.description}
                    onChange={handleInput}
                    id="exampleFormControlInput1"
                    placeholder="Description"
                    required
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Box Type*</CFormLabel>
                  <div style={{ display: 'block' }}>
                    <CFormSelect
                      name="recipt_type"
                      size="sm"
                      className="mb-3"
                      aria-label="Small select example"
                      value={allFormData.recipt_type}
                      onChange={handleInput}
                      required
                    >
                      <option>Select Type</option>
                      {var_receipt_type.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Carrier*</CFormLabel>
                  <CFormSelect
                    name="carrier"
                    size="sm"
                    className="mb-3"
                    aria-label="Small select example"
                    value={allFormData.carrier}
                    onChange={handleInput}
                    required
                  >
                    <option>Select Carrier</option>
                    {var_carrier.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                {allFormData.carrier === 'other' && (
                  <CCol md={4}>
                    <CFormLabel htmlFor="exampleFormControlInput1">Carrier Name*</CFormLabel>
                    <CFormInput
                      type="text"
                      name="carrier_name"
                      value={allFormData.carrier_name}
                      onChange={handleInput}
                      id="exampleFormControlInput1"
                      placeholder="Carrier Name"
                      required
                    />
                  </CCol>
                )}
                <CCol md={4}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Tracking Number*</CFormLabel>
                  <CFormInput
                    type="text"
                    name="tracking_number"
                    value={allFormData.tracking_number}
                    onChange={handleInput}
                    id="exampleFormControlInput1"
                    placeholder="Tracking Number"
                    required
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="exampleFormControlInput1">Remarks</CFormLabel>
                  <CFormInput
                    type="text"
                    name="remarks"
                    value={allFormData.remarks}
                    onChange={handleInput}
                    id="exampleFormControlInput1"
                    placeholder="Remarks"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          }
        />

        <Accordion
          title="Product Info"
          body={
            <>
              {allFormData.formValues.map((element, index) => (
                <CRow key={index} style={{ marginTop: '35px' }}>
                  <CCol md={4}>
                    <CFormLabel htmlFor="exampleFormControlInput1">Title*</CFormLabel>
                    <CFormInput
                      type="text"
                      name="title"
                      value={element.title || ''}
                      onClick={() =>
                        { 
                          let formValues = allFormData.formValues
  
                          formValues[index].isOpen = true
  
                          setAllFormData((prevState) => ({
                            ...prevState,
                            formValues,
                          }))
                        }
                        }
                      onChange={(e) => debounce(quickSearch(index, e))}
                      id="exampleFormControlInput1"
                      placeholder="Title"
                      required
                    />
                    <div className="search-field">
                    {element.isOpen && <p style={{color:"grey", textAlign:"right",marginLeft:"auto",fontSize:"2rem",margin:"5px"}} onClick={() =>
                                { 
                                  let formValues = allFormData.formValues

                                  formValues[index].isOpen = false
                                  setAllFormData((prevState) => ({
                                    ...prevState,
                                    formValues,
                                  }))
                                }
                                }>x</p>}
                      {element.isOpen
                        ? element.filteredData &&
                          element?.filteredData.map((product) => (
                            <p
                              key={product.id}
                              name="title"
                              onClick={(e) => {
                                handleTitle(index, product)
                                let formValues = allFormData.formValues

                                formValues[index].isOpen = false
                                setAllFormData((prevState) => ({
                                  ...prevState,
                                  formValues,
                                }))
                                console.log('product.title')
                              }}
                            >
                              {product.title}
                            </p>
                          ))
                        : null}
                    </div>
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="exampleFormControlInput1">Quantity*</CFormLabel>
                    <CFormInput
                      type="number"
                      name="quantity"
                      value={element.quantity || ''}
                      onChange={(e) => handleChange(index, e)}
                      id="exampleFormControlInput1"
                      placeholder="Quantity"
                      required
                      min={1}
                    />
                  </CCol>
                  <CCol md={2}>
                    {index ? (
                      <CButton
                        style={{ marginTop: '35px' }}
                        color="danger"
                        className="button remove"
                        onClick={() => removeFormFields(index)}
                      >
                        Remove
                      </CButton>
                    ) : null}
                  </CCol>
                </CRow>
              ))}
              <CRow>
                <CCol md={2}>
                  <CButton
                    style={{ marginTop: '35px' }}
                    color="primary"
                    className="button add"
                    onClick={() => addFormFields()}
                  >
                    + Add Product
                  </CButton>
                </CCol>
              </CRow>
              <CRow>
                <CCol md={2}>
                  <CButton
                    style={{ marginTop: '35px' }}
                    color="primary"
                    className="button submit"
                    type="submit"
                    // onClick={handleSubmit}
                  >
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </>
          }
        />
      </CForm>
    </div>
  )
}

export default CreateBox
