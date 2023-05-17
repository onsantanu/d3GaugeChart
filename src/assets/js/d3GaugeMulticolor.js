'use strict';

const percentToDegree = p => p * 360;

const degreeToRadian = d => d * Math.PI / 180;

const percentToRadian = p => degreeToRadian(percentToDegree(p));

class Needle {
  constructor(props) {
    this.svg = props.svg;
    this.group = this.svg.append('g');
    this.len = props.len;
    this.radius = props.radius;
    this.x = props.x;
    this.y = props.y;
    this.d3 = props.d3;
  }

  render() {
    this.group.attr('transform', `translate(${this.x},${this.y})`)
    this.group
      .append('circle')
      .attr('class', 'c-chart-gauge__needle-base')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.radius);

    this.group
      .append('path')
      .attr('class', 'c-chart-gauge__needle')
      .attr('d', this._getPath(0));
  }

  animateTo(p) {
    this.group
      .transition()
      .ease(this.d3.easeElasticIn)
      .duration(3000)
      .select('path')
      .tween('progress', () => {
        const self = this;
        const lastP = this.lastP || 0;
        return function(step) {
          const progress = lastP + step * (p - lastP);
          this.d3.select(this)
            .attr('d', self._getPath(progress))
        };
      })
      .each('end', () => this.lastP = p);
  }

  _getPath(p) {
    const thetaRad = percentToRadian(p / 2),
      centerX = 0,
      centerY = 0,
      topX = centerX - this.len * Math.cos(thetaRad),
      topY = centerY - this.len * Math.sin(thetaRad),
      leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2),
      leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2),
      rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2),
      rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);

    return `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`;
  }
}

export class GaugeChart {
  constructor(props) {
    this.svg = props.svg;
    this.d3 = props.d3;
    this.group = this.svg.append('g');
    this.outerRadius = props.outerRadius;
    this.innerRadius = props.innerRadius;
    this.width = this.outerRadius * 2;
    this.height = this.outerRadius * 1.2;

    this.needle = new Needle({
      svg: this.svg,
      len: this.outerRadius * 0.65,
      radius: this.innerRadius * 0.15,
      x: this.outerRadius,
      y: this.outerRadius,
      d3: this.d3
    });
  }

  render() {
    const gradient = this.svg.append('defs')
      .append('linearGradient')
      .attr('id', 'c-chart-gauge__gradient');
    const arc = this.d3.arc();

    this.svg
      .attr('width', this.width)
      .attr('height', this.height);

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('class', 'c-chart-gauge__gradient-stop1');
    gradient
      .append('stop')
      .attr('offset', '33%')
      .attr('class', 'c-chart-gauge__gradient-stop2');
    gradient
      .append('stop')
      .attr('offset', '66%')
      .attr('class', 'c-chart-gauge__gradient-stop3');
    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('class', 'c-chart-gauge__gradient-stop4');

    arc
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    this.group
      .attr("width", this.width)
      .attr("height", this.height)
      .append("path")
      .attr("d", arc)
      .attr("fill", "url(#c-chart-gauge__gradient)")
      .attr("transform", `translate(${this.outerRadius},${this.outerRadius})`);

    this.needle.render();
  }

  animateTo(p) {
    this.needle.animateTo(p);
  }
}
