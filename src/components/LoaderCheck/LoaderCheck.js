import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './LoaderCheck.less'

const LoaderCheck = ({ spinning, fullScreen }) => {
  return (<div className={classNames(styles.loader, {
    [styles.hidden]: !spinning,
    [styles.fullScreen]: fullScreen,
  })}
  >
    <div className={styles.warpper}>
      <div className={styles.inner} />
      <div className={styles.text} >正在进行连接测试...</div>
    </div>
  </div>)
}


LoaderCheck.propTypes = {
  spinning: PropTypes.bool,
  fullScreen: PropTypes.bool,
}

export default LoaderCheck
