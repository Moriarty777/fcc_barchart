let url ="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"


fetch('./gdp.json')
.then(data => data.json())
.then(data =>
{

    let width = 800
    let height = 600
    let padding = 40
    
    const barHeight = 
    d3.scaleLinear()
    .domain([0, d3.max(data, (item) => {
        return item[1]
    })])
    .range(0,height - (2* padding));
    

    const svg = d3.select('#canvas')
    .attr('height',height)
    .attr('width', width)

    const heightScale = d3.scaleLinear()
                    .domain([0,d3.max(data, (item) => {
                        return item[1]
                    })])
                    .range([0, height - (2*padding)])

    const xScale = d3.scaleLinear()
                    .domain([0, data.length -1])
                    .range([padding, width - padding])

    const datesArray = data.map((item) => {
        return new Date(item[0])
    })


    const xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width-padding])

    const yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[1])])
                    .range([height - padding, padding ])


    // Define the tooltip variable
    const tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden')
    .style('position', 'absolute')
    .style('background-color', 'rgba(0, 0, 0, 0.8)')
    .style('color', '#fff')
    .style('padding', '8px')
    .style('font-size', '12px')
    .style('border-radius', '4px');

    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height-padding) + ')')

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')



    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / data.length)
        .attr('data-date',  d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('height', (item) => 
            heightScale(item[1])
        )
        .attr('x', (item, index) => {
            return xScale(index)
        })
        .attr('y', (item) => {
            return (height - padding) - heightScale(item[1])
        })
        .on('mouseover', (item) => {
            tooltip.transition()

            const year = new Date(item[0]).getFullYear();
            const quarter = Math.ceil((new Date(item[0]).getMonth() + 1) / 3);
            const gdp = item[1].toFixed(2);

            tooltip
            .style('visibility', 'visible')
            .html(`${year} Q${quarter}<br/>$${gdp} Billions`);

            document.querySelector('#tooltip').setAttribute('data-date', item[0]);
        })        
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })   


}
)