import {observer} from "mobx-react";
import * as React from 'react'
import store from "../common/Store";
import { TextField } from '@rmwc/textfield';
import { List, ListItem, SimpleListItem } from '@rmwc/list';
import {useEffect, useState} from "react";
import axios from 'axios';

const SuggestionBox = observer(props => {
    return (
        <TextField
            value={store.keyword}
            label="standard..."
            onChange={e => (store.keyword = e.currentTarget.value)}
        />
    );
});
// Hook
function useDebounce(value, delay) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {
            // Update debounced value after delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay] // Only re-call effect if value or delay changes
    );

    return debouncedValue;
}
const SuggestionResults = observer(props => {
    const [content, setContent] = useState(null);
    let inputValue = store.keyword;
    const debouncedSearchTerm = useDebounce(inputValue, 500);
    let platform = store.platform
    useEffect(() => {
        console.log('usefew')
        const fetchData = async (keyword = '') => {
            if (keyword.trim() == '' || keyword.length < 3) return [];
            let config = {
                params : {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    // @ts-ignore
                    client_secret:process.env.GITHUB_CLIENT_SECRET
                }
            }
            let url
            // if (store.platform === 'Github') {
                 url = `https://api.github.com/search/repositories?q=${encodeURIComponent(keyword)}&sort=stars&order=desc`

            // }
            // else {
            //      url = `https://api.npms.io/v2/search/suggestions?q=${keyword}`;
            // }




            let {data} = await axios.get(url, config)
            // if (store.platform === 'Github') {
            //     data = data.items
            // }
            data = data.items
            const result = []
            for (const x of data) {
                result.push(x)
            }

            let newContent = result.map((option, i) => {
                let { name, description, score } =processGithub(option)

                return (
                    <SimpleListItem
                        key={name+i}
                        text={name}
                        meta={score}
                        secondaryText={description}
                        onClick={() => {
                            if (store.allPackages.get(name)) {
                                // already exist
                                console.log("already exist");
                                // store.refreshPackage(option).then(res => {});
                            } else {

                                    store.addPackage(option).then(res => {});


                            }
                            window.history.back()
                        }}>

                    </SimpleListItem>
                ) } )


            setContent(newContent);
        };
        fetchData(debouncedSearchTerm).then();
    }, [debouncedSearchTerm, platform]);


    return (
        <List twoLine>
            {content}
        </List>
    );
});

function processData(option, platform) {
    if (platform === 'Github') {
        return processGithub(option)

    }
    else {
        return processNpm(option)
    }

}

function processGithub(option) {
    let name = option.full_name
    let description = option.description

    let score =  option.score.toFixed(2);

    return {name, description, score}

}

function processNpm(option) {
    let name = option.package.name
    let description = option.package.description

    let score =  option.score.final.toFixed(2);

    return {name, description, score}

}
function SearchPage(props) {
    return (
        <div>
            <SuggestionBox />
            <SuggestionResults />
        </div>
    );

}

export default  observer(SearchPage)