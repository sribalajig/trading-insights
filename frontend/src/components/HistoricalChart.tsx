import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { HistoricalData } from '../models/HistoricalData';
import './HistoricalChart.css';

interface HistoricalChartProps {
  data: HistoricalData | null;
  loading?: boolean;
  error?: string | null;
}

export function HistoricalChart({ data, loading, error }: HistoricalChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !data.data || data.data.length === 0 || !svgRef.current || !containerRef.current) {
      return;
    }

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const container = containerRef.current;
    const width = container.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    const dataPoints = data.data.map((d) => ({
      date: parseDate(d.date.split('T')[0]) || new Date(d.date),
      close: d.close,
    }));

    // Set up scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataPoints, (d) => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataPoints, (d) => d.close) as [number, number])
      .nice()
      .range([height, 0]);

    // Create line generator
    const line = d3
      .line<{ date: Date; close: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.close))
      .curve(d3.curveMonotoneX);

    // Add axes
    const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(d3.timeFormat('%b %d') as any);
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => `$${d}`);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    g.append('g').call(yAxis);

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(6)
          .tickSize(-height)
          .tickFormat((_d: any) => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.2);

    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat((_d: any) => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.2);

    // Add line
    g.append('path')
      .datum(dataPoints)
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots
    g.selectAll('.dot')
      .data(dataPoints)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.date))
      .attr('cy', (d) => yScale(d.close))
      .attr('r', 3)
      .attr('fill', '#2563eb')
      .style('cursor', 'pointer');

    // Add tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('font-size', '12px');

    g.selectAll('.dot')
      .on('mouseover', function (event: any, d: unknown) {
        const dataPoint = d as { date: Date; close: number };
        d3.select(this).attr('r', 5);
        tooltip
          .style('opacity', 1)
          .html(
            `<div>${d3.timeFormat('%b %d, %Y')(dataPoint.date)}</div><div>$${dataPoint.close.toFixed(2)}</div>`
          )
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 3);
        tooltip.style('opacity', 0);
      });

    // Cleanup function
    return () => {
      tooltip.remove();
    };
  }, [data]);

  if (loading) {
    return (
      <div className="historical-chart-container">
        <div className="chart-loading">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historical-chart-container">
        <div className="chart-error">Error: {error}</div>
      </div>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="historical-chart-container">
        <div className="chart-no-data">No historical data available</div>
      </div>
    );
  }

  return (
    <div className="historical-chart-container" ref={containerRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

