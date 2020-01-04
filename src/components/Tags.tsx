import store from '../common/Store'
import { List, ListItem } from '@rmwc/list'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import { Typography } from '@rmwc/typography'
import { navigate } from '@reach/router'

function Tags(props) {
  // let list: any = Array.from(store.tags)
  return (
    <List>
      {store.tagsArray.map(([key, item]) => (
        <ListItem
          key={key}
          onClick={() => {
            // store.selectedTagId = key
            navigate(`/packages/${key}`, { replace: false })
          }}
        >
          <Typography use="body1"> {item.name}</Typography>
        </ListItem>
      ))}
    </List>
  )
}

export default observer(Tags)
