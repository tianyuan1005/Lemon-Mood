export default {
  name: 'ElMarker',

  props: {
    mark: {
      type: [String, Object]
    }
  },
  render() {
    let label = typeof this.mark === 'string' ? this.mark : this.mark.label;

    return ('<div class="my-el-slider__marks-text" style={ this.mark.style || {} }>{ label }</div>');
  }
};
