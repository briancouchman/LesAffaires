define(['angular', 'app', 'd3'], function(angular, app) {
	//console.log("Defining services");
	return app.service('graphService', function($http, $q){

		this.buildCircularTree = function(options){

			//build style
			var radius = 800 / 2;

			var cluster = d3.layout.cluster()
				.size([360, radius - 120]);

			var diagonal = d3.svg.diagonal.radial()
				.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

			var svg = d3.select("#similar_tree").html("").append("svg")
				.attr("width", radius * 2)
				.attr("height", radius * 2)
			  .append("g")
				.attr("transform", "translate(" + radius + "," + radius + ")");

			var clickHandler = function(d){
				if(typeof options.onclick === "function"){
					d3.select("#similar_tree").html("");
					options.onclick.call(this,d);
				}
			}

			//build tree

			var nodes = cluster.nodes(options.json);

			var link = svg.selectAll("path.link")
				.data(cluster.links(nodes))
				.enter().append("path")
				.attr("class", "link")
				.attr("d", diagonal);

			var node = svg.selectAll("g.node")
				.data(nodes)
				.enter().append("g")
				.attr("class", "node")
				.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

			node.append("circle")
				.attr("r", 4.5)
				.on("click", clickHandler);

			node.append("text")
				.attr("dy", ".31em")
				.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
				.attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
				.text(function(d) { return d.name; })
				.on("click", clickHandler);
		}
	});
});