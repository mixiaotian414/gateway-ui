import React from 'react';
import { Avatar, List } from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';
export default function NoticeList({
  data = [], onClick, onClear, title, locale, emptyText, emptyImage,
}) {
  if (!data.length > 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? (
          <img src={emptyImage} alt="not found" />
        ) : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.length > 0 && data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                avatar={item.avatar ? <Avatar className={styles.avatar} src={item.avatar} /> : null}
                title={
                  <div className={styles.title}>
                    {item.notifyTitle}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description} title={item.notifyContent}>
                      {item.notifyContent}
                    </div>
                    <div className={styles.datetime}>{item.lastUpdateTime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      <div className={styles.clear} onClick={onClear}>
        {locale.clear}{title}
      </div>
    </div>
  );
}
