import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { color } from 'utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,BarChart,Bar } from 'recharts'
import styles from './sales.less'

function Sales ({ data,modalVisible,loglist }) {
  /*console.log(loglist,"loglist")*/

  let funcName =[]
  for (let i=0;i<4;i++){
    funcName[i]='title'
      if (i<loglist.length)
      {  funcName[i] = loglist[i].logContent
      }
  }

  return (
    <div className={styles.sales}>
      {modalVisible==false?
        <div id="ZX">
          <ResponsiveContainer minHeight={360} >
            <LineChart data={data}>
              <Legend verticalAlign="top"
                      content={(prop) => {
                        const { payload } = prop
                        return (<ul className={classnames({ [styles.legend]: true, clearfix: true })}>
                          {payload.map((item, key) => <li key={key}><span className={styles.radiusdot} style={{ background: item.color }} />{item.value}</li>)}
                        </ul>)
                      }}
              />
              <XAxis dataKey="name" axisLine={{ stroke: color.borderBase, strokeWidth: 1 }} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <CartesianGrid vertical={false} stroke={color.borderBase} strokeDasharray="3 3" />
              <Tooltip
                wrapperStyle={{ border: 'none', boxShadow: '4px 4px 40px rgba(0, 0, 0, 0.05)' }}
                content={(content) => {
                  const list = content.payload ===null?null:content.payload.map((item, key) => <li key={key} className={styles.tipitem}><span className={styles.radiusdot} style={{ background: item.color }} />{`${item.name}:${item.value}`}</li>)
                  return <div className={styles.tooltip}><p className={styles.tiptitle}>{content.label}</p><ul>{list}</ul></div>
                }}
              />
              <Line type="monotone" dataKey={funcName[0]} stroke={color.purple} strokeWidth={3} dot={{ fill: color.purple }} activeDot={{ r: 5, strokeWidth: 0 }} />
              <Line type="monotone" dataKey={funcName[1]} stroke={color.red} strokeWidth={3} dot={{ fill: color.red }} activeDot={{ r: 5, strokeWidth: 0 }} />
              <Line type="monotone" dataKey={funcName[2]} stroke={color.green} strokeWidth={3} dot={{ fill: color.green }} activeDot={{ r: 5, strokeWidth: 0 }} />
              <Line type="monotone" dataKey={funcName[3]} stroke={color.blue} strokeWidth={3} dot={{ fill: color.green }} activeDot={{ r: 5, strokeWidth: 0 }} />

            </LineChart>
          </ResponsiveContainer>
        </div>
        :<div  id="TX">
          <ResponsiveContainer minHeight={360} >
            <BarChart data={data}>
              <Legend verticalAlign="top"
                      content={(prop) => {
                        const { payload } = prop
                        return (<ul className={classnames({ [styles.legend]: true, clearfix: true })}>
                          {payload.map((item, key) => <li key={key}><span className={styles.radiusdot} style={{ background: item.color }} />{item.value}</li>)}
                        </ul>)
                      }}
              />
              <XAxis dataKey="name" axisLine={{ stroke: color.borderBase, strokeWidth: 1 }} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <CartesianGrid vertical={false} stroke={color.borderBase} strokeDasharray="3 3" />
              <Tooltip
                wrapperStyle={{ border: 'none', boxShadow: '4px 4px 40px rgba(0, 0, 0, 0.05)' }}
                content={(content) => {
                  const list = content.payload.map((item, key) => <li key={key} className={styles.tipitem}><span className={styles.radiusdot} style={{ background: item.color }} />{`${item.name}:${item.value}`}</li>)
                  return <div className={styles.tooltip}><p className={styles.tiptitle}>{content.label}</p><ul>{list}</ul></div>
                }}
              />
              <Bar type="monotone" dataKey={funcName[0]} fill={color.purple} strokeWidth={3}   />
              <Bar type="monotone" dataKey={funcName[1]} fill={color.red} strokeWidth={3} />
              <Bar type="monotone" dataKey={funcName[2]} fill={color.green} strokeWidth={3} />
              <Bar type="monotone" dataKey={funcName[3]} fill={color.blue} strokeWidth={3}  />

            </BarChart>
          </ResponsiveContainer>
        </div>
      }
    </div>
  )
}

Sales.propTypes = {
  data: PropTypes.array,
}

export default Sales
