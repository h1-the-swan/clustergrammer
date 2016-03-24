module.exports = function enter_split_tiles(params, inp_row_data, row_selection, tip, delays, duration, tile){

  // value split
  var row_split_data = _.filter(inp_row_data, function(num){
    return num.value_up != 0 || num.value_dn !=0 ;
  });

  // tile_up
  var new_tiles_up = d3.select(row_selection)
    .selectAll('.tile_up')
    .data(row_split_data, function(d){ return d.col_name; })
    .enter()
    .append('path')
    .attr('class','tile_up')
    .attr('d', function() {

      // up triangle
      var start_x = 0;
      var final_x = params.viz.x_scale.rangeBand();
      var start_y = 0;
      var final_y = params.viz.y_scale.rangeBand() - params.viz.y_scale.rangeBand() /60;

      var output_string = 'M' + start_x + ',' + start_y + ', L' +
      start_x + ', ' + final_y + ', L' + final_x + ',0 Z';

      return output_string;
    })
    .attr('transform', function(d) {
      var x_pos = params.viz.x_scale(d.pos_x) + 0.5*params.viz.border_width;
      var y_pos = 0.5*params.viz.border_width/params.viz.zoom_switch;
      return 'translate(' + x_pos + ','+y_pos+')';
    })
    .style('fill', function() {
      return params.matrix.tile_colors[0];
    })
    .on('mouseover', function(p) {
    // highlight row - set text to active if
    d3.selectAll(params.root+' .row_label_group text')
      .classed('active', function(d) {
        return p.row_name === d.name;
      });

    d3.selectAll(params.root+' .col_label_text text')
      .classed('active', function(d) {
        return p.col_name === d.name;
      });
    if (params.matrix.show_tile_tooltips){
      tip.show(p);
    }
  })
  .on('mouseout', function() {
    d3.selectAll(params.root+' text').classed('active', false);
    if (params.matrix.show_tile_tooltips){
      tip.hide();
    }
  });

  new_tiles_up
    .style('fill-opacity',0)
    .transition().delay(delays.enter).duration(duration)
    .style('fill-opacity',function(d){
      var inst_opacity = 0;
      if (Math.abs(d.value_dn)>0){
        inst_opacity = params.matrix.opacity_scale(Math.abs(d.value_up));
      }
      return inst_opacity;
    });


  // tile_dn
  var new_tiles_dn = d3.select(row_selection)
    .selectAll('.tile_dn')
    .data(row_split_data, function(d){return d.col_name;})
    .enter()
    .append('path')
    .attr('class','tile_dn')
    .attr('d', function() {

      // dn triangle
      var start_x = 0;
      var final_x = params.viz.x_scale.rangeBand();
      var start_y = params.viz.y_scale.rangeBand();
      var final_y = params.viz.y_scale.rangeBand();

      var output_string = 'M' + start_x + ', ' + start_y + ' ,   L' +
      final_x + ', ' + final_y + ',  L' + final_x + ',0 Z';

      return output_string;
    })
    .attr('transform', function(d) {
      var x_pos = params.viz.x_scale(d.pos_x) + 0.5*params.viz.border_width;
      var y_pos = 0.5*params.viz.border_width/params.viz.zoom_switch;
      return 'translate(' + x_pos + ','+y_pos+')';
    })
    .style('fill', function() {
      return params.matrix.tile_colors[1];
    })
    .on('mouseover', function(p) {
    // highlight row - set text to active if
    d3.selectAll(params.root+' .row_label_group text')
      .classed('active', function(d) {
        return p.row_name === d.name;
      });

    d3.selectAll(params.root+' .col_label_text text')
      .classed('active', function(d) {
        return p.col_name === d.name;
      });
    if (params.matrix.show_tile_tooltips){
      tip.show(p);
    }
  })
  .on('mouseout', function() {
    d3.selectAll(params.root+' text').classed('active', false);
    if (params.matrix.show_tile_tooltips){
      tip.hide();
    }
  });

  new_tiles_dn
    .style('fill-opacity',0)
    .transition().delay(delays.enter).duration(duration)
    .style('fill-opacity',function(d){
      var inst_opacity = 0;
      if (Math.abs(d.value_up)>0){
        inst_opacity = params.matrix.opacity_scale(Math.abs(d.value_dn));
      }
      return inst_opacity;
    });

  // remove tiles when splitting is done
  tile
    .each(function(d){
      if ( Math.abs(d.value_up)>0 && Math.abs(d.value_dn)>0 ){
        d3.select(this)
          .remove();
      }
    });

};