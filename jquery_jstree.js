(function ($) {
  Drupal.behaviors.jstree = {
    attach: function (context, settings) {
      // Initialize any jsTree defined from PHP
      if ($.isPlainObject(Drupal.settings.jstree)) {
        $.each(Drupal.settings.jstree, function (id, options) {
            if (Drupal.settings.asOwnProperty(id)) {
            // Build the tree
            var tree = $('#'+id).jstree(options);
            // And reset meta-data
            tree.data(options.metadata);
            // Store the tree element ID
            Drupal.behaviors.jstree.tree_ids.push('#'+id);
          }
        });
      }
    },
    detach: function (context) {
      // Destroy any (automatically created) jsTree in the detached context
      $(context, Drupal.behaviors.jstree.tree_ids.join(', ')).each(function(){
        $(this).jstree('destroy');
        // TODO remove $(this).attr('id') from Drupal.behaviors.jstree.tree_ids
      });
    },
    tree_ids: []
  };
}(jQuery));
