import {observer} from "mobx-react";
import * as React from 'react'
import store from "../common/Store";
import { TextField } from '@rmwc/textfield';
import { List, ListItem } from '@rmwc/list';
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
const SuggestionResults = observer(props => {
    const [options, setOptions] = useState([]);
    let inputValue = store.keyword;
    useEffect(() => {
        const fetchData = async (keyword = '') => {
            if (keyword.trim() == '' || keyword.length < 3) return [];

            let url = `https://api.npms.io/v2/search/suggestions?q=${keyword}`;

            const {data} = await axios.get(url)
            const result = []
            for (const x of data) {
                result.push(x.package.name)
            }


            setOptions(result);
        };
        fetchData(inputValue).then();
    }, [inputValue]);
    console.log(options);

    return (
        <List>
            {options.map(option => (
                <ListItem
                    key={option}
                    onClick={() => {
                        if (store.allPackages.get(option)) {
                            // already exist
                            console.log("already exist");
                            // store.refreshPackage(option).then(res => {});
                        } else {
                            console.log("addPackage");
                            store.addPackage(option).then(res => {});
                        }
                        window.history.back()
                    }}>
                    {option}
                </ListItem>
            ))}
        </List>
    );
});
function SearchPage(props) {
    return (
        <div>
            <SuggestionBox />
            <SuggestionResults />
        </div>
    );

}

export default  observer(SearchPage)