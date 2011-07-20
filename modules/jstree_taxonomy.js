(function ($, drupalSettings) {
  $.jstree.plugin("drupal_taxonomy", {
    __init: function() {
      if(!this.data.json_data) { throw "jsTree Drupal Taxonomy: jsTree JSON_DATA plugin not included."; }
      var json_data = this._get_settings().json_data;
      var settings = this._get_settings().drupal_taxonomy;
      var self = this;
      if (json_data.data !== false || json_data.ajax !== false) { throw "jsTree Drupal Taxonomy: jsTree JSON_DATA data or ajax settings supplied."; }
      if (typeof drupalSettings.basePath !== 'string') { throw "jsTree Drupal Taxonomy: Drupal.settings.basePath settings must be supplied.";}
      if (typeof settings.vid !== 'number') { throw "jsTree Drupal Taxonomy: The vid settings must be supplied.";}
      json_data.ajax = {
        url: function(node) {
          var tid = (node !== -1) ? self.get_term(node).tid : settings.parent;
          var vid = settings.vid;
          return drupalSettings.basePath + 'taxonomy/jstree/load/' + vid + '/' + tid;
        },
        success: $.proxy(function(data) {
          if ($.isArray(data)) {
            var nodes = [], count = 0;
            $.each(data, function(index, term) {
              nodes[count++] = self._term_node_data(term);
            });
            return nodes;
          }
        }, this)
      };
    },
    __destroy: function() {
      
    },
    defaults: {
      vid: false,
      parent: 0
    },
    _fn: {
      /**
       * Produces a node data object as expected by the jsTree JSON_DATA plugin.
       * @param term
       *  A term object (JSON version of a Drupal term object).
       * @returns
       *  An object suitable for loading by the JSON_DATA plugin.
       */
      _term_node_data: function(term) {
        var node = {
          data: {
            title: term.name,
            attr: {
              title: $('<div></div>').html(term.description).text(),
              'class': 'taxonomy-' + term.vocabulary_machine_name
            }
          },
          attr: {
            id: 'term-' + term.tid
          },
          metadata: {
            term: term,
            'form-value': term.tid
          },
          state: 'closed'
        };
        return node;
      },
      /**
       * Return the term object 
       * @param node
       *  A jsTree node.
       * @returns
       *  A term object (JSON version of a Drupal term object).
       */
      get_term: function(node) {
        return $(node).data('term');
      }
    }
  });
}(jQuery, Drupal.settings));