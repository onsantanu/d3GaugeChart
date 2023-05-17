

export class GaugeChart {
  CenterX = 0;
  CenterY = 0;
  TopX = 0;
  TopY = 0;
  LeftX = 0;
  LeftY = 0;
  RightX = 0;
  RightY = 0;
  svg = null;
  arc = null;
  needleG = null;
  chartName = '';
  ColorsPercent = null;
  chartHeight = null;
  chartWidth = null;
  constructor(input) {
    this.ChartColor = input.ChartColor || "#143759";
    this.innerRadius = input.innerRadius || 50;
    this.outerRadius = input.outerRadius || 60;
    this.TextColor = input.TextColor || "#000000";
    this.NeedleColor = input.NeedleColor || "black";
    this.margin = {"Left": 1, "Right": 1, "Top": 1, "Bottom": 1};
    if (input.margin != undefined) {
      this.margin.Left = input.margin.Left || 1;
      this.margin.Right = input.margin.Right || 1;
      this.margin.Top = input.margin.Top || 1;
      this.margin.Bottom = input.margin.Bottom || 1;
    }
    this.NeedleHeight = input.NeedleHeight || this.outerRadius;
    this.NeedleRadius = input.NeedleRadius || 3;
    this.ColorPerPercent = input.ColorPerPercent;
    this.id = input.id;
    this.d3 = input.d3;

  }

  CreateGaugeChart() {
    this.chartHeight = this.outerRadius + (this.margin.Top + this.margin.Bottom) + (this.NeedleRadius * 2);
    this.chartWidth = (this.outerRadius * 2) + (this.margin.Left + this.margin.Right);

    this.chartName = "Gauge_" + this.id.replace(/\s+/g, "");

    this.svg = this.d3.select("#" + this.id)
      .append("svg")
      .attr("id", this.chartName)
      .attr("height", this.chartHeight)
      .attr("width", this.chartWidth)
      .append("g")
      .attr("transform", "translate(" + (this.margin.Left + this.outerRadius) + "," + (this.margin.Top + this.outerRadius) + ")");

    this.d3.select("#" + this.chartName).append("g")
      .attr("transform", "translate(" + (this.margin.Left + this.outerRadius) + "," + (this.margin.Top) + ")");
    this.arc = this.d3.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius).startAngle(Math.PI / 2).endAngle(-Math.PI / 2);

    this.svg.append("path")
      .attr("d", this.arc)
      .attr("class", "GaugeArc")
      .attr("fill", this.ChartColor)
      .attr("stroke-width", 1)
      .attr("stroke", this.ChartColor);

    this.needleG = this.svg.append("g")
      .attr("tranform", "translate(" + (this.margin.Left + this.outerRadius) + "," + (this.margin.Top + this.outerRadius + this.NeedleRadius) + ")")
      .attr('class', 'needle');

    let thetaRad = percToRad(0) / 2;

    this.TopX = this.CenterX - this.NeedleHeight * Math.cos(thetaRad);
    this.TopY = this.CenterY - this.NeedleHeight * Math.sin(thetaRad);

    this.LeftX = this.CenterX - this.NeedleRadius * Math.cos(thetaRad - Math.PI / 2);
    this.LeftY = this.CenterY - this.NeedleRadius * Math.sin(thetaRad - Math.PI / 2);

    this.RightX = this.CenterX - this.NeedleRadius * Math.cos(thetaRad + Math.PI / 2);
    this.RightY = this.CenterY - this.NeedleRadius * Math.sin(thetaRad + Math.PI / 2);

    this.needleG.append("path").attr('d', "M " + this.LeftX + ' ' + this.LeftY + ' L ' + this.TopX + ' ' + this.TopY + ' L ' + this.RightX + ' ' + this.RightY);

    this.needleG.append("circle").attr("r", this.NeedleRadius + 2).attr("fill", this.NeedleColor);


  }

  updateGaugeChart(percent) {
    var current = this;
    this.ColorsPercent = this.ColorPerPercent;
    this.svg.transition().ease(this.d3.easeLinear).duration(1000).selectAll('.needle').tween('progress',  () => {
      return (percentOfPercent) => {
        let progress;
        progress = (percentOfPercent * percent);
        let thetaRad = percToRad(progress) / 2;

        this.CenterX = 0;
        this.CenterY = 0;

        this.TopX = this.CenterX - this.NeedleHeight * Math.cos(thetaRad);
        this.TopY = this.CenterY - this.NeedleHeight * Math.sin(thetaRad);

        this.LeftX = this.CenterX - this.NeedleRadius * Math.cos(thetaRad - Math.PI / 2);
        this.LeftY = this.CenterY - this.NeedleRadius * Math.sin(thetaRad - Math.PI / 2);

        this.RightX = this.CenterX - this.NeedleRadius * Math.cos(thetaRad + Math.PI / 2);
        this.RightY = this.CenterY - this.NeedleRadius * Math.sin(thetaRad + Math.PI / 2);
        this.d3.select("#" + this.chartName).select('.needle').select("path").attr('d', "M " + this.LeftX + ' ' + this.LeftY + ' L ' + this.TopX + ' ' + this.TopY + ' L ' + this.RightX + ' ' + this.RightY);

        const color = this.selectColor(progress * 100);

        this.d3.select("#" + this.chartName).select('.GaugeArc').attr('fill', color).attr("stroke", color);

      };
    });
  }

  selectColor(progress) {
    var keys = Object.keys(this.ColorsPercent);

    for (var i = 0; i < keys.length; i++) {
      if ((parseInt(progress) >= (this.ColorsPercent[keys[i]].start)) && (parseInt(progress) <= (this.ColorsPercent[keys[i]].end))) {
        return keys[i];
      }

    }
  }


}


const percToDeg = function (perc) {
  return perc * 360;
};

const percToRad = function (perc) {
  return degToRad(percToDeg(perc));
};

const degToRad = function (deg) {
  return deg * Math.PI / 180;
};



