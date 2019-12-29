import store from '../common/Store'
import * as React from 'react'
import { observer } from 'mobx-react'
import { List, ListItem } from '@rmwc/list'
import { useEffect, useState } from 'react'
import { CircularProgress } from '@rmwc/circular-progress'
function useLoader() {
  const [data, setData] = useState('loading')
  useEffect(() => {
    // Update the document title using the browser API
    // store.fetchNews();
    const fetchData = async () => {
      await store.fetchPackages()
      setData('done')
    }
    fetchData()
  }, [])
  return data
}
function Packages(props) {
  let data = useLoader()
  let list: any = Array.from(store.packages)
  let content = (
    <div>
      <CircularProgress />
    </div>
  )
  if (data === 'done') {
    content = (
      <List>
        {list.map(([key, item]) => (
          <ListItem key={key}>{item.name}</ListItem>
        ))}
      </List>
    )
  }

  return content
}

export default observer(Packages)
