
import * as React from 'react'
import {observer} from 'mobx-react'
import {useRef, useState} from "react";
import {useEffect} from "react";
import store from "./Store";

function useLoader(full_name) {
    const [options, setOptions] = useState(null);
    // const [data, setData] = useState('loading')
    useEffect(() => {
        // Update the document title using the browser API
        // store.fetchNews();
        const fetchData = async () => {
            let data = await store.fetchCommitStats(full_name)
            setOptions(data)
        }
        fetchData()
    }, [])
    return options
}
