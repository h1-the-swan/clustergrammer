var get_cat_title = require('../categories/get_cat_title');
var d3_tip_custom = require('../tooltip/d3_tip_custom');

module.exports = function make_row_cat_super_labels(cgm){

  var params = cgm.params;

  var viz = params.viz;
  var extra_x_room = 2.75;

  if (d3.select(params.root + ' .row_cat_label_container').empty()){

    d3.select(cgm.params.viz.viz_svg)
      .append('g')
      .classed('row_cat_label_container', true);

    // append background section for optional value-bars (e.g. enrichment pvals)
    d3.select(cgm.params.viz.viz_svg + ' .row_cat_label_container')
      .append('g')
      .classed('row_cat_label_bar_container', true);
  }


  var x_offset = viz.clust.margin.left + viz.clust.dim.width + viz.uni_margin;
  var y_offset = viz.norm_labels.margin.top + viz.norm_labels.width.col
    + 2.5*viz.uni_margin;
  var cat_text_size = 1.15*viz.cat_room.symbol_width;
  var cat_super_opacity = 0.65;
  var extra_y_room = 1.25;

  d3.select(params.root+' .row_cat_label_container')
    .attr('transform', function(){
      x_offset = viz.norm_labels.margin.left + viz.norm_labels.width.row
        + viz.cat_room.symbol_width + extra_x_room * viz.uni_margin;
      y_offset = viz.clust.margin.top - viz.uni_margin;
      return 'translate('+x_offset+','+y_offset+') rotate(-90)';
    });


  // clear old categories
  d3.selectAll(params.root+' .row_cat_label_container text').remove();
  d3.selectAll(params.root+' .row_cat_selection_bar').remove();
  // d3.selectAll(params.root+' .row_cat_label_bar_container rect').remove();

  // remove any old row_cat_super tooltips from this visualization
  d3.selectAll(cgm.params.viz.root_tips+'_row_cat_super').remove();

  // d3-tooltip
  var tmp_y_offset = 50 ; // viz.clust.margin.top - viz.uni_margin;
  var tmp_x_offset = -75;
  var cat_tip = d3_tip_custom()
    .attr('class',function(){
      var root_tip_selector = params.viz.root_tips.replace('.','');
      var class_string = root_tip_selector + ' d3-tip '+
                         root_tip_selector +'_row_cat_super';
      return class_string;
    })
    .direction('south_custom')
    .offset([tmp_y_offset, tmp_x_offset])
    .style('display','none')
    .style('opacity', 0)
    .html(function(d){

      var full_string;

      var tmp_string = params.network_data.row_nodes[0][d];

      if (tmp_string.indexOf('<p>') > -1){

        var start_string = tmp_string.split(': ')[0];
        var end_string = tmp_string.split('<p>')[1];

        full_string = start_string + '<p>' + end_string;
      }
      else{

        full_string = get_cat_title(viz, d, 'row');
      }

      return full_string;
    });

  var unit_length = extra_y_room * viz.cat_room.symbol_width;
  var bar_width = unit_length * 0.9;

  // do not show row label categories if you are viewing a similarity matrix
  if (viz.sim_mat === false){

    d3.select(params.root+' .row_cat_label_container')
      .selectAll()
      .data(viz.all_cats.row)
      .enter()
      .append('text')
      .style('width', '100px')
      .style('height', bar_width+ 'px')
      .classed('row_cat_super',true)
      .style('font-size', cat_text_size+'px')
      .style('opacity', cat_super_opacity)
      .style('cursor','default')
      .attr('transform', function(d){
        var inst_y = extra_y_room*viz.cat_room.symbol_width
          * parseInt( d.split('-')[1], 10 );
        return 'translate(0,'+inst_y+')';
      })
      .text(function(d){

        console.log(d)
        console.log(get_cat_title(viz, d, 'row'))

        return get_cat_title(viz, d, 'row');
      });

    // // optional bar behind name
    // ///////////////////////////////
    // d3.select('.row_cat_label_bar_container')
    //   .selectAll()
    //   .data(viz.all_cats.row)
    //   .enter()
    //   .append('rect')
    //   .style('height', bar_width +'px')
    //   .style('fill', 'green')
    //   .style('width','60px')
    //   .style('opacity', 0)
    //   .attr('transform', function(d){
    //     var inst_y = unit_length * (parseInt( d.split('-')[1], 10 ) -0.75 );
    //     return 'translate(0,'+inst_y+')';
    //   })

    // selection bar
    ///////////////////////////////
    d3.select(params.root+' .row_cat_label_container')
      .selectAll()
      .data(viz.all_cats.row)
      .enter()
      .append('rect')
      .classed('row_cat_super',true)
      .classed('row_cat_selection_bar', true)
      .style('height', bar_width +'px')
      .style('fill', 'green')
      .style('width','120px')
      .style('opacity', 0)
      .attr('transform', function(d){
        var inst_y = unit_length * (parseInt( d.split('-')[1], 10 ) -0.75 );
        return 'translate(0,'+inst_y+')';
      })
      .on('mouseover', function(d){

        d3.selectAll(params.viz.root_tips+'_row_cat_super')
          .style('display', 'block')
          .style('opacity', 1);

        cat_tip.show(d);
      })
      .on('mouseout', function(){
        cat_tip.hide(this);
        // might not need
        d3.selectAll('.d3-tip')
          .style('display', 'none');

        d3.selectAll(params.viz.root_tips+'_row_cat_super')
          .style('display', 'none')
          .style('opacity', 0);

      });

  }

  // row category super-label mouseover
  //////////////////////////////////////
  if (d3.select(params.root+' .row_cat_selection_bar').empty() === false){
    d3.selectAll(params.root+' .row_cat_selection_bar')
      .call(cat_tip);
  }

};