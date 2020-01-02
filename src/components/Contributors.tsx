import * as React from 'react'
import {observer} from 'mobx-react'
import {useState} from "react";
import {useEffect} from "react";
import store from "../common/Store";
import {List, SimpleListItem} from "@rmwc/list";
import '@rmwc/avatar/avatar.css';
import {Avatar} from '@rmwc/avatar'

function useLoader() {
    const [options, setOptions] = useState([]);
    // const [data, setData] = useState('loading')
    useEffect(() => {
        // Update the document title using the browser API
        // store.fetchNews();
        const fetchData = async () => {
            let data = await store.fetchContributors()
            // @ts-ignore
            setOptions(data)
        }
        fetchData()
    }, [])
    return options
}

function Contributors(props) {
    let data = useLoader()
    return <div>
        <List twoLine>
            {data.map((item) => {
                // html_url
                let avatar = <Avatar
                    src={item.avatar_url}
                    // size="xsmall"

                />
                return <SimpleListItem key={item.login}
                                       text={item.login}
                                       secondaryText={item.contributions}
                                       graphic={avatar}
                                       metaIcon="chevron_right"
                                       onClick={() => window.open(item.html_url, '_blank') }
                />
            })}
        </List>
    </div>

}

export default observer(Contributors)