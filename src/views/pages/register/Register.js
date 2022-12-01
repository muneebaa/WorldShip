import React, { useState } from 'react'
import { api } from '../../my-account/constants'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import * as $ from 'jquery'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatpass, setRepeatpass] = useState('')
  const [msg, setmsg] = useState('')
  const [showvalid, setshowvalid] = useState(false)
  const [showExistUser, setshowExistUser] = useState(false)

  const [validated, setValidated] = useState(false)

  //const handleSubmit = (event) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }

    setValidated(true)
    setshowvalid(false)
    setshowExistUser(false)

    if (name && email && password && repeatpass) {
      if (password !== repeatpass) {
        console.log('Passwords dont match')
        setshowvalid(true)
      } else {
        setshowvalid(false)
        //setmsg("");
        console.log('Passwords  matssssch')
        try {
          const userData = {
            name: name,
            email: email,
            password: password,
            repeatpass: repeatpass,
          }

          console.log(userData)
          //localStorage.setItem('token', userData.email)
          // window.location.href = "/#/dashboard";
          //const response = await fetch('http://apps.k2bay.com/laptopzone/reactcontroller/c_react/test', {
          //test ajax

          var insertUrl = `${api}/register_user`
          // this.state.baseUrl +
          // '/laptopzone/reactcontroller/c_haziqreact/copy_seed'
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
              if (result.status == true) {
                setshowExistUser(false)

                //localStorage.setItem('token', userData.email)

                localStorage.setItem('token', result.email)
                localStorage.setItem('token2', result.user_id)
                localStorage.setItem('user', JSON.stringify(result))

                window.location.href = '/#/dashboard'
              } else {
                setshowExistUser(true)
              }
            })
            .catch((err) => {
              // $.LoadingOverlay('hide')
              // toastr.error('Error', err.message)
              console.log('111')
              console.log(err)
            })
          //test ajax
        } catch (err) {
          console.log('222222')
          console.error(err)
        }
      }
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm
                  className="needs-validation"
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                >
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Name"
                      autoComplete="name"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <CFormFeedback invalid>Please Enter Your Name!</CFormFeedback>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <CFormFeedback invalid>Please provide a valid Email.</CFormFeedback>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <CFormFeedback invalid>Please Enter Your Password</CFormFeedback>
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      onChange={(e) => setRepeatpass(e.target.value)}
                      required
                    />
                    <CFormFeedback invalid>Please Confirm Your Password</CFormFeedback>

                    {showvalid ? (
                      <CFormFeedback style={{ color: 'red' }} valid>
                        Password do not match{' '}
                      </CFormFeedback>
                    ) : null}
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
                {showExistUser ? (
                  <CAlert style={{ marginTop: '10px' }} color="danger" dismissible>
                    <strong>Email </strong> Already Exist ! <strong>Try </strong> Another Email
                  </CAlert>
                ) : null}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
