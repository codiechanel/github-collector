import * as React from 'react'
import {observer} from 'mobx-react'
import {useRef, useState} from "react";
import {useEffect} from "react";
import * as d3  from 'd3'
import { line, curveBasis }  from 'd3'
import store from "../common/Store";

function useLoader() {
    const [options, setOptions] = useState(null);
    // const [data, setData] = useState('loading')
    useEffect(() => {
        // Update the document title using the browser API
        // store.fetchNews();
        const fetchData = async () => {
            let data = await store.fetchCommitStats()
            setOptions(data)
        }
        fetchData()
    }, [])
    return options
}

function renderLineChart(svg, data ) {
    let domainMinMax = d3.extent(data, d => {
        return d.commits;
    })
    let innerHeight = 350
    let yScale = d3
        .scaleLinear()
        .domain(domainMinMax)
        // .domain([ratingMinMax[1], 0])
        .range([innerHeight, 20])
        .nice()
    console.log('domainMinMax', domainMinMax,innerHeight,  innerWidth)
    let margin = {
        top: 10, right: 40, bottom: 40, left: 30
    }
    let xScale = d3
        .scalePoint()
        .domain(data.map((d, i) => i))
        .range([margin.left, innerWidth])

    const g = d3
        .select(svg)
        .append('g')
        // .attr('background-color', 'pink')
        // .attr('fill', 'pink')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    let yAxis = d3.axisLeft(yScale)  .tickSize(-innerWidth)
        .tickPadding(10);
    let xAxis = d3.axisBottom(xScale) .tickSize(-innerHeight)
        .tickPadding(15);
    g.append('g')
        .attr("class", "axisBottom")
        .call(xAxis)
        .attr('transform', `translate(${0},${innerHeight + 10})`);
    g.append('g')
        .attr("class", "axisLeft")
        .call(yAxis)
        .attr('transform', `translate(${0},${0})`);

    const lineGenerator = line()
        .x( (d, i) => xScale(i))
        .y(d => yScale(d.commits))
        .curve(curveBasis);

    g.append('path')
        .attr('class', 'line-path')
        .attr('d', lineGenerator(data));
    // g.selectAll("circle")
    //     .data(result)
    //     .enter()
    //     .append("circle")
    //     // .attr('cx', (d, i) => (i + 1) * distance)
    //     .attr('cx', (d, i) => xScale(i))
    //     .attr('cy', d => yScale(d.commits))
    //     .attr('r', 5);
}

function CommitStats(props) {
    const inputEl = useRef(null);
    let data = useLoader()
    if (data) {
        let result = [];
        // @ts-ignore
        data.all.slice(0, 20).forEach((x, i) => {

            result.push({label: `week ${i}`, commits: x});
        });
        renderLineChart(inputEl.current, result)

    }

    return <div>
        <svg ref={inputEl} height={innerHeight} width={innerWidth} fill="white">

        </svg>
    </div>

}

export default observer(CommitStats)