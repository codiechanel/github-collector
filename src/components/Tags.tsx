import store from '../Store'
import { List, ListItem } from '@rmwc/list'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import { Typography } from '@rmwc/typography'

function Tags(props) {
  let list: any = Array.from(store.tags)
  return (
    <List>
      {list.map(([key, item]) => (
        <ListItem key={key}>
          <Typography use="body1"> {item.name}</Typography>
        </ListItem>
      ))}
    </List>
  )
}

export default observer(Tags)
