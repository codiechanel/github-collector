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
const SuggestionResults = observer(props => {
    const [content, setContent] = useState(null);
    let inputValue = store.selectedPackage.name;
    let platform = store.platform
    useEffect(() => {
        console.log('usefew')
        const fetchData = async (keyword = '') => {
            if (keyword.trim() == '' || keyword.length < 3) return [];
            let url
            // if (store.platform === 'Github') {
            url = `https://api.npms.io/v2/search/suggestions?q=${keyword}`;
            // }
            // else {
            //      url = `https://api.npms.io/v2/search/suggestions?q=${keyword}`;
            // }


            // let url = `   https://libraries.io/api/search?q=${keyword}&api_key=f0e12ad80d97d700fb1c9926fae2f77b&platforms=${store.platform}`;


            let {data} = await axios.get(url)
            console.log(data)
            // if (store.platform === 'Github') {
            //     data = data.items
            // }
            // data = data.items
            const result = []
            for (const x of data) {
                result.push(x)
            }

            let newContent = result.map((option, i) => {
                let { name, description, score } =processNpm(option)

                return (
                    <SimpleListItem
                        key={name+i}
                        text={name}
                        meta={score}
                        secondaryText={description}
                        onClick={() => {
                            store.updatePackageWithNpm(name)
                            // if (store.allPackages.get(name)) {
                            //     // already exist
                            //     console.log("already exist");
                            //     // store.refreshPackage(option).then(res => {});
                            // } else {
                            //
                            //         // store.addPackage(option).then(res => {});
                            //
                            //
                            // }
                            window.history.back()
                        }}>

                    </SimpleListItem>
                ) } )


            setContent(newContent);
        };
        fetchData(inputValue).then();
    }, [inputValue, platform]);


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
    let name = option.name
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
function NpmSearch(props) {
    return (
        <div>
            {/*<SuggestionBox />*/}
            <SuggestionResults />
        </div>
    );

}

export default  observer(NpmSearch)