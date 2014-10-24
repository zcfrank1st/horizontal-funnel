/**
 * Created by zcfrank1st on 10/24/14.
 */
angular
    .module('myd3', [])
    .directive('hFunnel',function () {
        return {
            restrict: 'E',
            template: '<svg width="900" height="400"></svg>',
            replace: true,
            scope: {
                funnel: '=demo'
            },
            link: function (scope, ele, attr){
                var width = 900;
                var height = 400;
                var padding = 100;

                var title = scope.funnel.name + '(UV)';
                var sub_title = scope.funnel.headers[0].label + scope.funnel.headers[0].value;


                // 真实数据构造
                var data_array = [];
                var name_array = [];
                var rate_array = [];
                var num_array = [];

                for (var i = 0; i <= scope.funnel.nodes.length -1; i++) {
                    data_array.push({
                        uv: scope.funnel.nodes[i].uv,
                        pv: scope.funnel.nodes[i].pv,
                        visits: scope.funnel.nodes[i].visits
                    });
                    name_array.push(scope.funnel.nodes[i].name);
                }

                for (var j = 1; j <= scope.funnel.nodes.length -1; j++) {
                    rate_array.push(scope.funnel.nodes[j].transferRate);
                    num_array.push(scope.funnel.nodes[j][scope.funnel.ratekey]);
                }



                var tip = d3.tip().html(function (d) {
                    return "<div class='first-tooltip-board'>" +
                        "<div class='hv-center-title'>PV</div>" +
                        "<div class='hv-center-val'>" + d.pv + "</div>" +
                        "</div>" +
                        "<div class='middle-tooltip-board'>" +
                        "<div class='hv-center-title'>UV</div>" +
                        "<div class='hv-center-val'>" + d.uv +"</div>" +
                        "</div>" +
                        "<div class='last-tooltip-board'>" +
                        "<div class='hv-center-title'>Vistis</div>" +
                        "<div class='hv-center-val'>" + d.visits + "</div>" +
                        "</div>" +
                        "<div class='triangle'></div>";
                });

                var virtual_count = 2 * data_array.length - 1;
                var arrow_count = data_array.length - 1;
                var arrow_data_arr = [];
                for (var i = 0; i < arrow_count ; i++) {
                    arrow_data_arr.push(i)
                }
                var constant = [1,2,3];

                var rateValues = [];
                for (var k = 0; k <= data_array.length - 1; k++) {
                    rateValues.push(parseInt(data_array[k][scope.funnel.ratekey]));
                }
                var scale = d3.scale.linear()
                    .domain([d3.min(rateValues), d3.max(rateValues)])
                    .range([height - 100,(height - 50) / 4 + 50]);

                var svg = d3.select('svg');
                svg.call(tip);

                var lines = svg
                    .selectAll('g')
                    .data([1,2,3,4])
                    .enter()
                    .append('line');

                var rects = svg
                    .selectAll('g')
                    .data(data_array)
                    .enter()
                    .append('rect');

                var poly_arrows = svg
                    .selectAll('g')
                    .data(arrow_data_arr)
                    .enter()
                    .append('polyline');

                var label = svg
                    .selectAll('g')
                    .data(name_array)
                    .enter()
                    .append('text');

                var rate_details = svg
                    .selectAll('g')
                    .data(rate_array)
                    .enter()
                    .append('text');

                var num_details = svg
                    .selectAll('g')
                    .data(num_array)
                    .enter()
                    .append('text');

                var side_details = svg
                    .selectAll('g')
                    .data(constant)
                    .enter()
                    .append('text');

                svg
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', width/2)
                    .attr('y', 25)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "25px")
                    .text(title);

                svg
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', width/2)
                    .attr('y', 55)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "20px")
                    .text(sub_title);

                lines
                    .attr('x1', padding / 2)
                    .attr('y1', function (d) {
                        return d * ((height - 50) / 4)
                    })
                    .attr('x2', width - padding / 2)
                    .attr('y2', function (d) {
                        return d * ((height - 50) / 4)
                    })
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1);

                rects
                    .attr('x', function (d, index) {
                        return padding + (2 * index) * (width - 2 * padding) / virtual_count
                    })
                    .attr('y', function (d) {
                        return scale(parseInt(d[scope.funnel.ratekey]));
                    })
                    .attr('width', (width - 2 * padding) / virtual_count)
                    .attr('height', function (d) {
                        return height - scale(parseInt(d[scope.funnel.ratekey])) - 50;
                    })
                    .style("fill", "purple")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                poly_arrows
                    .attr('points', function (d) {
                        var y_axis = [];
                        for (var j = 1; j <= 3; j ++) {
                            y_axis.push(height * 3 / 4 + j * height / 30 - 50);
                        }
                        if (d === 0) {
                            var x1 = x2 = 3/2 * (width - 2 * padding) / virtual_count + padding - (width - 2 * padding) / virtual_count / 10;
                            var x3 = x1 + 15;
                        } else {
                            var x1 = x2 = (d * 2 + 3/2) * (width - 2 * padding) / virtual_count + padding - (width - 2 * padding) / virtual_count / 10;
                            var x3 = x1 + 15;
                        }
                        var points =  x1 + ',' + y_axis[0] + ' '
                            + x3 + ',' + y_axis[1] + ' '
                            + x2 + ',' + y_axis[2];
                        return points;
                    })
                    .attr('stroke', "rgba(159, 0, 197,0.75)")
                    .attr('stroke-width', 6)
                    .attr('fill', 'none');

                label
                    .attr('text-anchor', 'middle')
                    .attr('x', function (d, index) {
                        if (index === 0 ) {
                            return padding + (width - 2 * padding) / virtual_count / 2
                        } else {
                            return padding + (1/2 + 2 * index) * (width - 2 * padding) / virtual_count
                        }
                    })
                    .attr('y', 375)
                    .text(function (d) {
                        return d
                    });

                num_details
                    .attr('text-anchor', 'middle')
                    .attr('x', function (d, index) {
                        if (index === 0) {
                            return 3/2 * (width - 2 * padding) / virtual_count + padding - (width - 2 * padding) / virtual_count / 10 + 5;
                        } else {
                            return (index * 2 + 3/2) * (width - 2 * padding) / virtual_count + padding - (width - 2 * padding) / virtual_count / 10 + 5;
                        }
                    })
                    .attr('y', 310)
                    .text(function (d) {
                        return d
                    });

                rate_details
                    .attr('text-anchor', 'middle')
                    .attr('x', function (d, index) {
                        if (index === 0) {
                            return 3/2 * (width - 2 * padding) / virtual_count + padding - (width - 2 * padding) / virtual_count / 10 + 5;
                        } else {
                            return (index * 2 + 3/2) * (width - 2 * padding) / virtual_count + padding - (width - 2 * padding) / virtual_count / 10 + 5;
                        }
                    })
                    .attr('y', 330)
                    .text(function (d) {
                        return d
                    });


                side_details
                    .attr('text-anchor', 'middle')
                    .attr('x',  padding/2 - 30)
                    .attr('y', function (d) {
                        return d * ((height - 50) / 4) + 5;
                    })
                    .text(function (d) {
                        var y_real = scale.invert(d * ((height - 50) / 4));
                        if (y_real / 10000 >= 1) {
                            return (y_real/10000).toFixed(1) + 'w';
                        } else if (y_real / 1000 >= 1) {
                            return (y_real/1000).toFixed(1) + 'k';
                        } else {
                            return y_real;
                        }
                    });
            }
        }
    });