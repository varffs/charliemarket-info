<?php
function scripts_and_styles_method() {
  $site_js = get_template_directory_uri() . '/dist/main.js';

  $current_theme = wp_get_theme();
  $theme_version = $current_theme->get('Version');

  wp_register_script( 'site-js', $site_js, array(), $theme_version );

  $global_javascript_variables = array(
  	'siteUrl' => home_url(),
  	'themeUrl' => get_template_directory_uri(),
  	'isAdmin' => current_user_can('administrator') ? 1 : 0,
  );

  wp_localize_script( 'site-js', 'WP', $global_javascript_variables );

  wp_enqueue_script( 'site-js', $site_js, array(), $theme_version, true );

  wp_enqueue_style( 'site', get_stylesheet_directory_uri() . '/dist/main.css', null, $theme_version );

  if (is_admin()) {
    wp_enqueue_style( 'dashicons' );
  }
}
add_action('wp_enqueue_scripts', 'scripts_and_styles_method');

if( function_exists( 'add_theme_support' ) ) {
  add_theme_support( 'post-thumbnails' );
}

if( function_exists( 'add_image_size' ) ) {
  add_image_size( 'admin-thumb', 150, 150, false );
  add_image_size( 'opengraph', 1200, 630, true );

  add_image_size( 'gallery-x-5', 9999, 540, false );
  add_image_size( 'gallery', 9999, 1080, false );
  add_image_size( 'gallery-x1-5', 9999, 1620, false );
  add_image_size( 'gallery-x2', 9999, 2160, false );
}

// Register Nav Menus

register_nav_menus( array(
	'footer_menu' => 'Footer Menu',
) );


get_template_part( 'lib/gallery' );
get_template_part( 'lib/post-types' );
get_template_part( 'lib/meta-boxes' );
get_template_part( 'lib/theme-options' );

add_action( 'init', 'cmb_initialize_cmb_meta_boxes', 9999 );
function cmb_initialize_cmb_meta_boxes() {
  // Add CMB2 plugin
  if( ! class_exists( 'cmb2_bootstrap_202' ) )
    require_once 'lib/CMB2/init.php';
}

// Disable that freaking admin bar
add_filter('show_admin_bar', '__return_false');

// Turn off version in meta
function no_generator() { return ''; }
add_filter( 'the_generator', 'no_generator' );

// Show thumbnails in admin lists
add_filter('manage_posts_columns', 'new_add_post_thumbnail_column');
function new_add_post_thumbnail_column($cols){
  $cols['new_post_thumb'] = __('Thumbnail');
  return $cols;
}
add_action('manage_posts_custom_column', 'new_display_post_thumbnail_column', 5, 2);
function new_display_post_thumbnail_column($col, $id){
  switch($col){
    case 'new_post_thumb':
    if( function_exists('the_post_thumbnail') ) {
      echo the_post_thumbnail( 'admin-thumb' );
      }
    else
    echo 'Not supported in theme';
    break;
  }
}

// remove automatic <a> links from images in blog
function wpb_imagelink_setup() {
	$image_set = get_option( 'image_default_link_type' );
	if($image_set !== 'none') {
		update_option('image_default_link_type', 'none');
	}
}
add_action('admin_init', 'wpb_imagelink_setup', 10);

// custom login logo
/*
function custom_login_logo() {
  echo '<style type="text/css">h1 a { background-image:url(' . get_bloginfo( 'template_directory' ) . '/images/login-logo.png) !important; background-size:300px auto !important; width:300px !important; }</style>';
}
add_action( 'login_head', 'custom_login_logo' );
*/

// UTILITY FUNCTIONS

// to replace file_get_contents
function url_get_contents($Url) {
  if (!function_exists('curl_init')){
      die('CURL is not installed!');
  }
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $Url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $output = curl_exec($ch);
  curl_close($ch);
  return $output;
}

// get ID of page by slug
function get_id_by_slug($page_slug) {
	$page = get_page_by_path($page_slug);
	if($page) {
		return $page->ID;
	} else {
		return null;
	}
}
// is_single for custom post type
function is_single_type($type, $post) {
  if (get_post_type($post->ID) === $type) {
    return true;
  } else {
    return false;
  }
}

// print var in <pre> tags
function pr($var) {
  echo '<pre>';
  print_r($var);
  echo '</pre>';
}

/**
 * Modify the rendered output of any block.
 *
 * @param string $block_content The normal block HTML that would be sent to the screen.
 * @param array  $block An array of data about the block, and the way the user configured it.
 */
function my_custom_render( $block_content, $block ) {

	// For the block in question, render whatever you want, and pull any attrinute you need from $block['attrs'].
	if ( $block['blockName'] === 'core/gallery' ) {
    $length = count($block['innerBlocks']);

    echo '<div class="cm-gallery" data-length="' . $length . '"><div class="cm-gallery__inner-wrapper"><div class="cm-gallery__inner">';

    foreach($block['innerBlocks'] as $key => $block) {
      $attributes = array(
        'class' => 'cm-gallery__image'
      );

      if ($key === 0) {
        $attributes['fetchpriority'] = 'high';
      } else if ($key === 1) {
        $attributes['fetchpriority'] = 'medium';
      } else if ($key === 2 || $key === 3) {
        $attributes['fetchpriority'] = 'low';
      } else

      if ($key > 4) {
        $attributes['loading'] = 'lazy';
      }

      echo '<div class="cm-gallery__item">';
      echo wp_get_attachment_image($block['attrs']['id'], 'gallery', false, $attributes);
      echo '</div>';
    }

    echo '</div></div></div>';
    return;
	}

	// For any other block, just return normal block output.
	return $block_content;

}
add_filter( 'render_block', 'my_custom_render', 10, 2 );

?>
