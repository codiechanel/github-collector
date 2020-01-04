import * as React from 'react'
import {observer} from 'mobx-react'
import store from "../common/Store";
import {List, SimpleListItem} from "@rmwc/list";
import '@rmwc/avatar/avatar.css';
import {Avatar} from '@rmwc/avatar'
import {useAsync} from 'react-use';
import AppBar from "./AppBar";


function Contributors(props) {
    let full_name  = props.full_name
    // let data = useLoader()
    const state = useAsync(async () => {
        // const response = await fetch(url);
        // const result = await response.text();
        let result = await store.fetchContributors(full_name)
        return result
    }, [full_name]);
    return <div>
        <AppBar title="Contributors" showBackButton></AppBar>
        <List twoLine>
            {state.loading
                ? <div>Loading...</div>
                : state.error
                    ? <div>Error: {state.error.message}</div>
                    :   state.value.map((item) => {
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
                        })
            }

        </List>
    </div>

}

export default observer(Contributors)