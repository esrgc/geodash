//PieChart extends Chart

GeoDash.PieChart = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'PieChart'
  , defaults: {
    label: 'label'
    , value: 'value'
    , colors: ["#f00", "#0f0", "#00f"]
    , innerRadius: 10
    , opacity: 1
    , drawX: false
    , drawY: false
    , title: false
    , padding: 10
    , legend: false
    , hover: true
    , arclabels: false
    , class: 'chart-html piechart-svg'
    , formatHover: d3.format(',.0f')
    , formatPercent: d3.format('.2f')
    , labelColor: "#ccc"
  }
  , initialize: function (el, options) {
  }
  , setColors: function(colors){
    this.color = d3.scale.ordinal()
      .range(colors);
  }
  // drawChart: function(){
  //   var self = this;

  //   this.width = (this.options.width === 'auto' || this.options.width === undefined ? parseInt(d3.select(this.el).style('width')) : this.options.width);
  //   this.height = (this.options.height === 'auto' || this.options.width === undefined ? parseInt(d3.select(this.el).style('height')) : this.options.height);
  //   this.width = this.width - this.options.padding*2;
  //   this.height = this.height - this.options.padding*2;
  //   if(this.options.title) {
  //     this.height  = this.height - 30;
  //   }

  //   this.radius = Math.min(this.width, this.height) / 2.2;

  //   this.color = d3.scale.ordinal()
  //     .range(this.options.colors);

  //   this.x = d3.scale.ordinal()
  //     .range([0, this.width-2]);

  //   this.y = d3.scale.linear()
  //     .range([this.height-2, 0]);

  //   this.xAxis = d3.svg.axis()
  //     .scale(this.x)
  //     .orient("bottom")
  //     .tickSize(10,0,0)
  //     .tickFormat(function(d){
  //       return '';
  //     });

  //   this.yAxis = d3.svg.axis()
  //     .scale(this.y)
  //     .orient("left")
  //     //.ticks(0)
  //     .tickSize(10, 0, 0)
  //     .tickFormat(function(d){
  //       return '';
  //     });

  //   this.arc = d3.svg.arc()
  //     .outerRadius(this.radius)
  //     .innerRadius(this.options.innerRadius);

  //   this.pie = d3.layout.pie()
  //     .sort(null)
  //     .value(function(d) { return d[self.options.value]; });

  //   this.formatHover = d3.format(',.0f');
  //   this.formatPercent = d3.format('.2f');

  //   this.svg = d3.select(this.el).append("svg")
  //     .attr("width", this.width)
  //     .attr("height", this.height)
  //     .attr("class", "piechart-svg")
  //     .append("g")
  //       .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

  //   if(this.options.hover){
  //     d3.select(this.el).append('div').attr('class', 'hoverbox');
  //   }

  //   if(this.options.drawX){
  //     this.svg.append("g")
  //       .attr("class", "x axis")
  //       .attr("transform", "translate(" + (this.width/2)*-1 + "," + 0 + ")")
  //       .call(this.xAxis);
  //     this.svg.select('.x.axis').selectAll(".tick")
  //       .attr("transform", "translate(0,-5)");
  //   }


  //   if(this.options.drawY){
  //     this.svg.append("g")
  //       .attr("class", "y axis")
  //       .attr("transform", "translate(" + 0 + "," + (this.height/2)*-1 + ")")
  //       .call(this.yAxis);
  //     this.svg.select('.y.axis').selectAll(".tick")
  //       .attr("transform", "translate(5,0)");
  //   }

  //   if(this.options.legend) {
  //     d3.select(this.options.legend).append('svg');
  //   }
  // },
  , update: function(data){
    var self = this

    var radius = Math.min(this.width, this.height) / 2

    this.arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(this.options.innerRadius)

    this.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d[self.options.value] })

    this.color = d3.scale.ordinal()
       .range(this.options.colors)

    this.total = 0
    data.forEach(function(d) {
      d[self.options.value] = +d[self.options.value]
      self.total += +d[self.options.value]
    })

    var g = this.svg.selectAll(".arc")
        .data(this.pie(data))

    g.select("path").transition()
      .style("fill", function(d) { return self.color(d.data[self.options.label]) })
      .attr("d", this.arc)

    g.enter().append("g")
      .attr("class", "arc")
        .append("path")
        .attr("d", this.arc)
        .style("fill", function(d) { return self.color(d.data[self.options.label]) })
        .style("fill-opacity", this.options.opacity)
        .on('mouseover', function(d,i){
          d3.select(this).style('fill-opacity', 1);
          if(self.options.hover) {
            var label = d.data[self.options.label];
            var total = self.options.formatHover(d.value);
            var percent = self.options.formatPercent((d.value/self.total)*100);
            self.container.select('.hoverbox').html(label + ": " + total + ' (' + percent + '%)');
            self.container.select('.hoverbox').style('display', 'block');
          }
        })
        .on('mouseout', function(d,i){
          self.container.select('.hoverbox').html('');
          self.container.select('.hoverbox').style('display', 'none');
          d3.select(this).style('fill-opacity', self.options.opacity  );
        });

    g.exit().remove()

    if(this.options.arclabels) {
      var t = self.svg.selectAll(".arc-text")
            .data(this.pie(data))

      t.select("text")
        .attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")"; })
        .text(function(d) { return d.data[self.options.label] + ' (' + d.value + ')' })

      t.enter().append("g")
        .attr("class", "arc-text")
        .append("text")
        .attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")" })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("fill", self.options.labelColor)
        .text(function(d) { return d.data[self.options.label] + ' (' + d.value + ')' })

      t.exit().remove()
    }

    if(this.options.legend) {
      var lWidth = parseInt(d3.select(this.options.legend).style('width'));
      var block = {width: 10, height: 10, padding: 5};
      var container = d3.select(this.options.legend).select('svg');
      var legend = container.selectAll(".legend-item")
          .data(this.color.domain().slice());

      legend.select(".legend-item").select("text").text(function(d) { return d; });

      var legenditem = legend.enter().append("g")
          .attr("class", "legend-item")
          .attr("transform", function(d, i) { return "translate(0," + i * (block.height + block.padding) + ")"; });

      legenditem.append("rect")
        .attr("x", 0)
        .attr("width", block.width)
        .attr("height", block.height)
        .style("fill", this.color);

      legenditem.append("text")
        .attr("x", (block.width + block.padding))
        .attr("y", 4)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });
    }
  }
});