OVERVIEW
--------
Integration of the jsTree jQuery plugin (http://www.jstree.com/) as Drupal libraries.

INSTALLATION
------------

1. Copy the content of jstree_pre1.0_stable.zip archive directory to sites/all/libraries/jstree directory.

2. Enable the module at Administer >> Site building >> Modules.

USAGE
-----
To include the libraries to your page, use one of
<?php
  // Adding the libary directly
  drupal_add_library('jquery_jstree', 'jstree');
  // Attaching to library to a Render/From API element
  $element['#attached']['library'] = array('jquery_jstree', 'jstree');
?>

You can also use the jstree #type for an element:
<?php
  $page['tree'] = array(
    '#type' => 'jstree',
    'data' => '<ul><li><a>Item 1</a><ul><li><a>Item 1.1</a></li><li><a>Item 1.2</a></li></ul></li><li><a>Item 2</a><ul><li><a>Item 2.1</a></li><li><a>Item 2.2</a></li></ul></li></ul>',
  );
?>
