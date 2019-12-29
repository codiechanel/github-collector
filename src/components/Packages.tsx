import store from '../common/Store'
import * as React from 'react'
import { observer } from 'mobx-react'
import { List, ListItem } from '@rmwc/list'
import { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
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
export const FullHeight = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`
export const CenteredFlex = styled.div`
  display: flex;
  background-color: red;
  /* align-items: center;
  justify-content: center; */

  flex: 1;
  /* height: 100%; */
  flex-direction: column;
`
export const Box = styled.div`
  height: 100px;
  max-height: 100px;
  width: 100px;
`
function Packages(props) {
  let data = useLoader()
  let list: any = Array.from(store.packages)
  //   let content = <div>hello</div>
  let content = (
    <CenteredFlex>
      <CircularProgress />
    </CenteredFlex>
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

  return <FullHeight> {content}</FullHeight>
}

export default observer(Packages)
