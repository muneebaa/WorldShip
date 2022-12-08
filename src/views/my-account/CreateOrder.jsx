import React, { useState,useEffect } from 'react'
import * as $ from 'jquery'

import 'react-image-lightbox/style.css' // This only needs to be imported once in your app
import {
  CCardBody,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormSwitch,
  CFormCheck,
  CFormSelect,
} from '@coreui/react-pro'

import Accordion from '../base/accordion/Accordion'
import Toast from '../../components/Toast'
import axios from 'axios'

import { api } from './constants'

import './CreateOrder.css'

const id = localStorage.getItem('token2')

function CreateOrder() {
  const [allFormData, setAllFormData] = useState({
    formValues: [{ title: '', quantity: '1', filteredData: '', isOpen: false, selectedValue: '' }],
    sendValues: [{ title: '', quantity: '1', mpn: '', upc: '', sku: '', product_id: '' }],
    visible: true,
    firstName: '',
    first_products:"",
    lastName: '',
    contact: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United State',
    notes: '',
    buyer_msg: '',
    shipping_service: 'USPS',
    isUserToggleButton: true,
    userLabelImage: null,
    weight: '',
    showAlert: false,
    alertData: '',
    rates: [],
    selectedRate: {},
    length: '',
    height: '',
    width: '',
    filteredProducts: [],
  })

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
      formValues: [...allFormData.formValues, { title: '', quantity: '1', filteredData: allFormData.first_products }],
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
  const handleInput = (e) => {
    const name = e.target.name
    setAllFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }))
  }

  const getLabelRates = async (event) => {
    const formData = new FormData()
    formData.append('BUYER_ZIP', allFormData.zip)
    formData.append('TOTAL_PRICE', 0.01)
    formData.append('WEIGHT', allFormData.weight)

    var insertUrl = 'http://66.45.36.13:3002/op/api/rate/getRateUSPS'
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
          setAllFormData((prevState) => ({
            ...prevState,
            rates: result,
          }))
        } else {
          console.log('byee')
        }
      })
      .catch((err) => {
        console.log(err)
      })
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
    setAllFormData((prevState) => ({
      ...prevState,
      showAlert: false,
    }))
    event.preventDefault()
    event.stopPropagation()

    let detailsData = JSON.stringify(allFormData.sendValues)
    // let detailsData = JSON.stringify(allFormData.formValues)
    console.log(detailsData)

    const formData = new FormData()
    formData.append('first_name', allFormData.firstName)
    formData.append('last_name', allFormData.lastName)
    formData.append('contact', allFormData.contact)
    formData.append('email', allFormData.email)
    formData.append('address', allFormData.address)
    formData.append('city', allFormData.city)
    formData.append('state', allFormData.state)
    formData.append('zip', allFormData.zip)
    formData.append('country', allFormData.country)
    formData.append('notes', allFormData.notes)
    formData.append('buyer_msg', allFormData.buyer_msg)
    formData.append('shipping_service', allFormData.shipping_service)
    formData.append('userId', localStorage.getItem('token2'))
    formData.append('detailsData', detailsData)
    formData.append('weight', allFormData.weight)
    formData.append(
      'dimensions',
      `${allFormData.length}x${allFormData.width}x${allFormData.height}`,
    )
    formData.append('label_by', allFormData.isUserToggleButton ? 'User' : 'Shipjeannie')
    formData.append('label_file', allFormData.userLabelImage)
    formData.append('service_selected', allFormData.selectedRate.ServiceDescription)
    formData.append('service_charges', allFormData.selectedRate.Amount)
    let isError = false
    allFormData.formValues.map((product) => {
      const values = Object.values(product)
      console.log(values)
      if (!values[0] || Number(values[1]) < 1) {
        isError = true
      }
      return null
    })
    if (
      (allFormData.isUserToggleButton && !allFormData.userLabelImage) ||
      (!allFormData.isUserToggleButton &&
        (!allFormData.shipping_service ||
          !allFormData.firstName ||
          !allFormData.lastName ||
          !allFormData.contact ||
          !allFormData.address ||
          !allFormData.city ||
          !allFormData.state ||
          !allFormData.zip ||
          !allFormData.country)) ||
      isError
    ) {
      setAllFormData((prevState) => ({
        ...prevState,
        showAlert: true,
        alertData: 'Please fill all values',
      }))
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
      return
    }

    var insertUrl = `${api}/createOrder`

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
            firstName: '',
            lastName: '',
            contact: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: 'United State',
            notes: '',
            buyer_msg: '',
            shipping_service: 'USPS',
            // isUserToggleButton: true,
            userLabelImage: null,
            weight: 0,
            // showAlert: false,
            // alertData: '',
            rates: [],
            selectedRate: {},
            length: '',
            height: '',
            width: '',
            filteredProducts: [],
          }))
        } else {
          console.log('byee')
        }
      })
      .catch((err) => {
        setAllFormData((prevState) => ({
          ...prevState,
          showAlert: true,
          alertData: 'Some thing wrong',
        }))
        console.log(err)
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
      }
      console.log(localStorage.getItem('token2'))
      var insertUrl = `${api}/getUserProductsDropdown`
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
    <>
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
          title="Shipping Services"
          active={1}
          body={
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p style={{ marginRight: 7 }}>Shipjeannie {'   '}</p>
                <CFormSwitch
                  label="User"
                  id="formSwitchCheckChecked"
                  defaultChecked
                  value={allFormData.isUserToggleButton}
                  onClick={() =>
                    setAllFormData((prevState) => ({
                      ...prevState,
                      isUserToggleButton: !allFormData.isUserToggleButton,
                    }))
                  }
                />
              </div>
              <CRow>
                {allFormData.isUserToggleButton ? (
                  <CRow>
                    <div className="mb-3">
                      <CFormLabel htmlFor="formFile">Choose a jpeg file</CFormLabel>
                      <CFormInput
                        type="file"
                        id="formFile"
                        accept="image/x-jpg,image/jpeg,application/pdf"
                        onChange={(e) =>
                          setAllFormData((prevState) => ({
                            ...prevState,
                            userLabelImage: e.target.files[0],
                          }))
                        }
                        required
                      />
                    </div>
                  </CRow>
                ) : (
                  <>
                    <CRow>
                      <CCol md={4}>
                        <CFormLabel htmlFor="exampleFormControlInput1">First Name*</CFormLabel>
                        <CFormInput
                          type="text"
                          name="firstName"
                          value={allFormData.firstName}
                          onChange={handleInput}
                          id="exampleFormControlInput1"
                          placeholder="First Name"
                          required
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel htmlFor="exampleFormControlInput1">Last Name*</CFormLabel>
                        <CFormInput
                          type="text"
                          name="lastName"
                          value={allFormData.lastName}
                          onChange={handleInput}
                          id="exampleFormControlInput1"
                          placeholder="Last Name"
                          required
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel htmlFor="exampleFormControlInput1">Contact*</CFormLabel>
                        <CFormInput
                          type="text"
                          name="contact"
                          value={allFormData.contact}
                          onChange={handleInput}
                          id="exampleFormControlInput1"
                          placeholder="Contact"
                          required
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={4}>
                        <CFormLabel htmlFor="exampleFormControlInput1">Street*</CFormLabel>
                        <CFormInput
                          type="text"
                          name="address"
                          value={allFormData.address}
                          onChange={handleInput}
                          id="exampleFormControlInput1"
                          placeholder="Address"
                          required
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel htmlFor="exampleFormControlInput1">City*</CFormLabel>
                        <CFormInput
                          type="text"
                          name="city"
                          value={allFormData.city}
                          onChange={handleInput}
                          id="exampleFormControlInput1"
                          placeholder="City"
                          required
                        />
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel htmlFor="exampleFormControlInput1">State*</CFormLabel>
                        <CFormInput
                          type="text"
                          name="state"
                          value={allFormData.state}
                          onChange={handleInput}
                          id="exampleFormControlInput1"
                          placeholder="State"
                          required
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={4}>
                        <CFormLabel htmlFor="exampleFormControlInput1">Zip*</CFormLabel>
                        <CFormInput
                          type="text"
                          name="zip"
                          value={allFormData.zip}
                          onChange={handleInput}
                          id="exampleFormControlInput1"
                          placeholder="Zip"
                          required
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel htmlFor="exampleFormControlInput1">Country*</CFormLabel>
                        <CFormInput
                          type="text"
                          name="country"
                          value={allFormData.country}
                          readOnly
                          id="exampleFormControlInput1"
                          placeholder="Country"
                          required
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel htmlFor="exampleFormControlInput1">Email</CFormLabel>
                        <CFormInput
                          type="text"
                          name="email"
                          value={allFormData.email}
                          onChange={handleInput}
                          id="exampleFormControlInput1"
                          placeholder="Email"
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <CFormLabel htmlFor="exampleFormControlInput1">Buyer Message</CFormLabel>
                        <CFormInput
                          type="text"
                          name="buyer_msg"
                          value={allFormData.buyer_msg}
                          onChange={handleInput}
                          id="exampleFormControlInput1"
                          placeholder="Buyer Message"
                        />
                      </CCol>

                      <CCol md={6}>
                        <CFormLabel htmlFor="exampleFormControlInput1">Notes</CFormLabel>
                        <CFormInput
                          type="text"
                          name="notes"
                          value={allFormData.notes}
                          onChange={handleInput}
                          id="exampleFormControlInput1"
                          placeholder="Note"
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={3}>
                        <CFormLabel htmlFor="carrier">Select Carrier</CFormLabel>

                        <CFormSelect
                          name="carrier"
                          size="sm"
                          className="mb-3"
                          aria-label="Small select example"
                          value={allFormData.carrier}
                          onChange={handleInput}
                          style={{ padding: '.55em' }}
                        >
                          <option>Select Carrier</option>
                          <option>USPS</option>
                          <option>FedEx</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel htmlFor="weight">Weight (Ounce)</CFormLabel>
                        <CFormInput
                          type="number"
                          name="weight"
                          value={allFormData.weight}
                          onChange={(e) =>
                            setAllFormData((prevState) => ({
                              ...prevState,
                              weight: e.target.value,
                            }))
                          }
                          id="weight"
                          placeholder="Weight in Ounces"
                          required
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="dimensions">Dimensions</CFormLabel>
                        <CRow>
                          <CCol>
                            <CFormInput
                              type="number"
                              name="dimension"
                              value={allFormData.length}
                              onChange={(e) =>
                                setAllFormData((prevState) => ({
                                  ...prevState,
                                  length: e.target.value,
                                }))
                              }
                              id="exampleFormControlInput1"
                              placeholder="L"
                            />
                          </CCol>
                          x
                          <CCol>
                            <CFormInput
                              type="number"
                              name="dimension"
                              value={allFormData.width}
                              onChange={(e) =>
                                setAllFormData((prevState) => ({
                                  ...prevState,
                                  width: e.target.value,
                                }))
                              }
                              id="exampleFormControlInput1"
                              placeholder="W"
                            />
                          </CCol>
                          x
                          <CCol>
                            <CFormInput
                              type="number"
                              name="dimension"
                              value={allFormData.height}
                              onChange={(e) =>
                                setAllFormData((prevState) => ({
                                  ...prevState,
                                  height: e.target.value,
                                }))
                              }
                              id="exampleFormControlInput1"
                              placeholder="H"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                      <CCol md={2}>
                        <CButton
                          style={{ marginTop: '35px' }}
                          color="primary"
                          className="button submit"
                          onClick={() => getLabelRates()}
                        >
                          Get Label Rates
                        </CButton>
                      </CCol>
                    </CRow>
                  </>
                )}
              </CRow>

              {!allFormData.isUserToggleButton && (
                <div style={{ marginTop: 20 }}>
                  <CRow>
                    {allFormData.rates.length
                      ? allFormData.rates.map((item, index) => (
                          <CCol
                            key={index}
                            md={12}
                            onClick={() =>
                              setAllFormData((prevState) => ({
                                ...prevState,
                                selectedRate: allFormData.rates[index],
                              }))
                            }
                          >
                            <CFormCheck
                              type="radio"
                              name="flexRadioDefault"
                              id={item.ServiceDescription}
                              label={
                                <p>
                                  {item.ServiceDescription}{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    {' '}
                                    ${Number(item.Amount).toFixed(2)}
                                  </span>
                                </p>
                              }
                            />
                          </CCol>
                        ))
                      : null}
                  </CRow>
                </div>
              )}
            </>
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
                                  console.log("formValues-=-=-=-=-=---=-=--=-==-=-=-=-=-=-=-=- ",formValues)
                                  console.log("formValuesindexxxxxxxxxxxx ",formValues[index])

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
                  >
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </>
          }
        />
      </CForm>
    </>
  )
}

export default CreateOrder
