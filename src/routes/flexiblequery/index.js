import React from 'react'

import { request, config } from 'utils'

export default class RequestPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount () {
    let win = window.open('http://www.pmdaniu.com/cloud/18552/967ce8c27da05c2f114ae793376c2731-26323/%E5%8D%B3%E5%B8%AD%E6%9F%A5%E8%AF%A2.html', '_blank');
    win.focus();
  }

  render () {

    return (
      <div className="content-inner">

      </div>
    )
  }
}
