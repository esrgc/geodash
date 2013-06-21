//BarChart extends Chart
GeoDash.BarChart = GeoDash.Class({
    className: 'BarChart',
    extend: GeoDash.Chart,
    initialize: function (el, options) {
        this.defaults = {
            x: 'x',
            y: 'y',
            barColor: '#f00',
            opacity: 0.8,
            drawX: true,
            percent: false,
            title: false
        };
    },
    drawChart: function () {
        var self = this;
        var padding = 10;
        this.margin = { top: 20, right: 10, bottom: 20, left: 40 };
        this.width = (this.options.width === 'auto' || this.options.width === undefined ? parseInt(d3.select(this.el).style('width')) : this.options.width) - this.margin.left - this.margin.right,
        this.height = (this.options.height === 'auto' || this.options.height === undefined ? parseInt(d3.select(this.el).style('height')) : this.options.height) - this.margin.top - this.margin.bottom;
        if (this.options.title) {
            this.height = this.height - 21;
        }
        this.formatPercent = d3.format(".0%");

        this.x = d3.scale.ordinal()
            .rangeRoundBands([0, this.width], 0.05, 0.5);

        this.y = d3.scale.linear()
            .range([this.height, 0]);

        this.xAxis = d3.svg.axis()
          .scale(this.x)
          .orient("bottom")
          .tickFormat(function (d) {
              return '';
          });

        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .orient("left")
            .ticks(4)
            .tickSize(this.width * -1, 0, 0);

        if (this.options.percent) {
            this.yAxis.tickFormat(this.formatPercent);
        }

        this.svg = d3.select(this.el).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    },
    update: function (data) {
        var self = this;

        var y = this.options.y;
        var x = this.options.x;
        data.forEach(function (d) {
            d[y] = +d[y];
        });

        this.x.domain(data.map(function (d) { return d[x]; }));
        this.y.domain([0, d3.max(data, function (d) { return d[y]; })]);

        if (this.options.drawX) {
            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
                .call(this.xAxis);
        }

        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);

        this.svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return self.x(d[x]); })
            .attr("width", self.x.rangeBand())
            .attr("y", function (d) { return self.y(d[y]); })
            .attr("height", function (d) { return self.height - self.y(d[y]); })
            .style("fill-opacity", this.options.opacity)
            .style("fill", this.options.barColor)
            .on('mouseover', function (d, i) {
                d3.select(this).style('fill-opacity', 1);
            }).on('mouseout', function (d, i) {
                d3.select(this).style('fill-opacity', self.options.opacity);
            });
    }
});
