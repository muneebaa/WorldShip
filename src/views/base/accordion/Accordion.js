import React from 'react'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
} from '@coreui/react'

const Accordion = (props) => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CAccordion activeItemKey={props.active}>
              <CAccordionItem itemKey={props.key}>
                <CAccordionHeader>{props.title}</CAccordionHeader>
                <CAccordionBody>{props.body}</CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.any.isRequired,
  active: PropTypes.any,
  key: PropTypes.number.isRequired,
}

Accordion.defaultProps = {
  title: 'Title of Accordion',
  body: 'Body of Accordion',
  key: 1,
}

export default Accordion
