module.exports = function enable_sidebar(params){
  $(params.root+' .slider').slider('enable');
  d3.selectAll(params.root+' .btn').attr('disabled',null);
        
  // d3.selectAll(params.root+' .category_section')
  //   .on('click', category_key_click)
  //   .select('text')
  //   .style('opacity',1);
};