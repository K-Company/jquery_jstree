(function ($) {
  Drupal.behaviors.jstree = {
    attach: function (context, settings) {
      // Initialize any jsTree defined from PHP
      if ($.isPlainObject(settings.jstree)) {
        $.each(settings.jstree, function (id, options) {
            if (settings.jstree.hasOwnProperty(id)) {
              // Retrieve the tree element
              var tree = $('#'+id, context);
              if (tree.length) {
                // Pre-process options
                $.each(options, function(plugin, plugin_options) {
                  if (options.hasOwnProperty(plugin)) {
                    // Support URL pattern from tree/node data in plugins's ajax configuration
                    if (plugin_options.hasOwnProperty('ajax') && plugin_options.ajax.hasOwnProperty('pattern')) {
                      var pattern = decodeURI(plugin_options.ajax.pattern);
                      var patternMatcher = new RegExp('{(.*?)}', 'g');
                      plugin_options.ajax.url = function(node) {
                        var dataSource = (node !== -1) ? $(node) : tree;
                        return pattern.replace(patternMatcher, function(match, name){
                          return dataSource.data(name) || '';
                        });
                      };
                    }
                  }
                });
                // Build the tree
                tree.jstree(options);
                // And reset meta-data
                tree.data(options.metadata);
                // Store the tree element ID
                Drupal.behaviors.jstree.tree_ids.push('#'+id);
                
                var form = tree.parents('form');
                if (form.length) {
                 // Sync. tree-node selection to hidden fields in parent form. 
                  var inputName = tree.data('name');
                  tree.bind('select_node.jstree deselect_node.jstree', function(e, data) {
                    console.log('sync.');
                    form.find('input.selected-node').remove();
                    tree.jstree('get_selected').each(function(index, node) {
                      $.each($(node).data(), function(name, value) {
                        $('<input></input>').attr({
                          type: 'hidden',
                          name: inputName + '[' + index + '][' + name + ']',
                          value: value,
                          'class': 'selected-node'
                        }).appendTo(form);
                      });
                    });
                  });
                  // Ensure that our sync. handler is always the first one
                  var events = tree.data('events');
                  var handlers = events['select_node'];
                  handlers.splice(0, 0, handlers.pop());
                  handlers = events['deselect_node'];
                  handlers.splice(0, 0, handlers.pop());
                  
                  // Serialize the parent form when the tree triggers an ajax event
                  if (typeof Drupal.ajax === 'function' && Drupal.ajax.hasOwnProperty(id)) {
                    Drupal.ajax[id].beforeSerialize = function(element, options) {
                      console.log('beforeSerialize');
                      $.each(form.serializeArray(), function(id, param) {
                        options.data[param.name] = param.value;
                      });
                      Drupal.ajax.prototype.beforeSerialize.apply(this, arguments);
                    };
                  }
                }
              }
            }
        });
      }
    },
    detach: function (context) {
      // Destroy any (automatically created) jsTree in the detached context
      if ($.isPlainObject(Drupal.settings.jstree)) {
        $.each(Drupal.settings.jstree, function (id, options) {
          if (Drupal.settings.jstree.hasOwnProperty(id)) {
            var tree = $('#'+id, context);
            tree.jstree('destroy');
          }
        });
      };
    },
    tree_ids: []
  };
}(jQuery));
