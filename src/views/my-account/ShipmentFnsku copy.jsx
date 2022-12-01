import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from './constants'
import * as $ from 'jquery'
import Barcode from 'react-barcode'
const ids = localStorage.getItem('token2')

function ShipmentFnsku() {
  const [fnsku, setFnsku] = useState()
  let { id } = useParams()
  console.log('id', id)
  const data = new FormData()
  data.append('user_id', ids)
  data.append('receipt_id', id)
  var insertUrl = `${api}/printFnsku`

  useEffect(() => {
    const fetchData = async () => {
      try {
        new Promise(function (resolve, reject) {
          $.ajax({
            url: insertUrl,
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
              setFnsku(JSON.parse(result).data)
              console.log(result)
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
  console.log(id)
  return (
    <div>
      <h1>Shipment Fnsku</h1>
      {fnsku?.map((item, index) => (
        <div key={index} style={{ backgroundColor: 'white', margin: '3em' }}>
          {[...Array(Number(item.fnsku_qty))].map((e, i) => (
            <>
              <Barcode value={item.fnsku} />
              <p>{item.fnsku_title}</p>
            </>
          ))}
          <Barcode value={item.fnsku} />
        </div>
      ))}
    </div>
  )
}

export default ShipmentFnsku
