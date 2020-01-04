import store from '../common/Store'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {Button} from '@rmwc/button'
import {CollapsibleList, List, SimpleListItem} from '@rmwc/list'
import styled from 'styled-components'
import {CircularProgress} from '@rmwc/circular-progress'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import {Chip, ChipSet} from '@rmwc/chip'
import {Typography} from '@rmwc/typography'
import '@rmwc/list/collapsible-list.css';
import {Snackbar, SnackbarAction} from '@rmwc/snackbar';
import {Swipeable} from 'react-swipeable';
import {navigate} from '@reach/router'
import SortPanel from './SortPanel'

dayjs.extend(relativeTime)

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
  //background-color: red;
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


const config = {
    trackTouch: true, // track touch input
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
    // delta: 10,                             // min distance(px) before a swipe starts
    // preventDefaultTouchmoveEvent: false,   // preventDefault on touchmove, *See Details*
    //
    // rotationAngle: 0,                      // set a rotation angle
};

function Packages(props) {
    const [open, setOpen] = useState(false);
    let data = useLoader()
    // let list: any = Array.from(store.packages)
    //   let content = <div>hello</div>
    let content = (
        <CenteredFlex>
            <CircularProgress/>
        </CenteredFlex>
    )
    if (data === 'done') {
        content = (<>
                <Snackbar
                    open={open}
                    onClose={evt => setOpen(false)}
                    message="item deleted"
                    action={
                        <SnackbarAction
                            label="Dismiss"
                            onClick={() => console.log('Click Me')}
                        />
                    }
                />
                <Button onClick={() => navigate('comparison')}>compare</Button>
            <List twoLine>
                {store.packagesArray.map(([key, item]) => {
                    // language JavaScript
                    // "language": "Dart",
                    let {
                        downloadsLastMonth,
                        downloadsLastYear,
                        aveMonthly,
                        diff,
                        percent,
                        stargazers_count,
                        created_at,
                        dependents_count,
                        dependent_repos_count
                    } = store.packageInfo(item)

                    // if (item.platform === 'Pub' ) {
                    //
                    // }

                    return (
                        <Swipeable
                            key={key}
                            onSwipedRight={() => {
                                store.deletePackage(item.full_name).then(() =>  setOpen(true))
                                // store.deleteSearchTerm(key).then(x => setOpen(true));
                            }}
                            {...config}>
                        <CollapsibleList key={key}
                                         handle={
                                             <SimpleListItem
                                                 text={item.full_name}
                                                 secondaryText={item.description}
                                                 graphic="favorite"
                                                 metaIcon="chevron_right"
                                             />
                                         }
                                         onOpen={() => console.log('open')}
                                         onClose={() => console.log('close')}
                        >
                            <ChipSet>
                                {stargazers_count && <Chip label="stars"> <Typography style={{color: "magenta"}}
                                                                                use="headline6">{stargazers_count}</Typography>
                                </Chip>}
                                {created_at && <Chip label="created_at"> <Typography style={{color: "magenta"}}
                                                                                     use="headline6">{created_at}</Typography></Chip>}
                                {downloadsLastMonth &&
                                <Chip icon={"cloud_download"} label="LastMonth"> <Typography style={{color: "magenta"}}
                                                                                             use="headline6">{downloadsLastMonth}</Typography></Chip>}
                                {downloadsLastYear &&
                                <Chip icon={"cloud_download"} label="LastYear"> <Typography style={{color: "magenta"}}
                                                                                            use="headline6">{downloadsLastYear}</Typography></Chip>}
                                {aveMonthly &&
                                <Chip icon={"cloud_download"} label="aveMonthly"> <Typography style={{color: "magenta"}}
                                                                                            use="headline6">{aveMonthly}</Typography></Chip>}
                                {diff &&
                                <Chip icon={"cloud_download"} label="diff"> <Typography style={{color: (Math.sign(percent) === 1) ? "green": "red"}}
                                                                                              use="headline6">{diff}</Typography></Chip>}
                                {percent &&
                                <Chip icon={"cloud_download"} label="percent"> <Typography style={{color: (Math.sign(percent) === 1) ? "green": "red"}}
                                                                                        use="headline6">{percent}%</Typography></Chip>}

                                {dependents_count &&
                                <Chip icon={"cloud_download"} label="dependents_count"> <Typography
                                                                                           use="headline6">{dependents_count}</Typography></Chip>}

                                {dependent_repos_count &&
                                <Chip icon={"cloud_download"} label="dependent_repos_count"> <Typography
                                    use="headline6">{dependent_repos_count}</Typography></Chip>}

                            </ChipSet>
                            <Button raised onClick={() => {} }>
                                details
                            </Button>
                            <Button raised onClick={() => window.open(item.github.html_url, '_blank') }>
                                open
                            </Button>
                            <Button raised onClick={() => {store.refreshPackage(item.resolvedRepoName).then()}}>
                                refresh
                            </Button>
                            <Button raised onClick={() => {
                                // store.changeRepo(item.resolvedRepoName)
                                // store.changePackage(item)
                                navigate(`commitStats/${encodeURIComponent( key) }`)}}>
                                commit stats
                            </Button>
                            <Button raised onClick={() => {
                                store.changePackage(item)
                                // store.changeRepo(item.resolvedRepoName)
                                navigate('contributors')}} >Contributors</Button>
                            <Button raised onClick={() => {
                                store.changePackage(item)
                                // store.changeRepo(item.resolvedRepoName)
                                navigate('npmSearch')}} >search in npm</Button>
                        </CollapsibleList>
                        </Swipeable>
                    )
                })}
            </List></>
        )
    }


    return <FullHeight>
        <SortPanel/>

        {content}</FullHeight>
}


export default observer(Packages)
