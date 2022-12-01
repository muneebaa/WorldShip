import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../my-account/constants'

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormFeedback,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import * as $ from 'jquery'

const Login = () => {
  const [validated, setValidated] = useState(false)
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')
  const [showvalid, setshowvalid] = useState(false)

  const authenticateUser = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }

    setValidated(true)
    setshowvalid(false)

    //const authenticateUser = async () => {
    //try {

    //const userData = { email, password }
    if (email && password) {
      const userData = {
        email: email,
        password: password,
      }

      var insertUrl = `${api}/sign_in`
      // this.state.baseUrl +
      // '/laptopzone/reactcontroller/c_haziqreact/copy_seed'
      new Promise(function (resolve, reject) {
        $.ajax({
          url: insertUrl,
          dataType: 'json',
          type: 'POST',
          data: userData,
          headers: [
            { 'Access-Control-Allow-Origin': '*' },
            { 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept ' },
            { 'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE' },
            { 'Access-Control-Max-Age': 3600 },
          ],
          beforeSend: function (xhr) {
            xhr.withCredentials = true
            xhr.credentials = 'include'
          },
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
            localStorage.setItem('token', result['user_id'][0].email)
            localStorage.setItem('token2', result['user_id'][0].user_id)
            localStorage.setItem('user', JSON.stringify(result))
            window.location.href = '/#/dashboard'

            //alert('Logeed In');
          } else {
            setshowvalid(true)

            // setTimeout(() => {
            //   setshowvalid(false)
            // }, 2000);

            //alert('Invalid Credentials');
          }
        })
        .catch((err) => {
          // $.LoadingOverlay('hide')
          // toastr.error('Error', err.message)
          console.log('111')
          console.log(err)
        })
    }
    //test ajax
    // } catch (err) {
    //   console.error(err)
    // }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    className="needs-validation"
                    noValidate
                    validated={validated}
                    onSubmit={authenticateUser}
                  >
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <CFormFeedback invalid>Please provide a valid Email!</CFormFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <CFormFeedback invalid>Please Enter Your Password!</CFormFeedback>
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type="submit" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      {/*<CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>*/}
                    </CRow>
                  </CForm>

                  {showvalid ? (
                    <CAlert style={{ marginTop: '10px' }} color="danger" dismissible>
                      <strong>Invalid</strong> Credentials.
                    </CAlert>
                  ) : null}
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>Dont have an account ? Join now !</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
