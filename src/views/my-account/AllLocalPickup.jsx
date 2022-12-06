import React, { useState, useEffect } from 'react'
import { api } from './constants'

import {
  CCard,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CSmartTable,
  CTooltip,
  CCardBody,
} from '@coreui/react-pro'
import * as $ from 'jquery'
const id = JSON.parse(localStorage.getItem('token2'))

function WhatsApp() {
  const [allUsers, setAllUser] = useState()
  let getUserReceipts = `${api}/getUserPickUps`

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = new FormData()
        data.append('user_id', id)

        new Promise(function (resolve, reject) {
          $.ajax({
            url: getUserReceipts,
            type: 'POST',
            data: data,
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
              setAllUser(JSON.parse(result).data)
            } else {
              console.log('Some thing Wrong')
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    console.log(allUsers)
  }, [allUsers])
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>All Local Pickups</strong>
            </CCardHeader>
            <CCardBody>
              <CSmartTable
                items={allUsers}
                columns={[
                  'order_number',
                  'client',
                  'store_name',
                  'address',
                  'status',
                  'remarks',
                  'created_at',
                  'received_by',
                  'received_at',
                ]}
                // columns={}
                itemsPerPage={20}
                columnFilter
                columnSorter
                pagination
                // scopedColumns={{
                //   change_whatsapp_number: (items) => {
                //     return (
                //       <td className="py-2">
                //         <CTooltip content="change_whatsapp_number">
                //           <CButton
                //             color="success"
                //             shape="square"
                //             size="sm"
                //             onClick={() => {
                //               showWhatsappModal(items)
                //             }}
                //           >
                //             Change Number
                //           </CButton>
                //         </CTooltip>
                //       </td>
                //     )
                //   },
                // }}
                tableProps={{
                  hover: true,
                  responsive: true,
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default WhatsApp
