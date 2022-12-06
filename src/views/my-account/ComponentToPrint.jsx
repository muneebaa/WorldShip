import * as React from 'react'
import { api } from './constants'
import * as $ from 'jquery'
import Barcode from 'react-barcode'
import BarCode from 'react-barcode'
import './ComponentToPrint.css'
const ids = localStorage.getItem('token2')

export class ComponentToPrint extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = { checked: false, fnsku: [] }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    var insertUrl = `${api}/printFnsku`
    const data = new FormData()
    data.append('user_id', ids)
    data.append('receipt_id', this.props.id)
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
            this.setState({ fnsku: JSON.parse(result).data })
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
  // fetchData()

  render() {
    const { text } = this.props

    return (
      <div className="relativeCSS">
        <div className="flash " />
        <div className="bar-cc">
          {this.state.fnsku?.map((item, index) => (
            <div key={index} style={{ backgroundColor: 'white' }}>
              {[...Array(Number(item.fnsku_qty))].map((e, i) => (
                <div key={i} className="barcode-main">
                  <BarCode value={item.fnsku} className="ss" height="50px" />
                  <p>{item.fnsku_title}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* <Barcode
          className="ss"
          value="dasdasndaslndl2"
          options={{ width: 0.7, height: 20, format: 'CODE128', displayValue: false }}
        /> */}
      </div>
    )
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <ComponentToPrint ref={ref} text={props.text} />
})
